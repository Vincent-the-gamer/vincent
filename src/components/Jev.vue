<script setup lang="ts">
import { createSnackbar } from "@snackbar/core";

/**
 * Jev 模型代理接口。
 * 服务端会把 http 308 跳转到 https，而本站以 https 部署，
 * 因此直接使用 https，避免浏览器以「混合内容」为由拦截请求。
 * 该接口已开启 CORS（access-control-allow-origin: *），可从前端直接调用。
 */
const API_URL = "https://api-proxy.vince-g.xyz/jev";

/** 问题类型：choice 从选项中选一个；noul 返回是/否概率；score 按有序标准打分。 */
type JevType = "choice" | "noul" | "score";

interface JevResult {
    type: JevType;
    probabilities: number[];
    decisionIndex: number;
    confidence?: number;
    score?: number;
    model: string;
    requestId: string;
    latencyMs: number;
}

interface JevApiResponse {
    code: number;
    message: string;
    data: JevResult;
}

interface JevExample {
    title: string;
    type: JevType;
    state: string;
    question: string;
    options?: string[];
}

const MAX_OPTIONS = 255;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const questionTypes: {
    value: JevType;
    label: string;
    icon: string;
    desc: string;
}[] = [
    {
        value: "choice",
        label: "Choice",
        icon: "i-carbon-list-checked",
        desc: "从你定义的列表中选出唯一答案，返回完整概率分布。",
    },
    {
        value: "noul",
        label: "Noul",
        icon: "i-carbon-boolean",
        desc: "针对状态提出是/否问题，返回答案为「是」的概率。",
    },
    {
        value: "score",
        label: "Score",
        icon: "i-carbon-meter",
        desc: "按有序标准为状态打分，返回加权期望分数。",
    },
];

const examples: JevExample[] = [
    {
        title: "客服工单路由",
        type: "choice",
        state: "一位客户写道：「这个月同一个套餐被扣了两次费，能退回其中一笔吗？」",
        question: "这个工单应该交给哪个团队处理？",
        options: ["账单", "技术支持", "销售", "账户安全"],
    },
    {
        title: "智能体工具选择",
        type: "choice",
        state: "用户说：「帮我查一下明天北京到上海的高铁还有没有票。」智能体当前可用的工具：网页搜索、日历、订票系统、计算器。",
        question: "智能体下一步应该调用哪个工具？",
        options: ["网页搜索", "日历", "订票系统", "计算器"],
    },
    {
        title: "智能体循环控制",
        type: "choice",
        state: "智能体已连续三次调用接口，均返回 500 错误，重试次数已用掉一半，且没有获得任何新的可用信息。",
        question: "智能体接下来应该怎么做？",
        options: ["继续", "重试", "询问用户", "停止"],
    },
    {
        title: "紧急程度识别",
        type: "noul",
        state: "用户消息：「我的账号刚刚在异地登录了，我怀疑被盗，请立刻帮我冻结！」",
        question: "这条消息需要立即回复吗？",
    },
    {
        title: "内容安全过滤",
        type: "noul",
        state: "用户准备发布的评论：「这个教程写得真好，已经收藏了，感谢作者！」",
        question: "这条评论包含需要拦截的违规内容吗？",
    },
    {
        title: "风险评估",
        type: "score",
        state: "即将执行的操作：删除生产环境数据库中 30 天前的日志表，且该操作不可回滚。",
        question: "这个操作的风险等级有多高？",
        options: ["极低", "较低", "中等", "较高", "极高"],
    },
    {
        title: "客户不满程度评分",
        type: "score",
        state: "客户消息：「你们的产品把我三个月的报表都弄丢了，我要投诉到底！」",
        question: "这位客户的不满程度如何？",
        options: ["平静", "不满", "愤怒", "暴怒"],
    },
];

const questionType = ref<JevType>("choice");
const state = ref<string>("");
const question = ref<string>("");
const options = ref<string[]>(["", "", ""]);

const loading = ref(false);
const errorMsg = ref("");
const result = ref<JevResult | null>(null);
/** 提交时冻结的标签快照，避免提交后修改输入导致结果错位。 */
const resultLabels = ref<string[]>([]);

const isChoiceLike = computed(() => questionType.value !== "noul");

const bars = computed(() => {
    const r = result.value;
    if (!r) return [];
    return r.probabilities.map((probability, index) => ({
        label: resultLabels.value[index] ?? `选项 ${index + 1}`,
        percent: probability * 100,
        isDecision: index === r.decisionIndex,
    }));
});

const decisionText = computed(() => {
    const r = result.value;
    if (!r) return "";
    return resultLabels.value[r.decisionIndex] ?? `选项 ${r.decisionIndex + 1}`;
});

const decisionPercent = computed(() => {
    const r = result.value;
    if (!r) return 0;
    return (r.probabilities[r.decisionIndex] ?? 0) * 100;
});

const noulYes = computed(() => {
    const r = result.value;
    if (!r || r.type !== "noul") return 0;
    return (r.probabilities[0] ?? 0) * 100;
});

/** score 是 0 基的期望等级，换算成 1~N 分制展示更直观。 */
const expectedScore = computed(() => {
    const r = result.value;
    if (!r || r.type !== "score" || r.score === undefined) return null;
    return { current: r.score + 1, max: r.probabilities.length };
});

const rawJson = computed(() =>
    result.value ? JSON.stringify(result.value, null, 2) : "",
);

function optionLabel(index: number): string {
    return index < LETTERS.length ? LETTERS[index] : String(index + 1);
}

function selectType(type: JevType) {
    if (questionType.value === type) return;
    questionType.value = type;
    clearResult();
}

function addOption() {
    if (options.value.length >= MAX_OPTIONS) return;
    options.value.push("");
}

function removeOption(index: number) {
    if (options.value.length <= 2) return;
    options.value.splice(index, 1);
}

function loadExample(example: JevExample) {
    questionType.value = example.type;
    state.value = example.state;
    question.value = example.question;
    if (example.type === "noul") {
        clearResult();
        return;
    }
    const opts = example.options?.slice(0, MAX_OPTIONS) ?? [];
    options.value = opts.length >= 2 ? opts : ["", "", ""];
    clearResult();
}

function reset() {
    state.value = "";
    question.value = "";
    options.value = ["", "", ""];
    clearResult();
}

function clearResult() {
    result.value = null;
    errorMsg.value = "";
}

function toast(message: string) {
    createSnackbar(message, {
        timeout: 2200,
        actions: [
            {
                text: "关闭",
                style: { color: "pink" },
                callback(_button, snackbar) {
                    snackbar.destroy();
                },
            },
        ],
    });
}

function validate(): string | null {
    if (!state.value.trim()) return "请填写状态（state）";
    if (!question.value.trim()) return "请填写问题（question）";
    if (isChoiceLike.value) {
        if (options.value.length < 2) return "至少需要 2 个选项";
        if (options.value.some((o) => !o.trim())) return "选项内容不能为空";
    }
    return null;
}

async function run() {
    if (loading.value) return;

    const invalid = validate();
    if (invalid) {
        toast(invalid);
        return;
    }

    const labels = isChoiceLike.value
        ? options.value.map((o) => o.trim())
        : ["是", "否"];

    const payload: Record<string, unknown> = {
        type: questionType.value,
        state: state.value.trim(),
        question: question.value.trim(),
    };
    if (isChoiceLike.value) payload.options = labels;

    loading.value = true;
    errorMsg.value = "";
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = (await res
            .json()
            .catch(() => null)) as JevApiResponse | null;

        if (!res.ok)
            throw new Error(json?.message || `请求失败（HTTP ${res.status}）`);
        if (!json || json.code !== 0)
            throw new Error(json?.message || "接口返回了未知错误");

        result.value = json.data;
        resultLabels.value = labels;
        toast("决策完成");
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        errorMsg.value = message;
        toast(`决策失败：${message}`);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="jev slide-enter">
        <p class="intro">
            Jev 是 TypeSafe AI 的 System One
            Model。它不写长段文字，而是用一个<b>类型化决策</b>和<b>校准概率</b>来回答结构化问题：软件提出一个有边界的问题，拿回一个可以直接使用、置信度可以核查的决策。
        </p>

        <!-- 问题类型 -->
        <div class="type-tabs">
            <button
                v-for="t in questionTypes"
                :key="t.value"
                class="type-tab"
                :class="{ active: questionType === t.value }"
                type="button"
                @click="selectType(t.value)"
            >
                <div class="type-icon" :class="t.icon" />
                <div class="type-text">
                    <span class="type-label">{{ t.label }}</span>
                    <span class="type-desc">{{ t.desc }}</span>
                </div>
            </button>
        </div>

        <div class="play-grid">
            <!-- 输入 -->
            <section class="panel">
                <header class="panel-head">
                    <span>输入</span>
                    <span class="panel-tag">{{ questionType }}</span>
                </header>

                <label class="field">
                    <span class="field-label"> 状态 <code>state</code> </span>
                    <span class="field-hint">你的软件需要评估的上下文</span>
                    <textarea
                        v-model="state"
                        rows="4"
                        placeholder="描述你的软件正在面对的情况……"
                        @keydown.ctrl.enter.prevent="run"
                        @keydown.meta.enter.prevent="run"
                    />
                </label>

                <label class="field">
                    <span class="field-label">
                        问题 <code>question</code>
                    </span>
                    <span class="field-hint">
                        {{
                            questionType === "noul"
                                ? "一个可以用是/否回答的问题"
                                : "一个聚焦的问题"
                        }}
                    </span>
                    <input
                        v-model="question"
                        type="text"
                        placeholder="例如：这个请求应该交给哪个团队处理？"
                    />
                </label>

                <div v-if="isChoiceLike" class="field">
                    <span class="field-label">
                        选项 <code>options</code>
                        <em v-if="questionType === 'score'">按从低到高排序</em>
                        <em v-else>{{ options.length }} / {{ MAX_OPTIONS }}</em>
                    </span>

                    <div v-for="(_, i) in options" :key="i" class="option-row">
                        <span class="option-badge">{{ optionLabel(i) }}</span>
                        <input
                            v-model="options[i]"
                            type="text"
                            :placeholder="`选项 ${optionLabel(i)}`"
                        />
                        <button
                            class="option-remove"
                            type="button"
                            :disabled="options.length <= 2"
                            title="删除选项"
                            @click="removeOption(i)"
                        >
                            <div i-carbon-close />
                        </button>
                    </div>

                    <button
                        class="option-add"
                        type="button"
                        :disabled="options.length >= MAX_OPTIONS"
                        @click="addOption"
                    >
                        <div i-carbon-add />
                        添加选项
                    </button>
                </div>

                <div class="actions">
                    <button
                        class="btn-run"
                        type="button"
                        :disabled="loading"
                        @click="run"
                    >
                        <div
                            :class="
                                loading
                                    ? 'i-carbon-circle-dash spin'
                                    : 'i-carbon-play'
                            "
                        />
                        {{ loading ? "决策中…" : "运行决策" }}
                    </button>
                    <button class="btn-ghost" type="button" @click="reset">
                        重置
                    </button>
                </div>

                <div class="privacy">
                    <div i-carbon-warning-alt />
                    <span>请勿输入密码、个人数据或其他敏感信息。</span>
                </div>
            </section>

            <!-- 输出 -->
            <section class="panel output">
                <header class="panel-head">
                    <span>输出</span>
                    <span v-if="result" class="panel-tag ok">就绪</span>
                </header>

                <div v-if="loading" class="state-block">
                    <div class="spinner" />
                    <p>Jev 正在做出决策…</p>
                </div>

                <div v-else-if="errorMsg" class="state-block error">
                    <div i-carbon-error-outline />
                    <p>{{ errorMsg }}</p>
                    <small>请检查网络或稍后重试。</small>
                </div>

                <div v-else-if="result" class="result">
                    <div class="decision">
                        <span class="decision-kicker">决策</span>
                        <div class="decision-value">{{ decisionText }}</div>
                        <div class="decision-prob">
                            P = {{ decisionPercent.toFixed(1) }}%
                        </div>
                    </div>

                    <div class="bars">
                        <div
                            v-for="(bar, i) in bars"
                            :key="i"
                            class="bar"
                            :class="{ on: bar.isDecision }"
                        >
                            <div class="bar-top">
                                <span class="bar-label">{{ bar.label }}</span>
                                <span class="bar-percent"
                                    >{{ bar.percent.toFixed(1) }}%</span
                                >
                            </div>
                            <div class="bar-track">
                                <div
                                    class="bar-fill"
                                    :style="{ width: `${bar.percent}%` }"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="metrics">
                        <div v-if="result.type === 'noul'" class="metric">
                            <span class="metric-label">P(是)</span>
                            <span class="metric-value"
                                >{{ noulYes.toFixed(1) }}%</span
                            >
                        </div>
                        <div
                            v-if="result.confidence !== undefined"
                            class="metric"
                        >
                            <span class="metric-label">置信度</span>
                            <span class="metric-value"
                                >{{
                                    (result.confidence * 100).toFixed(1)
                                }}%</span
                            >
                        </div>
                        <div v-if="expectedScore" class="metric">
                            <span class="metric-label">E[score]</span>
                            <span class="metric-value"
                                >{{ expectedScore.current.toFixed(2) }} /
                                {{ expectedScore.max }}</span
                            >
                        </div>
                        <div class="metric">
                            <span class="metric-label">延迟</span>
                            <span class="metric-value"
                                >{{ result.latencyMs }} ms</span
                            >
                        </div>
                    </div>

                    <details class="raw">
                        <summary>查看原始响应 JSON</summary>
                        <pre>{{ rawJson }}</pre>
                    </details>

                    <p class="meta">
                        {{ result.model }} · {{ result.requestId }}
                    </p>
                </div>

                <div v-else class="state-block empty">
                    <div i-carbon-cube />
                    <p>随时可以开始</p>
                    <small
                        >编辑输入或加载一个示例，然后运行决策，看看 Jev
                        如何作答。</small
                    >
                </div>
            </section>
        </div>

        <!-- 示例 -->
        <section class="examples">
            <h3>试试这些示例</h3>
            <div class="example-chips">
                <button
                    v-for="example in examples"
                    :key="example.title"
                    class="chip"
                    type="button"
                    @click="loadExample(example)"
                >
                    <span class="chip-type" :class="`t-${example.type}`">{{
                        example.type
                    }}</span>
                    {{ example.title }}
                </button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.jev {
    --card: #ffffff;
    --card-2: #f5f5f6;
    --line: #0000001a;
    --text: #1a1a1a;
    --muted: #6b7280;
    --accent: #6d5efc;
    --accent-soft: #6d5efc22;
    --danger: #e11d48;
    --ok: #16a34a;

    max-width: 1080px;
    margin: 0 auto;
    color: var(--text);
}

.dark .jev {
    --card: #121214;
    --card-2: #1b1b1e;
    --line: #ffffff1f;
    --text: #ececec;
    --muted: #9aa0a6;
    --accent: #8b7dff;
    --accent-soft: #8b7dff2b;
}

.intro {
    max-width: 46rem;
    margin: 0 auto 1.5rem;
    text-align: center;
    font-size: 0.92rem;
    line-height: 1.75;
    color: var(--muted);
}

.intro b {
    color: var(--text);
}

/* 问题类型 */
.type-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}

.type-tab {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--card);
    color: var(--text);
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background 0.2s ease,
        box-shadow 0.2s ease;
}

.type-tab:hover {
    border-color: var(--accent);
}

.type-tab.active {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow: 0 0 0 3px var(--accent-soft);
}

.type-icon {
    flex: none;
    margin-top: 0.1rem;
    font-size: 1.3rem;
    color: var(--accent);
}

.type-text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.type-label {
    font-weight: 700;
    letter-spacing: 0.02em;
}

.type-desc {
    font-size: 0.76rem;
    line-height: 1.5;
    color: var(--muted);
}

/* 主体 */
.play-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
}

.panel {
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--card);
    padding: 1.1rem 1.15rem;
}

.panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.panel-tag {
    padding: 0.15rem 0.5rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--card-2);
    color: var(--muted);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.panel-tag.ok {
    color: var(--ok);
    border-color: color-mix(in srgb, var(--ok) 45%, transparent);
}

/* 表单 */
.field {
    display: block;
    margin-bottom: 0.9rem;
}

.field-label {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
}

.field-label code {
    padding: 0.05rem 0.35rem;
    border-radius: 5px;
    background: var(--card-2);
    color: var(--muted);
    font-size: 0.72rem;
}

.field-label em {
    margin-left: auto;
    color: var(--muted);
    font-size: 0.72rem;
    font-style: normal;
}

.field-hint {
    display: block;
    margin: 0.15rem 0 0.4rem;
    color: var(--muted);
    font-size: 0.76rem;
}

.jev input[type="text"],
.jev textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--card-2);
    color: var(--text);
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
    outline: none;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.jev textarea {
    min-height: 5.5rem;
    resize: vertical;
}

.jev input[type="text"]:focus,
.jev textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
}

/* 选项 */
.option-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.45rem;
}

.option-badge {
    display: grid;
    flex: none;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 8px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 700;
}

.option-remove {
    display: grid;
    flex: none;
    place-items: center;
    width: 1.9rem;
    height: 1.9rem;
    border: 1px solid var(--line);
    border-radius: 9px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition:
        color 0.15s ease,
        border-color 0.15s ease;
}

.option-remove:hover:not(:disabled) {
    color: var(--danger);
    border-color: var(--danger);
}

.option-remove:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.option-add {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.2rem;
    padding: 0.4rem 0.7rem;
    border: 1px dashed var(--line);
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    font-size: 0.82rem;
    cursor: pointer;
    transition:
        color 0.15s ease,
        border-color 0.15s ease;
}

.option-add:hover:not(:disabled) {
    color: var(--accent);
    border-color: var(--accent);
}

.option-add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* 操作 */
.actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 1rem;
}

.btn-run {
    display: inline-flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.65rem 1rem;
    border: none;
    border-radius: 11px;
    background: linear-gradient(120deg, #7b5cff, #ff5ca8);
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.btn-run:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-run:disabled {
    opacity: 0.6;
    cursor: progress;
}

.btn-ghost {
    padding: 0.65rem 1rem;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.15s ease;
}

.btn-ghost:hover {
    color: var(--text);
}

.privacy {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.85rem;
    color: var(--muted);
    font-size: 0.76rem;
}

.privacy > div {
    flex: none;
    color: #d9930a;
}

/* 输出 */
.output {
    display: flex;
    flex-direction: column;
    min-height: 22rem;
}

.state-block {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 2rem 0;
    color: var(--muted);
    text-align: center;
}

.state-block > div:first-child {
    font-size: 2rem;
    opacity: 0.5;
}

.state-block p {
    margin: 0;
    font-size: 0.95rem;
}

.state-block small {
    max-width: 24rem;
    font-size: 0.78rem;
    opacity: 0.85;
}

.state-block.error {
    color: var(--danger);
}

.spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--accent-soft);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: jev-spin 0.8s linear infinite;
}

.result {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.decision {
    padding: 1rem;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--card-2);
    text-align: center;
}

.decision-kicker {
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
}

.decision-value {
    margin: 0.2rem 0;
    color: var(--text);
    font-size: 1.7rem;
    font-weight: 800;
    line-height: 1.25;
    word-break: break-word;
}

.decision-prob {
    color: var(--accent);
    font-family: monospace;
    font-size: 0.85rem;
    font-weight: 600;
}

.bars {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.bar-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    color: var(--muted);
    font-size: 0.82rem;
}

.bar.on .bar-top {
    color: var(--text);
    font-weight: 600;
}

.bar-percent {
    font-family: monospace;
}

.bar-track {
    height: 0.5rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--card-2);
    overflow: hidden;
}

.bar-fill {
    width: 0;
    height: 100%;
    border-radius: 999px;
    background: #9aa0a6;
    transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.bar.on .bar-fill {
    background: linear-gradient(90deg, #7b5cff, #ff5ca8);
}

.metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.5rem;
}

.metric {
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--card-2);
}

.metric-label {
    display: block;
    color: var(--muted);
    font-size: 0.72rem;
}

.metric-value {
    color: var(--text);
    font-family: monospace;
    font-size: 1rem;
    font-weight: 700;
}

.raw {
    border: 1px solid var(--line);
    border-radius: 11px;
    overflow: hidden;
}

.raw summary {
    padding: 0.55rem 0.7rem;
    color: var(--muted);
    font-size: 0.82rem;
    cursor: pointer;
    user-select: none;
}

.raw summary:hover {
    color: var(--text);
}

.raw pre {
    max-height: 16rem;
    margin: 0;
    padding: 0.7rem;
    background: var(--card-2);
    color: var(--text);
    font-size: 0.75rem;
    line-height: 1.55;
    overflow: auto;
}

.meta {
    margin: 0;
    color: var(--muted);
    font-family: monospace;
    font-size: 0.72rem;
    text-align: center;
    word-break: break-all;
}

/* 示例 */
.examples {
    margin-top: 1.5rem;
}

.examples h3 {
    margin: 0 0 0.6rem;
    color: var(--text);
    font-size: 1rem;
}

.example-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--card);
    color: var(--text);
    font-size: 0.83rem;
    cursor: pointer;
    transition:
        color 0.15s ease,
        border-color 0.15s ease;
}

.chip:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.chip-type {
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: var(--card-2);
    color: var(--muted);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.chip-type.t-choice {
    color: #7b5cff;
    background: #7b5cff1f;
}

.chip-type.t-noul {
    color: #0ea5e9;
    background: #0ea5e91f;
}

.chip-type.t-score {
    color: #f59e0b;
    background: #f59e0b1f;
}

@keyframes jev-spin {
    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: jev-spin 1s linear infinite;
}

@media (max-width: 900px) {
    .play-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .type-tabs {
        grid-template-columns: 1fr;
    }
}
</style>
