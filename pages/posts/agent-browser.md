---
title: 使用Agent Browser来让你的AI Agent自动化控制浏览器
date: 2026-08-21
lang: zh
art: dots
---

# 前言

你有没有遇到过这种情况：让 AI 帮你写代码，它写得飞快；可一旦让它"**在网页上点个按钮、填个表单、截个图**"，它立刻卡住——"抱歉，我无法直接打开浏览器"。

LLM 驱动的 Agent 能写代码、能调 API、能读文件，却偏偏栽在"操作网页"这件事上。于是各种自动化方案被翻了出来：Selenium 太重，Playwright 好用但本质上还是**写给人类测试工程师**的工具——要写代码、要维护选择器、要处理各种时序问题。它们的设计对象从来不是 AI。

直到 Vercel Labs 放出了 **agent-browser**，这个问题的解法才变得不一样。

# agent-browser 是什么

一句话：**给 AI Agent 用的浏览器自动化 CLI**，纯 Rust 编写，GitHub 上已经有 **41k+ stars**。

它和传统自动化工具最大的区别在于设计目标：不是为了"让测试脚本稳定跑起来"，而是为了让 **LLM 能像人一样看懂页面、操作页面**。

架构上它采用 client-daemon 模式：

- **Rust CLI**：解析命令，与守护进程通信
- **Rust Daemon**：常驻后台，直接通过 CDP（Chrome DevTools Protocol）驱动浏览器，**全程不需要 Node.js 运行时**

守护进程在你第一次执行命令时自动启动，之后一直驻留，命令与命令之间**复用同一个浏览器实例**，所以每条命令都只有毫秒级延迟——这是传统"每条命令冷启动一个浏览器"的方案完全比不了的。

# 安装

两条命令搞定：

```bash
npm install -g agent-browser
agent-browser install   # 首次运行：自动下载 Chrome for Testing
```

macOS 也可以用 Homebrew：

```bash
brew install agent-browser
agent-browser install
```

`agent-browser install` 会下载谷歌官方的自动化专用浏览器 Chrome for Testing，如果你本机已有 Chrome、Brave、Playwright 的浏览器，它也会自动检测复用。装完可以跑一下 `agent-browser doctor` 检查环境。

# 三分钟上手

打开一个网页，看看"AI 眼中的页面"长什么样：

```bash
agent-browser open example.com
agent-browser snapshot
```

注意，`snapshot` 输出的不是 HTML，而是带 **ref** 的**无障碍树**（accessibility tree）：

```
- heading "Example Domain" [ref=e1] [level=1]
- button "Submit" [ref=e2]
- textbox "Email" [ref=e3]
- link "Learn more" [ref=e4]
```

关键就在这些 `@e1`、`@e2`、`@e3`——这是 agent-browser 为 AI 设计的核心交互协议：**先用 snapshot 拿到"地图"，再用 ref 指哪打哪**，全程不需要写一条 CSS 选择器。

```bash
agent-browser click @e2                    # 点击按钮
agent-browser fill @e3 "test@example.com"  # 填写表单
agent-browser get text @e1                 # 读取标题
agent-browser screenshot page.png          # 截图
agent-browser close                        # 关闭浏览器
```

典型的 Agent 工作流就是一条循环：`open` → `snapshot` → 根据 ref 执行操作 → 页面变了 → 再 `snapshot` → 继续操作。

**为什么 refs 比 CSS 选择器更适合 AI？**

1. **确定性**：ref 直接指向 snapshot 里那个元素，不需要重新查询 DOM
2. **省 token**：无障碍树比一坨 HTML 精简得多，上下文占用少一个量级
3. **抗变更**：不受页面 DOM 结构调整影响，AI 不用"猜"选择器
4. **直觉**：AI 看到 `[ref=e3] textbox "Email"` 就知道该往哪填，不需要理解 `#form > div > input[type=email]` 这种结构

顺带一提，如果点击被弹窗、同意横幅之类的元素挡住了，命令会直接报错告诉你"被 `#consent-banner` 挡住了"——先处理遮挡元素，再重新 snapshot 即可，不会静默失败。

# 传统选择器也支持

习惯了老写法？没关系，CSS、文本、XPath 全都兼容：

```bash
agent-browser click "#submit"
agent-browser click "text=Submit"
agent-browser click "xpath=//button"
```

还有更高级的**语义定位**，把"找元素 + 执行动作"合成一句话，同样是为 LLM 调用优化的：

```bash
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "test@test.com"
agent-browser find text "Sign In" click
```

# read：不启动浏览器，先"读"网页

给 AI 读网页时，最蠢的做法是把整个 HTML 塞进上下文。`read` 命令专门解决这个问题——**不启动浏览器**，直接抓取提炼过的可读文本：

```bash
agent-browser read https://example.com/article
agent-browser read https://docs.example.com --llms index --filter auth
```

它默认请求 markdown 格式，自动探测 `llms.txt`，还能用 `--filter` 只提取你关心的章节。喂给 AI 的是"可读内容"而不是"HTML 源码"，token 消耗直接降到最低。

# 为 Agent 而生的细节

用过自动化的人都知道，实际跑起来全是细节。agent-browser 在这方面的设计非常贴合 Agent 场景：

- **守护进程常驻**：浏览器不关，命令毫秒级响应，可以放心用 `&&` 链式调用
- **batch**：一次调用执行多条命令，省去进程启动开销：

  ```bash
  agent-browser batch "open https://example.com" "snapshot -i" "screenshot"
  ```

- **--json**：结构化输出，方便 Agent 程序解析：

  ```bash
  agent-browser snapshot -i --json
  ```

- **wait**：处理异步加载的利器：

  ```bash
  agent-browser wait --text "Welcome"        # 等文字出现
  agent-browser wait --load networkidle      # 等网络空闲
  agent-browser wait "#spinner" --state hidden  # 等元素消失
  ```

- **snapshot 过滤器**：`-i` 只看可交互元素、`-c` 紧凑输出、`-d 3` 限制深度，防止上下文被刷爆。

# 登录态：自动化绕不开的坎

自动化的最大拦路虎永远是登录。agent-browser 提供了好几条路，总有一条适合你：

**复用你日常的 Chrome 登录态**（零成本）：

```bash
agent-browser --profile Default open https://gmail.com
```

**自动保存/恢复会话**：

```bash
agent-browser --session myapp --restore open myapp.com/dashboard
```

登录一次，之后 cookie 和 localStorage 会自动保存到本地、自动恢复，下次启动免登录。

**手动快照**：

```bash
agent-browser state save ./my-auth.json
agent-browser --state ./my-auth.json open app.example.com
```

甚至可以用 `--auto-connect` 直接抓取正在运行的 Chrome 里的登录状态。对需要"换账号测"的场景，`--headers '{"Authorization": "Bearer <token>"}'` 还能按域名注入请求头，绕过 UI 登录流程。

# 连接真实 Chrome：CDP 方案

前面提到的 `--auto-connect`、`--cdp`，藏着 agent-browser 最有杀伤力的一招：**直接连你正在用的 Chrome**。

**根本矛盾。** 所有自动化方案都在试图"新建一个浏览器环境去模拟用户"——无头浏览器、临时会话、注入 Cookie……但用户手上明明已经有一个完美的浏览器环境了：正在运行的 Chrome，里面有完整的登录态、Cookie、插件。为什么不直接用它？

**CDP 是什么。** Chrome DevTools Protocol，就是 Chrome DevTools 的底层协议——你按 F12 打开开发者工具，底层就是 CDP 在通信。它从 2017 年就有了，每个 Chrome 扩展和调试工具都依赖它。关键能力只有一条：**CDP 可以连接到一个正在运行的 Chrome 实例**。不是新建的无头浏览器，是你正在用的那个——你的 Cookie、你的登录态、你的插件，全都在。

架构对比一目了然：

```
之前（Claude in Chrome）：
  Agent → 你的 Chrome → DOM/无障碍树 + 截图回退 → 视觉模型
  成本：视觉模型介入时 Token 开销显著增加

之后（agent-browser + CDP）：
  Agent → agent-browser eval '...' → CDP → 你的 Chrome → JSON
  成本：每次操作 50-200 Token，2-4 秒
```

**5 分钟连上你的 Chrome。**

第一步，启用 Chrome 远程调试。地址栏输入 `chrome://inspect/#remote-debugging`，勾选 **"Allow remote debugging for this browser instance"**（需要 Chrome 145+，不需要重启）。

第二步，配置 auto-connect：

```bash
mkdir -p ~/.agent-browser && cat > ~/.agent-browser/config.json << 'EOF'
{ "autoConnect": true }
EOF
```

第三步，验证连接：

```bash
agent-browser get url
# 应该输出你当前 Chrome 标签页的 URL
```

**实测数据。** 有开发者拿三个复杂度递增的任务，在同一台机器上背靠背对比了 agent-browser + CDP 和 Claude in Chrome：

| 任务 | agent-browser | Claude in Chrome | 加速比 |
| --- | --- | --- | --- |
| 数据提取（HN Top 10） | 28s | 50s | 1.8x |
| 表单登录（填写 + 点击） | 28s | 50s | 1.8x |
| x.com 发帖 + 删帖 | 2m19s | 3m04s | 1.3x |

为什么更快？三个原因：

- **命令链接减少往返**：`fill && click && wait && snapshot` 一次工具调用搞定，Claude in Chrome 每个操作都要独立 MCP 调用（登录任务 4 vs 8 次往返）
- **文本 vs 截图**：snapshot 输出无障碍树（~200-2k tokens/页），截图要渲染、base64 编码、视觉模型推理（x.com 任务 JSONL：129 KB vs 2,383 KB，18.5 倍，几乎全是 base64）
- **更低的基线**：MCP 的 18 个工具每轮 API 调用都加载 ~5,600 Token，Skill 方式空闲只占 ~586 Token——间歇性用浏览器的开发场景差距放大到 10 倍

真正的差异还不止速度：

| 指标 | agent-browser（Skill） | Claude in Chrome（MCP） |
| --- | --- | --- |
| 速度 | 快 1.3x–1.8x | 基线 |
| 空闲 Token 开销 | ~586 Token（按需加载） | ~5,600 Token（每轮都加载） |
| 适用 Agent | 任何 AI Agent（Claude Code、Codex、Cursor……） | 仅限 Claude |
| 网站访问 | 任何你能打开的网站 | 部分网站在自动化模式下受限 |

**实战：带登录态直接调鉴权 API。** 连上真实 Chrome 最大的红利是——`eval` 里的 `fetch` 会自动带上你的 Cookie。比如同步券商自选股：

```bash
# 第一步：导航到 API 所在的子域名（CORS 要求，后面会详细说）
agent-browser open "https://t.10jqka.com.cn/"

# 第二步：调用自选股 API（Cookie 自动带上）
agent-browser eval --stdin <<'EOF'
fetch("https://t.10jqka.com.cn/openapi/stockconcern/v2/add", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "stockcode=600519&marketid=17"
}).then(r => r.json()).then(d => JSON.stringify(d))
EOF
# {"errcode":0,"errmsg":"success"}
```

效果：**217 Token、3.5 秒、100% 成功率**。对比之前用 WebFetch 带 Cookie 调 API——503 限流、3,000 Token 一次调用、成功率不到 70%，体验天壤之别。

**避坑指南。**

- **CORS 子域名陷阱**：调 API 前必须先导航到 API 所在的子域名——`www.` 和 `t.` 是不同源，跨域 `fetch` 直接 `TypeError: Failed to fetch`
- **Heredoc 必须用单引号**：`<<'EOF'`（带引号），否则 shell 会把 JS 里的 `$`、反引号、`{}` 全部展开
- **限流保护**：连续调用 API 时中间加 `agent-browser wait 2000`，快速连发容易触发 429 或临时封禁
- **CDP 安全**：这是你浏览器的完全访问权限——所有标签页、所有 Cookie、所有 localStorage。只在个人电脑启用，别把端口暴露到网络。Chrome 重启后 CDP 自动关闭，这是安全特性，不是 Bug

所以这从来不是二选一：**探索未知页面、需要"看到"页面**时用 Computer Use / MCP 视觉方案；**结构化数据提取、鉴权 API 调用、已知页面的重复性工作流**，交给 agent-browser + CDP——更快、更省 Token，而且任何 Agent 都能用、任何网站都能访问。

# 和 AI 生态的无缝集成

这才是它"为 AI 而生"的完整证据：

**MCP Server**——`agent-browser mcp` 直接起一个 Model Context Protocol 服务，Claude Desktop、Cursor 等支持 MCP 的客户端配置一下就能用：

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "agent-browser",
      "args": ["mcp"]
    }
  }
}
```

**Skills**——给 AI 助手装上"使用说明书"：

```bash
npx skills add vercel-labs/agent-browser
```

Claude Code、Cursor、Gemini CLI 等一票工具都支持，AI 会自动学会怎么用。

**Chat**——更暴力的方式，自然语言直接控浏览器（需要 Vercel AI Gateway 的 key）：

```bash
agent-browser chat "打开 google.com 搜索 cats"
```

# 进阶玩法

上手之后，这些高级功能值得一试：

- **带标注的截图**：`agent-browser screenshot --annotate` 会给元素标上数字，和 `@eN` ref 一一对应——多模态模型可以直接"看图操作"，对无文字图标的按钮特别好用
- **控制现有 Chrome**：`--cdp 9222` 连接你正在用的浏览器，Electron 应用、WebView 都能控
- **云端浏览器**：`-p browserbase` / `-p browserless` / `-p browseruse` 一个参数切到云端，本地没浏览器的 CI、Serverless 环境也能跑
- **观察面板**：`agent-browser dashboard start`，本地 4848 端口实时看 Agent 在浏览器里的一举一动，调试 Agent 卡住的问题非常直观
- **React 专属**：对 React 应用还能看组件树、props、甚至 Web Vitals，前端调试神器

# 别忘了安全边界

让 AI 自由操作浏览器，安全必须考虑。agent-browser 提供了几个关键开关：

- `--allowed-domains "example.com"`：只允许访问白名单域名
- `--max-output 50000`：限制输出长度，防止页面内容刷爆上下文
- `--content-boundaries`：给页面输出加分隔符，AI 能区分"工具输出"和"网页内容"
- `--confirm-actions eval,download`：敏感操作需要人工确认

让 AI 跑自动化之前，先想想这些边界——尤其是当它要登录你的账号时。

# 结语

AI 会写代码，但不会点按钮。agent-browser 做的，就是给 Agent 装上一双眼睛和一只手。

工具链正在经历一次代际更替：Selenium 属于人类测试工程师的时代，而 agent-browser 属于 AI Agent 的时代。它的设计哲学很朴素——**别让 AI 去适应人类的工具，而是为 AI 造它自己的工具**。refs、无障碍树、daemon 架构、MCP 支持……每一个设计都在回答同一个问题："LLM 操作浏览器时，什么对它最友好？"

趁早把"让 AI 帮你操作网页"这个技能点亮。说不定下一个自动化脚本，就是 AI 自己写的。
