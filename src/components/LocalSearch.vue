<script setup lang="ts">
import type { SearchDoc, SearchHit } from "~/logics/search";
import { onKeyStroke, useScrollLock, useStorage } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "~/logics";
import { searchDocs, segmentize, splitTerms } from "~/logics/search";

const router = useRouter();
const route = useRoute();

/** How many hits are shown at most; the status line marks the cap with a `+`. */
const RESULT_LIMIT = 24;

const open = ref(false);
const docs = shallowRef<SearchDoc[] | null>(null);
const loading = ref(false);
const loadError = ref(false);
const query = ref("");
const active = ref(0);
const isMac = ref(true);

const inputEl = ref<HTMLInputElement | null>(null);
const listEl = ref<HTMLElement | null>(null);

const recentSearches = useStorage<string[]>("vincent-search-recent", []);

const terms = computed(() => splitTerms(query.value));
const hasQuery = computed(() => terms.value.length > 0);
const results = computed<SearchHit[]>(() =>
    docs.value && hasQuery.value
        ? searchDocs(docs.value, query.value, RESULT_LIMIT)
        : [],
);
const recentDocs = computed(() =>
    (docs.value ?? []).filter((doc) => doc.date).slice(0, 5),
);

const shortcutLabel = computed(() => (isMac.value ? "⌘K" : "Ctrl K"));
const activeId = computed(() =>
    hasQuery.value && results.value.length
        ? `search-hit-${active.value}`
        : undefined,
);
const statusText = computed(() => {
    if (loading.value) return "正在载入搜索索引";
    if (loadError.value) return "搜索索引加载失败";
    if (!hasQuery.value) return "";
    return results.value.length
        ? `找到 ${results.value.length}${results.value.length >= RESULT_LIMIT ? "+" : ""} 条结果`
        : "没有匹配的结果";
});

let indexRequest: Promise<void> | null = null;

function loadIndex() {
    indexRequest ??= (async () => {
        loading.value = true;
        try {
            const mod = await import("virtual:search-index");
            docs.value = mod.default;
        } catch (error) {
            loadError.value = true;
            console.error("[search] failed to load the local index", error);
        } finally {
            loading.value = false;
        }
    })();
    return indexRequest;
}

function openSearch() {
    if (open.value) return;
    open.value = true;
    void loadIndex();
}

function closeSearch() {
    if (!open.value) return;
    open.value = false;
    query.value = "";
    active.value = 0;
}

function rememberSearch() {
    const value = query.value.trim();
    if (!value) return;
    recentSearches.value = [
        value,
        ...recentSearches.value.filter((item) => item !== value),
    ].slice(0, 6);
}

function navigateTo(path: string, anchor?: string) {
    const isSamePath =
        route.path.replace(/\/+$/, "") === path.replace(/\/+$/, "");
    closeSearch();

    if (anchor && isSamePath) {
        document
            .getElementById(anchor)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(window.history.state, "", `#${anchor}`);
        return;
    }

    void router.push(anchor ? { path, hash: `#${anchor}` } : { path });
}

function go(hit?: SearchHit) {
    if (!hit) return;
    rememberSearch();
    navigateTo(hit.doc.path, hit.section?.anchor || undefined);
}

function move(delta: number) {
    const total = results.value.length;
    if (!total) return;
    active.value = (active.value + delta + total) % total;
    void nextTick(() => {
        listEl.value
            ?.querySelector<HTMLElement>('[data-active="true"]')
            ?.scrollIntoView({ block: "nearest" });
    });
}

function onInputKeydown(event: KeyboardEvent) {
    if (event.isComposing) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
    } else if (event.key === "Enter") {
        event.preventDefault();
        go(results.value[active.value]);
    }
}

/** Keeps focus inside the dialog: the input is the only tab stop we need. */
function onPanelKeydown(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    inputEl.value?.focus();
}

watch(open, async (value) => {
    if (value) {
        await nextTick();
        inputEl.value?.focus({ preventScroll: true });
    }
});

watch(query, () => {
    active.value = 0;
});

watch(
    () => route.fullPath,
    () => closeSearch(),
);

const body = typeof document === "undefined" ? null : document.body;
const scrollLock = body ? useScrollLock(body) : ref(false);
watch(open, (value) => (scrollLock.value = value));

onMounted(() => {
    isMac.value = /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
});

onKeyStroke(["k", "K"], (event) => {
    if (!(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    open.value ? closeSearch() : openSearch();
});

onKeyStroke("/", (event) => {
    if (open.value) return;
    const target = event.target as HTMLElement | null;
    if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
    ) {
        return;
    }
    event.preventDefault();
    openSearch();
});

onKeyStroke("Escape", () => closeSearch());
</script>

<template>
    <div class="search-root">
        <button
            type="button"
            class="search-trigger"
            aria-haspopup="dialog"
            :aria-expanded="open"
            aria-label="搜索文章"
            title="搜索文章"
            @click="openSearch"
        >
            <span
                class="i-carbon-search search-trigger-icon"
                aria-hidden="true"
            />
            <span class="search-trigger-label lt-md:hidden">搜索</span>
            <kbd class="search-kbd lt-md:hidden">{{ shortcutLabel }}</kbd>
        </button>

        <ClientOnly>
            <Teleport to="body">
                <Transition name="search-fade">
                    <div
                        v-if="open"
                        class="search-overlay"
                        @click.self="closeSearch"
                    >
                        <Transition name="search-pop" appear>
                            <section
                                class="search-panel"
                                role="dialog"
                                aria-modal="true"
                                aria-label="站内搜索"
                                @keydown="onPanelKeydown"
                            >
                                <div class="search-aurora" aria-hidden="true" />
                                <div class="search-sheen" aria-hidden="true" />

                                <div class="search-field">
                                    <span
                                        class="i-carbon-search search-field-icon"
                                        aria-hidden="true"
                                    />
                                    <input
                                        ref="inputEl"
                                        v-model="query"
                                        class="search-input"
                                        type="text"
                                        role="combobox"
                                        aria-expanded="true"
                                        aria-controls="search-result-list"
                                        aria-autocomplete="list"
                                        :aria-activedescendant="activeId"
                                        placeholder="搜索文章、笔记、工具…"
                                        autocomplete="off"
                                        autocapitalize="off"
                                        spellcheck="false"
                                        enterkeyhint="go"
                                        @keydown="onInputKeydown"
                                    />
                                    <span
                                        v-if="loading"
                                        class="search-spinner"
                                        aria-hidden="true"
                                    />
                                    <kbd
                                        v-else
                                        class="search-kbd search-kbd-esc"
                                        role="button"
                                        tabindex="-1"
                                        @click="closeSearch"
                                        >Esc</kbd
                                    >
                                </div>

                                <p class="sr-only" role="status">
                                    {{ statusText }}
                                </p>

                                <div ref="listEl" class="search-body">
                                    <ul
                                        v-if="hasQuery"
                                        id="search-result-list"
                                        role="listbox"
                                        aria-label="搜索结果"
                                        class="search-list"
                                    >
                                        <li
                                            v-if="!results.length && !loading"
                                            class="search-empty"
                                        >
                                            <span
                                                class="i-carbon-search-advanced search-empty-icon"
                                                aria-hidden="true"
                                            />
                                            <span
                                                >没有找到与「{{
                                                    query.trim()
                                                }}」相关的内容</span
                                            >
                                            <span class="search-empty-hint"
                                                >试试更短的关键词，或者只输入其中一部分</span
                                            >
                                        </li>
                                        <li
                                            v-for="(hit, index) in results"
                                            :id="`search-hit-${index}`"
                                            :key="hit.doc.path"
                                            role="option"
                                            :aria-selected="index === active"
                                            :data-active="index === active"
                                            class="search-hit"
                                            @mousemove="active = index"
                                            @click="go(hit)"
                                        >
                                            <div class="search-hit-head">
                                                <span class="search-hit-title">
                                                    <component
                                                        :is="
                                                            part.hit
                                                                ? 'mark'
                                                                : 'span'
                                                        "
                                                        v-for="(
                                                            part, partIndex
                                                        ) in segmentize(
                                                            hit.doc.title,
                                                            terms,
                                                        )"
                                                        :key="`title-${partIndex}`"
                                                        >{{
                                                            part.text
                                                        }}</component
                                                    >
                                                </span>
                                                <span
                                                    v-if="hit.doc.lang === 'zh'"
                                                    class="search-tag"
                                                    >中文</span
                                                >
                                                <span
                                                    v-else-if="hit.doc.lang"
                                                    class="search-tag"
                                                    >EN</span
                                                >
                                            </div>
                                            <div
                                                v-if="
                                                    hit.section?.heading ||
                                                    hit.doc.date
                                                "
                                                class="search-hit-meta"
                                            >
                                                <span
                                                    v-if="hit.section?.heading"
                                                    class="search-hit-heading"
                                                >
                                                    <span
                                                        class="i-carbon-book"
                                                        aria-hidden="true"
                                                    />
                                                    {{ hit.section.heading }}
                                                </span>
                                                <span v-if="hit.doc.date">{{
                                                    formatDate(
                                                        hit.doc.date,
                                                        true,
                                                    )
                                                }}</span>
                                            </div>
                                            <p
                                                v-if="hit.snippet.length"
                                                class="search-hit-snippet"
                                            >
                                                <component
                                                    :is="
                                                        part.hit
                                                            ? 'mark'
                                                            : 'span'
                                                    "
                                                    v-for="(
                                                        part, partIndex
                                                    ) in hit.snippet"
                                                    :key="`snippet-${partIndex}`"
                                                >
                                                    {{ part.text }}
                                                </component>
                                            </p>
                                        </li>
                                    </ul>

                                    <div v-else class="search-home">
                                        <div
                                            v-if="loadError"
                                            class="search-empty"
                                        >
                                            <span
                                                class="i-carbon-warning-alt search-empty-icon"
                                                aria-hidden="true"
                                            />
                                            <span
                                                >索引加载失败，请刷新页面重试</span
                                            >
                                        </div>

                                        <template v-else>
                                            <template
                                                v-if="recentSearches.length"
                                            >
                                                <p class="search-home-title">
                                                    最近搜索
                                                </p>
                                                <div class="search-chips">
                                                    <button
                                                        v-for="item in recentSearches"
                                                        :key="item"
                                                        type="button"
                                                        class="search-chip"
                                                        @click="query = item"
                                                    >
                                                        <span
                                                            class="i-carbon-time"
                                                            aria-hidden="true"
                                                        />
                                                        {{ item }}
                                                    </button>
                                                </div>
                                            </template>

                                            <p
                                                v-if="recentDocs.length"
                                                class="search-home-title"
                                            >
                                                最近更新
                                            </p>
                                            <ul class="search-recents">
                                                <li
                                                    v-for="doc in recentDocs"
                                                    :key="doc.path"
                                                    class="search-recent"
                                                    @click="
                                                        navigateTo(doc.path)
                                                    "
                                                >
                                                    <span
                                                        class="search-recent-title"
                                                        >{{ doc.title }}</span
                                                    >
                                                    <span
                                                        class="search-recent-date"
                                                        >{{
                                                            formatDate(
                                                                doc.date,
                                                                true,
                                                            )
                                                        }}</span
                                                    >
                                                </li>
                                            </ul>

                                            <p class="search-tip">
                                                <kbd class="search-kbd">↑</kbd>
                                                <kbd class="search-kbd">↓</kbd>
                                                选择 ·
                                                <kbd class="search-kbd">↵</kbd>
                                                打开 ·
                                                <kbd class="search-kbd"
                                                    >Esc</kbd
                                                >
                                                关闭
                                            </p>
                                        </template>
                                    </div>
                                </div>
                            </section>
                        </Transition>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<style scoped>
/*
 * "Liquid glass": a frosted, slightly refractive surface built from three
 * layers — a translucent base, a blurred colour aurora bleeding through from
 * behind, and a specular sheen that keeps the top-left edge reading as glass.
 */
.search-root {
    display: inline-flex;
    align-items: center;
}

.search-trigger {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    height: 2.15rem;
    padding: 0 0.45rem 0 0.7rem;
    border: 1px solid rgb(255 255 255 / 0.55);
    border-radius: 999px;
    background: linear-gradient(
        145deg,
        rgb(255 255 255 / 0.62),
        rgb(255 255 255 / 0.22) 46%,
        rgb(255 255 255 / 0.42)
    );
    box-shadow:
        0 6px 18px rgb(15 23 42 / 0.1),
        0 1px 2px rgb(15 23 42 / 0.06),
        inset 0 1px 0 rgb(255 255 255 / 0.8),
        inset 0 -1px 0 rgb(255 255 255 / 0.3);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    color: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    overflow: hidden;
    transition:
        transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
        box-shadow 0.35s ease,
        border-color 0.35s ease;
}

/* Colour wandering behind the frosted surface. */
.search-trigger::before {
    content: "";
    position: absolute;
    inset: -60% -20%;
    z-index: -1;
    background:
        radial-gradient(
            60% 70% at 18% 30%,
            rgb(45 212 191 / 0.55),
            transparent 70%
        ),
        radial-gradient(
            50% 60% at 82% 74%,
            rgb(139 92 246 / 0.45),
            transparent 72%
        );
    filter: blur(10px);
    opacity: 0.7;
    transition:
        opacity 0.35s ease,
        transform 0.6s ease;
}

/* Specular sweep. */
.search-trigger::after {
    content: "";
    position: absolute;
    top: -40%;
    left: -60%;
    width: 45%;
    height: 180%;
    background: linear-gradient(
        100deg,
        transparent,
        rgb(255 255 255 / 0.75),
        transparent
    );
    transform: rotate(12deg);
    opacity: 0;
    pointer-events: none;
    transition:
        transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.3s ease;
}

.search-trigger:hover {
    transform: translateY(-1px);
    border-color: rgb(255 255 255 / 0.75);
    box-shadow:
        0 10px 24px rgb(15 23 42 / 0.14),
        0 1px 2px rgb(15 23 42 / 0.06),
        inset 0 1px 0 rgb(255 255 255 / 0.9),
        inset 0 -1px 0 rgb(255 255 255 / 0.35);
}

.search-trigger:hover::after {
    transform: translateX(320%) rotate(12deg);
    opacity: 1;
}

.search-trigger:hover::before {
    opacity: 0.9;
    transform: scale(1.05);
}

.search-trigger:active {
    transform: translateY(0) scale(0.985);
}

.search-trigger-icon {
    font-size: 1rem;
    opacity: 0.72;
}

.search-trigger-label {
    font-weight: 500;
    letter-spacing: 0.01em;
    opacity: 0.78;
}

.search-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.55rem;
    padding: 0.1rem 0.32rem;
    border: 1px solid rgb(120 120 130 / 0.28);
    border-radius: 5px;
    background: rgb(255 255 255 / 0.42);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.7);
    font-family: inherit;
    font-size: 0.66rem;
    line-height: 1.35;
    color: rgb(70 70 80 / 0.78);
    white-space: nowrap;
}

html.dark .search-trigger {
    border-color: rgb(255 255 255 / 0.16);
    background: linear-gradient(
        145deg,
        rgb(255 255 255 / 0.16),
        rgb(255 255 255 / 0.05) 46%,
        rgb(255 255 255 / 0.1)
    );
    box-shadow:
        0 6px 18px rgb(0 0 0 / 0.35),
        0 1px 2px rgb(0 0 0 / 0.4),
        inset 0 1px 0 rgb(255 255 255 / 0.22),
        inset 0 -1px 0 rgb(255 255 255 / 0.06);
}

html.dark .search-trigger:hover {
    border-color: rgb(255 255 255 / 0.28);
}

html.dark .search-trigger::before {
    opacity: 0.5;
}

html.dark .search-kbd {
    border-color: rgb(255 255 255 / 0.14);
    background: rgb(255 255 255 / 0.08);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.14);
    color: rgb(255 255 255 / 0.6);
}

.search-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 12vh 1rem 1rem;
    background: radial-gradient(
        80% 60% at 50% 0%,
        rgb(15 23 42 / 0.22),
        rgb(15 23 42 / 0.42)
    );
    backdrop-filter: blur(6px) saturate(130%);
    -webkit-backdrop-filter: blur(6px) saturate(130%);
}

.search-panel {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    width: min(680px, 100%);
    max-height: min(72vh, 620px);
    border: 1px solid rgb(255 255 255 / 0.65);
    border-radius: 22px;
    background: linear-gradient(
        155deg,
        rgb(255 255 255 / 0.88),
        rgb(255 255 255 / 0.68) 42%,
        rgb(255 255 255 / 0.8)
    );
    box-shadow:
        0 30px 90px -20px rgb(2 6 23 / 0.45),
        0 8px 24px rgb(2 6 23 / 0.12),
        inset 0 1px 0 rgb(255 255 255 / 0.95),
        inset 0 0 0 1px rgb(255 255 255 / 0.35),
        inset 0 -1px 0 rgb(255 255 255 / 0.4);
    backdrop-filter: blur(30px) saturate(190%);
    -webkit-backdrop-filter: blur(30px) saturate(190%);
    overflow: hidden;
}

/* Slow-drifting colour field — the "liquid" part. */
.search-aurora {
    position: absolute;
    inset: -35% -15% auto;
    height: 75%;
    z-index: -1;
    background:
        radial-gradient(
            42% 60% at 22% 32%,
            rgb(45 212 191 / 0.5),
            transparent 70%
        ),
        radial-gradient(
            38% 55% at 72% 18%,
            rgb(139 92 246 / 0.38),
            transparent 72%
        ),
        radial-gradient(
            40% 60% at 88% 82%,
            rgb(56 189 248 / 0.28),
            transparent 74%
        );
    filter: blur(26px) saturate(130%);
    opacity: 0.75;
    animation: aurora-drift 18s ease-in-out infinite alternate;
    pointer-events: none;
}

/* Specular band along the top rim. */
.search-sheen {
    position: absolute;
    inset: 0 6% auto;
    height: 46%;
    z-index: -1;
    border-radius: 22px 22px 60% 60%;
    background: linear-gradient(
        180deg,
        rgb(255 255 255 / 0.7),
        rgb(255 255 255 / 0.12) 55%,
        transparent
    );
    filter: blur(10px);
    opacity: 0.85;
    pointer-events: none;
}

html.dark .search-panel {
    border-color: rgb(255 255 255 / 0.14);
    background: linear-gradient(
        155deg,
        rgb(28 30 36 / 0.86),
        rgb(18 20 24 / 0.78) 45%,
        rgb(26 28 34 / 0.84)
    );
    box-shadow:
        0 30px 90px -20px rgb(0 0 0 / 0.7),
        0 8px 24px rgb(0 0 0 / 0.45),
        inset 0 1px 0 rgb(255 255 255 / 0.18),
        inset 0 0 0 1px rgb(255 255 255 / 0.06);
}

html.dark .search-aurora {
    opacity: 0.42;
}

html.dark .search-sheen {
    opacity: 0.18;
}

.search-field {
    display: flex;
    flex: none;
    align-items: center;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgb(120 120 130 / 0.14);
}

html.dark .search-field {
    border-bottom-color: rgb(255 255 255 / 0.08);
}

.search-field-icon {
    font-size: 1.05rem;
    opacity: 0.5;
}

.search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: 0.98rem;
    line-height: 1.6;
}

.search-input::placeholder {
    color: rgb(120 120 135 / 0.7);
}

html.dark .search-input::placeholder {
    color: rgb(180 180 190 / 0.45);
}

.search-kbd-esc {
    cursor: pointer;
}

.search-spinner {
    width: 0.9rem;
    height: 0.9rem;
    border: 2px solid rgb(120 120 135 / 0.25);
    border-top-color: var(--c-accent);
    border-radius: 50%;
    animation: search-spin 0.7s linear infinite;
}

.search-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.4rem;
}

.search-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.search-hit {
    padding: 0.55rem 0.7rem;
    border-radius: 12px;
    cursor: pointer;
    transition:
        background 0.16s ease,
        box-shadow 0.16s ease;
}

.search-hit[data-active="true"] {
    background: color-mix(in srgb, var(--c-accent) 14%, transparent);
    box-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--c-accent) 32%, transparent);
}

html.dark .search-hit[data-active="true"] {
    background: color-mix(in srgb, var(--c-accent) 18%, transparent);
    box-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--c-accent) 38%, transparent);
}

.search-hit-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-hit-title {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: 0.94rem;
    line-height: 1.45;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.search-tag {
    flex: none;
    padding: 0.05rem 0.35rem;
    border-radius: 5px;
    background: rgb(120 120 135 / 0.16);
    font-size: 0.64rem;
    letter-spacing: 0.03em;
    opacity: 0.75;
}

.search-hit-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.15rem;
    font-size: 0.68rem;
    opacity: 0.55;
}

.search-hit-heading {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.search-hit-snippet {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0.28rem 0 0;
    font-size: 0.78rem;
    line-height: 1.6;
    opacity: 0.72;
}

.search-hit-snippet mark,
.search-hit-title mark {
    padding: 0 0.1em;
    border-radius: 3px;
    background: color-mix(in srgb, var(--c-accent) 28%, transparent);
    color: inherit;
    font-weight: 700;
}

html.dark .search-hit-snippet mark,
html.dark .search-hit-title mark {
    background: color-mix(in srgb, var(--c-accent) 34%, transparent);
}

.search-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 2.6rem 1rem 3rem;
    font-size: 0.85rem;
    opacity: 0.6;
    text-align: center;
}

.search-empty-icon {
    font-size: 1.6rem;
    opacity: 0.55;
}

.search-empty-hint {
    font-size: 0.74rem;
    opacity: 0.7;
}

.search-home {
    padding: 0.3rem 0.3rem 0.5rem;
}

.search-home-title {
    margin: 0.7rem 0.5rem 0.4rem;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
}

.search-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding: 0 0.3rem;
}

.search-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    padding: 0.2rem 0.55rem;
    border: 1px solid rgb(120 120 135 / 0.22);
    border-radius: 999px;
    background: rgb(255 255 255 / 0.35);
    color: inherit;
    font-size: 0.74rem;
    cursor: pointer;
    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.search-chip:hover {
    border-color: color-mix(in srgb, var(--c-accent) 45%, transparent);
    background: color-mix(in srgb, var(--c-accent) 12%, transparent);
}

html.dark .search-chip {
    border-color: rgb(255 255 255 / 0.14);
    background: rgb(255 255 255 / 0.06);
}

.search-recents {
    list-style: none;
    margin: 0;
    padding: 0;
}

.search-recent {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.42rem 0.7rem;
    border-radius: 10px;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background 0.16s ease;
}

.search-recent:hover {
    background: rgb(120 120 135 / 0.1);
}

html.dark .search-recent:hover {
    background: rgb(255 255 255 / 0.06);
}

.search-recent-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.search-recent-date {
    flex: none;
    font-size: 0.7rem;
    opacity: 0.45;
}

.search-tip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.28rem;
    margin: 0.9rem 0.6rem 0;
    font-size: 0.7rem;
    opacity: 0.45;
}

.search-fade-enter-active,
.search-fade-leave-active {
    transition: opacity 0.22s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
    opacity: 0;
}

.search-pop-enter-active,
.search-pop-leave-active {
    transition:
        opacity 0.26s ease,
        transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.search-pop-enter-from,
.search-pop-leave-to {
    opacity: 0;
    transform: translateY(-12px) scale(0.97);
}

@keyframes aurora-drift {
    0% {
        transform: translate3d(-4%, -2%, 0) scale(1);
    }
    50% {
        transform: translate3d(5%, 4%, 0) scale(1.08);
    }
    100% {
        transform: translate3d(-2%, 6%, 0) scale(1.03);
    }
}

@keyframes search-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .search-overlay {
        padding: 5vh 0.75rem 0.75rem;
    }

    .search-panel {
        max-height: min(80vh, 620px);
        border-radius: 18px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .search-aurora {
        animation: none;
    }

    .search-trigger::after {
        transition: none;
    }

    .search-fade-enter-active,
    .search-fade-leave-active,
    .search-pop-enter-active,
    .search-pop-leave-active {
        transition-duration: 0.01ms;
    }
}

/* Fallback for browsers without backdrop-filter: keep the surface legible. */
@supports not (
    (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
) {
    .search-trigger {
        background: rgb(255 255 255 / 0.92);
    }

    html.dark .search-trigger {
        background: rgb(24 26 31 / 0.94);
    }

    .search-panel {
        background: rgb(255 255 255 / 0.98);
    }

    html.dark .search-panel {
        background: rgb(22 24 29 / 0.98);
    }
}
</style>
