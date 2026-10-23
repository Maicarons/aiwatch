# AIWatch

[![Tests](https://github.com/Maicarons/aiwatch/actions/workflows/test.yml/badge.svg)](https://github.com/Maicarons/aiwatch/actions/workflows/test.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-aiwatch.maicarons.cc-blue)](https://aiwatch.maicarons.cc)
[![GitHub stars](https://img.shields.io/github/stars/Maicarons/aiwatch)](https://github.com/Maicarons/aiwatch/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Maicarons/aiwatch)](https://github.com/Maicarons/aiwatch/commits/main)

[![Claude API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/claude)](https://aiwatch.maicarons.cc/is-claude-down)
[![OpenAI API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/openai)](https://aiwatch.maicarons.cc/is-openai-down)
[![Gemini API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/gemini)](https://aiwatch.maicarons.cc/is-gemini-down)
[![GitHub Copilot](https://aiwatch-worker.p2c2kbf.workers.dev/badge/copilot)](https://aiwatch.maicarons.cc/is-github-copilot-down)

[English](README.md) | [한국어](README.ko.md) | **中文**

面向 **48 项 AI 服务**的实时监控仪表盘 — 追踪主流 AI 服务商的状态、延迟、可用率与故障事件。

**[仪表盘](https://aiwatch.maicarons.cc)** · **[介绍页](https://aiwatch.maicarons.cc/intro)**

| 桌面端 | 移动端 |
|---------|--------|
| ![AIWatch 仪表盘](docs/screenshot.png?v=3) | ![AIWatch 移动端](docs/screenshot-mobile.png?v=1) |

> 本仓库是 [Maicarons/aiwatch](https://github.com/Maicarons/aiwatch) 的 fork，所有提交只发布到
> [Maicarons/aiwatch](https://github.com/Maicarons/aiwatch)。

**分享**
[![Share on X](https://img.shields.io/badge/Share-X-000000?logo=x&logoColor=white)](https://twitter.com/intent/tweet?text=AIWatch%20%E2%80%94%20Real-time%20monitoring%20for%2048%20AI%20services%20%28Claude%2C%20ChatGPT%2C%20Gemini%2C%20and%20more%29&url=https%3A%2F%2Fgithub.com%2FMaicarons%2Faiwatch)
[![Share on Reddit](https://img.shields.io/badge/Share-Reddit-FF4500?logo=reddit&logoColor=white)](https://reddit.com/submit?url=https%3A%2F%2Fgithub.com%2FMaicarons%2Faiwatch&title=AIWatch%20%E2%80%94%20Real-time%20monitoring%20for%2048%20AI%20services)
[![Share on Hacker News](https://img.shields.io/badge/Share-Hacker%20News-FF6600?logo=ycombinator&logoColor=white)](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2FMaicarons%2Faiwatch&t=AIWatch%20%E2%80%94%20Real-time%20monitoring%20for%2048%20AI%20services)
[![Share on LinkedIn](https://img.shields.io/badge/Share-LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2FMaicarons%2Faiwatch)

## 🛰️ 在线演示

访问 **[aiwatch.maicarons.cc](https://aiwatch.maicarons.cc)** — 无需注册。通过 Cloudflare Workers 每 5 分钟更新一次。

## 功能

- **实时状态** — 48 项 AI 服务的正常 / 降级 / 故障状态
- **PWA 支持** — 添加到主屏幕，Service Worker 离线缓存
- **延迟监控** — 对 36 个可探测服务直接测量端点响应时间（RTT）；不可探测的服务不显示延迟
- **24 小时延迟趋势** — Chart.js 折线图，5 分钟探测快照
- **故障历史** — 时间线，支持多种状态页格式的详情
- **可用率** — 30 天可用率由 **AIWatch 计算**，基于各服务商公开的记录，而不是照抄它们展示的百分比（加权：完全中断 1.0，部分/降级 0.3，已公告的维护不计入）。不符合该公式的数据源会使用各自的标注 — 因此我们的数字可能与服务商自身的数字不同，这是有意为之（[工作原理](https://aiwatch.maicarons.cc/methodology)）
- **组件状态明细** — 在服务详情页和 Is X Down 页面实时显示逐组件状态（模型、API 接口等），长列表支持折叠的分组/模型
- **状态日历** — 30 天（Statuspage）或 14 天（incident.io）每日状态可视化
- **Discord 与 Slack 提醒** — 状态变化/故障时发送 Discord webhook + 通过 Slack 原生 `/feed` RSS 应用接入（零配置）+ RSS 订阅
- **Cookie 同意** — GA4 Consent Mode v2，支持“全部接受 / 仅必要”
- **深链接** — 基于哈希的路由（`#claude`、`#latency`），可直接访问页面
- **深色/浅色主题** — 跟随系统并可手动切换
- **多语言** — 韩语 / 英语 / 中文
- **移动端响应式** — 侧边栏抽屉、移动操作栏
- **AIWatch Score** — 综合可用率、故障、恢复时间和基于探测的响应性的可靠性评分（[工作原理](https://aiwatch.maicarons.cc/methodology#score)）
- **RTT 退化检测** — AIWatch 的直接 API 探测可发现官方状态页常常不会报告的延迟退化（仪表盘徽章 + Discord 每日摘要）。在官方报告约 5 分钟的轮询周期内独立检测（MTTD）
- **区域可用性** — SpaceXAI、Gemini、OpenAI 的逐区域故障状态，并给出切换建议
- **智能提醒** — 降级/故障状态的 Discord 提醒，带防抖动、故障抑制和恢复时长
- **离线 UI** — API 不可达时的友好错误状态（仅生产环境）
- **Is X Down SEO 页面** — 46 项服务（除 Bedrock / Azure OpenAI 外的全部监控服务），带动态 OG 图片（PNG）、分享按钮、AIWatch 排名（与仪表盘一致，支持并列排名）和替代建议
- **健康检查探测** — 直接测量服务端点 RTT（36 个探测目标），通过连续尖峰告警提前发现故障，并跟踪 RTT 退化
- **按页面定制的骨架屏** — 与各页面布局匹配的加载占位
- **AI 分析（测试版）** — 故障的混合 AI 自动分析（Gemma 4 主用 + Sonnet 兜底）：原因估计、恢复时间、影响范围、结合上下文的替代建议。合并进故障 Discord 提醒（单个 embed）、顶栏分析弹窗、Is X Down AI 洞察卡片
- **介绍页** — 介绍页（`/intro`），带仪表盘预览模型、韩/英 i18n、流程动画、可选的 `?banner=` 活动位和 GA4 跟踪
- **Chrome 扩展** — 仅 Claude 的工具栏徽章 + 弹窗，显示 Claude API / claude.ai / Claude Code 实时状态、AIWatch Score、活跃故障（含 AI 摘要）、受控的社区报告和一键问题报告。仅轮询精简的 `?src=ext-claude` API — 不读取页面内容（零数据收集）— [从 Chrome 应用商店安装](https://chromewebstore.google.com/detail/aiwatch-%E2%80%94-claude-status-d/mmngmhijlancegmfgcbegiackjkalocc)
- **Claude Code 插件（测试版）** — 后台故障监控器，在上游 AI 服务故障或恢复的瞬间通知你，并提供 `/aiwatch` 命令简报当前故障（标题、影响、AI 摘要、替代方案）。不读取代码，不收集数据。`/plugin marketplace add bentleypark/aiwatch` — [详情](https://aiwatch.maicarons.cc/plugin)
- **Web Vitals 监控** — 收集真实用户的 LCP、FCP、TTFB、CLS、INP，按 p75 聚合，并在 Discord 每日报告中发送阈值告警
- **每周简报** — 周日 Discord 摘要，包含 AI 服务变更检测（OpenAI、Google、Anthropic）、故障汇总和稳定性趋势
- **安全监控** — 通过 Hacker News、Reddit（r/netsec、r/cybersecurity）和 OSV.dev 对 24 个 AI SDK 包（PyPI + npm，包括 LangChain 生态适配器）进行 SDK 漏洞扫描，提供仪表盘提醒 + Discord 摘要
- **状态页交叉验证** — 探测 RTT + 平台法定人数 + 元状态页监控，避免状态页基础设施故障期间误报

## 监控的服务

按仪表盘的类别划分（共 48 项 — 侧边栏筛选 / 总览分区与此一致）。

### LLM API（16）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| Claude API | Anthropic | Atlassian Statuspage |
| OpenAI API | OpenAI | incident.io（Atlassian 兼容） |
| Gemini API | Google | Google Cloud incidents.json |
| Mistral API | Mistral AI | Rootly（浏览器渲染） |
| Cohere API | Cohere | incident.io（Atlassian 兼容） |
| GroqCloud | Groq | incident.io（Atlassian 兼容） |
| Together AI | Together | Better Stack RSS + uptime API |
| Fireworks AI | Fireworks | incident.io（Atlassian 兼容） |
| Cerebras Inference | Cerebras | Atlassian Statuspage |
| Perplexity | Perplexity AI | incident.io（Atlassian 兼容） |
| SpaceXAI API | SpaceXAI | RSS 订阅 |
| DeepSeek API | DeepSeek | Flashduty（浏览器渲染的订阅源） |
| Kimi API | Moonshot AI | Atlassian Statuspage（中文标题 → 英文） |
| OpenRouter | OpenRouter | Datadog Status Page（`config.json`） |
| Amazon Bedrock | AWS | AWS Health Dashboard |
| Azure OpenAI | Microsoft | Azure Status RSS |

### 编程智能体（6）

| 服务 | 服务商 |
|---------|----------|
| Claude Code | Anthropic |
| Codex | OpenAI |
| Cursor | Anysphere |
| GitHub Copilot | GitHub |
| Windsurf (Devin Desktop) | Cognition |
| Junie | JetBrains |

### 语音（4）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| ElevenLabs | ElevenLabs | incident.io（Atlassian 兼容） |
| AssemblyAI | AssemblyAI | Atlassian Statuspage |
| Deepgram | Deepgram | Atlassian Statuspage |
| Fish Audio | Fish Audio | Better Stack RSS + uptime API |

### 推理与基础设施（9）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| Hugging Face | HuggingFace | Better Stack RSS + uptime API |
| Replicate | Replicate | incident.io（Atlassian 兼容） |
| fal.ai | fal | Instatus（Next.js） |
| Pinecone | Pinecone | Atlassian Statuspage |
| turbopuffer | turbopuffer | incident.io（Atlassian 兼容） |
| Voyage AI | Voyage AI | Atlassian Statuspage |
| Jina AI | Jina AI | Atlassian Statuspage |
| Modal | Modal | Better Stack RSS + uptime API |
| Twelve Labs | Twelve Labs | Atlassian Statuspage |

### 可观测性（3）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| LangChain (LangSmith) | LangChain | incident.io（全局页面） |
| Helicone | Helicone | Better Stack RSS + uptime API |
| Langfuse | Langfuse | incident.io（Atlassian 兼容） |

### 视频（2）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| Runway | Runway | Atlassian Statuspage |
| Luma (Dream Machine) | Luma | Better Stack RSS + uptime API |

### 图像（2）

| 服务 | 服务商 | 状态源 |
|---------|----------|---------------|
| Stability AI | Stability AI | incident.io（Atlassian 兼容） |
| Black Forest Labs (FLUX) | Black Forest Labs | Atlassian Statuspage |

### AI 应用（6）

| 服务 | 服务商 |
|---------|----------|
| claude.ai | Anthropic |
| ChatGPT | OpenAI |
| Character.AI | Character AI |
| DeepSeek App | DeepSeek |
| Grok | SpaceXAI |
| Kimi App | Moonshot AI |

## 技术栈

| 层 | 技术 |
|-------|------------|
| 前端 | React 19、Vite 6、TailwindCSS v4、Chart.js |
| 后端 | Cloudflare Workers（TypeScript） |
| 缓存 | Cloudflare KV（状态缓存、延迟快照） |
| 托管 | Vercel |
| 提醒 | Discord Webhook（Worker 代理）· Slack 原生 `/feed` RSS · RSS 订阅 |
| 分析 | Google Analytics 4（Consent Mode v2） |
| 测试 | Playwright（E2E）、Vitest（单元） |

## 架构

```
浏览器（React SPA，60 秒轮询）
  ↓
Cloudflare Worker
  ├── GET /api/status    → 并行抓取（48 项服务）→ 标准化
  ├── GET /api/uptime    → 每日可用率历史
  └── POST /api/alert   → Discord webhook 代理（SSRF 防护）
  ↓
解析器（worker/src/parsers/）
  ├── impact-weights.ts  → 共享 MAJOR_WEIGHT/MINOR_WEIGHT（Atlassian 严重度公式）
  ├── uptime-interval.ts → 基于区间的解析器共用的滚动窗口停机累加器（#1006）
  ├── statuspage.ts      → Atlassian Statuspage API + uptimeData HTML（按天计算可用率）
  ├── incident-io.ts     → incident.io 兼容 API + component_impacts 区间（可用率按同一加权公式计算）
  ├── gcloud.ts          → Google Cloud incidents.json（Vertex Gemini）
  ├── aistudio.ts        → Google AI Studio + 直连 Gemini API（次要来源，与 gcloud 合并 — #310）
  ├── instatus.ts        → Instatus Nuxt/Next.js SSR
  ├── betterstack.ts     → Better Stack RSS + /index.json 可用率 API + dailyImpact（status_history）
  ├── datadog.ts         → Datadog Status Page `config.json`（OpenRouter — #1403）
  ├── flashduty.ts       → Flashduty 订阅源（DeepSeek + DeepSeek App — 通过定时 Action 浏览器渲染，#618）
  └── aws.ts             → AWS Health 事件 JSON API（Bedrock）+ RSS（Azure OpenAI）
  ↓
Cloudflare KV
  ├── services:latest      （状态缓存，TTL 5 分钟）
  ├── daily:YYYY-MM-DD     （可用率计数器，TTL 2 天）
  ├── history:YYYY-MM-DD   （归档计数器，TTL 90 天）
  ├── probe:24h            （健康检查探测，最多 2016 条，TTL 7 天，36 个探测目标）
  ├── ai:analysis:{svcId}:{incId}  （AI 逐故障分析，TTL 1 小时，活跃期间刷新）
  ├── ai:reanalysis-skip:* （重复分析失败冷却，TTL 按失败类型缩放 — #955）
  ├── ai:usage:{date}      （每日 AI 使用计数，TTL 30 天）
  ├── alerted:*            （提醒去重键，TTL 2 小时-7 天）
  ├── detected:{svcId}     （最早检测时间戳，TTL 7 天）
  ├── probe-degradation:daily:{svcId}:{date} （RTT 退化计数，TTL 48 小时，#464）
  ├── reddit:seen:{postId} （Reddit 帖子去重，TTL 24 小时）
  └── vitals:{YYYY-MM-DD}  （Web Vitals 每日聚合，TTL 3 天）
```

## 快速开始

### 环境要求

- Node.js 20+
- npm
- Cloudflare 账号（用于部署 Worker）

### 前端

```bash
git clone https://github.com/Maicarons/aiwatch.git
cd aiwatch
npm install
npm run dev        # localhost:5173
```

### Worker（后端）

```bash
cd worker && npm install && cd ..
# 为本地开发创建 .dev.vars：
echo "ALLOWED_ORIGIN=*" > worker/.dev.vars
# 从仓库根目录运行 — 在 localhost:8788 启动 worker，
# 与仪表盘默认的 / 下方 VITE_API_URL 一致。
npm run dev:worker   # localhost:8788
```

### 环境变量

**前端（.env）**
```
VITE_API_URL=http://localhost:8788/api/status
VITE_GA4_ID=                # 可选：Google Analytics 衡量 ID
```

**Worker（wrangler.toml + secrets）**
```
ALLOWED_ORIGIN=https://aiwatch.maicarons.cc,*-maicarons-projects.vercel.app
CONFIRM_BASE_URL=https://aiwatch.maicarons.cc   # Webhook 确认链接
DISCORD_WEBHOOK_URL=        # Worker Secret：用于提醒的 Discord webhook（可选）
ANTHROPIC_API_KEY=          # Worker Secret：Claude Sonnet API 密钥（可选）
# KV 命名空间与完整密钥清单：docs/reference/worker-self-hosting.md
```

## 脚本

```bash
# 前端
npm run dev          # 开发服务器（localhost:5173）
npm run dev:worker   # Worker 开发服务器（localhost:8788）
npm run dev:all      # 同时启动两者
npm run build        # 生产构建 → dist/
npm run lint         # ESLint
npm test             # Playwright E2E 测试
npm run test:src     # 前端单元测试（vitest — 含 CSP hash 固定）
npm run test:worker  # Worker 单元测试（vitest）

# Worker 部署
npm run deploy:worker  # 部署到 Cloudflare（仅使用 npm 脚本）
# 首次部署：docs/reference/worker-self-hosting.md（KV、密钥、Vercel 改指向、自动部署）
```

## API 端点

| 端点 | 方法 | 说明 |
|----------|--------|-------------|
| `/api/status` | GET | 全部服务状态 + 故障 + 可用率 + aiAnalysis |
| `/api/status/cached` | GET | 仅 KV 缓存状态（用于 Edge SSR，快速 ~1.2 秒） |
| `/api/uptime?days=30` | GET | 每日可用率历史（1-90 天） |
| `/api/report?month=YYYY-MM` | GET | 月度可靠性归档（可用率、评分、故障、延迟） |
| `/api/alert` | POST | Discord webhook 代理（SSRF 防护） |
| `/badge/:serviceId` | GET | SVG 状态徽章（shields.io 风格） |
| `/feed.xml` | GET | 故障 RSS 2.0 — 全部服务（兼容 Slack `/feed`） |
| `/feed/:slug` | GET | 故障 RSS 2.0 — 单个服务（slug 或 service ID） |
| `/api/og` | GET | 动态 OG 图片 PNG（1200×630，resvg-wasm） |
| `/api/v1/status` | GET | 公开 API — 全部服务（轻量，CORS `*`） |
| `/api/v1/status/:id` | GET | 公开 API — 单个服务 + 最近 5 条故障 |

## 公开 API（v1）

面向外部开发者的开放 API。无需认证。速率限制为 60 次/分钟。

**全部服务：**
```bash
curl https://aiwatch-worker.p2c2kbf.workers.dev/api/v1/status
```

**单个服务：**
```bash
curl https://aiwatch-worker.p2c2kbf.workers.dev/api/v1/status/claude
```

响应包含：`id`、`name`、`provider`、`category`、`group`（细分类别 — llm / voice / inference / …）、`status`、`latency`（该服务最近一次直接探测的 RTT，单位毫秒；未探测时为 `null` — 绝不是状态页耗时，#1633）、`uptime30d`、`uptimeSource`、`lastChecked`，以及最多 5 条近期故障（仅单服务接口）。

## 状态徽章

在 README、文档或博客中嵌入实时状态徽章。

```markdown
[![Claude API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/claude)](https://aiwatch.maicarons.cc/is-claude-down)
```

[![Claude API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/claude)](https://aiwatch.maicarons.cc/is-claude-down)

### 参数

| 参数 | 说明 | 示例 |
|-----------|-------------|---------|
| `uptime` | 显示可用率 % | `/badge/claude?uptime=true` |
| `style` | `flat` 或 `flat-square` | `/badge/claude?style=flat-square` |
| `label` | 自定义标签 | `/badge/claude?label=My+API` |

### 示例

[![OpenAI API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/openai)](https://aiwatch.maicarons.cc/is-openai-down)
[![Gemini API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/gemini)](https://aiwatch.maicarons.cc/is-gemini-down)
[![Claude API](https://aiwatch-worker.p2c2kbf.workers.dev/badge/claude?uptime=true)](https://aiwatch.maicarons.cc/is-claude-down)
[![Cursor](https://aiwatch-worker.p2c2kbf.workers.dev/badge/cursor?style=flat-square)](https://aiwatch.maicarons.cc/is-cursor-down)

### 可用的服务 ID

每个被监控的服务 — 与 `/api/v1/status` 返回的 id 相同。

| ID | 服务 | ID | 服务 |
|----|---------|----|---------|
| `claude` | Claude API | `elevenlabs` | ElevenLabs |
| `openai` | OpenAI API | `assemblyai` | AssemblyAI |
| `gemini` | Gemini API | `deepgram` | Deepgram |
| `bedrock` | Amazon Bedrock | `huggingface` | Hugging Face |
| `azureopenai` | Azure OpenAI | `replicate` | Replicate |
| `mistral` | Mistral API | `fal` | fal.ai |
| `cohere` | Cohere API | `modal` | Modal |
| `groq` | GroqCloud | `voyageai` | Voyage AI |
| `together` | Together AI | `pinecone` | Pinecone |
| `fireworks` | Fireworks AI | `turbopuffer` | turbopuffer |
| `cerebras` | Cerebras Inference | `twelvelabs` | Twelve Labs |
| `perplexity` | Perplexity | `langsmith` | LangChain (LangSmith) |
| `xai` | SpaceXAI API | `helicone` | Helicone |
| `deepseek` | DeepSeek API | `langfuse` | Langfuse |
| `kimi` | Kimi API | `runway` | Runway |
| `openrouter` | OpenRouter | `luma` | Luma (Dream Machine) |
| `claudecode` | Claude Code | `stability` | Stability AI |
| `codex` | Codex | `bfl` | Black Forest Labs (FLUX) |
| `cursor` | Cursor | `claudeai` | claude.ai |
| `copilot` | GitHub Copilot | `chatgpt` | ChatGPT |
| `windsurf` | Windsurf (Devin Desktop) | `characterai` | Character.AI |
| `junie` | Junie | `deepseekapp` | DeepSeek App |
| `grok` | Grok | `fishaudio` | Fish Audio |
| `jina` | Jina AI | `kimiapp` | Kimi App |

## Claude Code 状态栏集成

在 [Claude Code 状态栏](https://docs.claude.com/en/docs/claude-code/statusline)中直接显示 AI 服务故障 — Claude API、OpenAI、Gemini、GitHub Copilot 等 44 项以上。推荐预设保留常驻且可点击的 **AIWatch** 标签（全部正常时 `AIWatch 🟢`，出问题时 `AIWatch 🔴 Claude API` — cmd/ctrl+click 打开仪表盘）。希望健康时完全零占用？[预设页面](https://aiwatch.maicarons.cc/#statusline)提供一个在有服务降级前保持空白的极简预设。

最快安装 — 添加到 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "( curl -sf --max-time 2 https://aiwatch-worker.p2c2kbf.workers.dev/api/statusline/branded ) 2>/dev/null || true"
  }
}
```

> 可点击标签需要支持 OSC 8 的终端（iTerm2、Warp、kitty、WezTerm、VS Code 终端、macOS 12+ 的 Terminal.app）；其他终端会显示为纯文本。直接访问 Worker 域名，因此每次提示的轮询不会计入 Vercel 带宽。

其他预设 — **极简**（健康时为空）、紧凑徽章、完整列表、限定特定服务商，以及可点击的逐服务链接：**[aiwatch.maicarons.cc/#statusline](https://aiwatch.maicarons.cc/#statusline)**

特性：每次渲染一次 GET，Cloudflare 边缘 5 分钟 KV 缓存，2 秒超时，不依赖 `jq`，不向 Anthropic API 发送请求，无客户端标识符。网络错误时该行保持空白；AIWatch 无法读取自身状态快照时显示 `AIWatch ⚪`（未知），而不是它无法支撑的绿色。兼容任何支持 shell 命令输出的状态栏工具（包括 `ccstatusline` 的 Custom Command 组件）。

## Claude Code 插件（测试版）

除状态栏外，[AIWatch Claude Code 插件](https://aiwatch.maicarons.cc/plugin)通过两部分在 Claude Code 中呈现 AI 故障：

- **后台故障监控器** — 在被监控的服务商故障（`🔴 Claude API is down`）或恢复（`✅ Claude API has recovered`）时立即通知你，并指明服务。每次轮询（默认每 60 秒）做差异比较，因此只在真实变化时发声 — 绝不刷屏。
- **`/aiwatch` 命令** — 简报当前哪些 AI 服务降级/故障，每项包含其活跃故障（标题 + 影响）、AI 摘要和替代建议。

不读取代码，不收集数据 — 仅轮询 AIWatch 的公开状态源。从 AIWatch 自己的市场安装：

```
/plugin marketplace add bentleypark/aiwatch
/plugin install aiwatch@aiwatch-dev
```

源码 + 文档：[`plugin/aiwatch/`](plugin/aiwatch/)。完整说明：**[aiwatch.maicarons.cc/plugin](https://aiwatch.maicarons.cc/plugin)**。

## 项目结构

```
src/                   # React 19 SPA（Vite，无路由 — App.jsx 中基于哈希的路由）
  components/          # 共享 UI：StatusPill、SkeletonUI、EmptyState、Modal、Sidebar、Topbar、CookieBanner、AnalysisModal、…
  pages/               # Overview、Latency、Incidents、Uptime、ServiceDetails、Settings、Ranking、Statusline
  hooks/               # usePolling、useTheme、useLang、useSettings、useGitHubStars、useMonthlyArchives
  utils/               # analytics、calendar、time、pageContext、constants、hashRoute、…
  locales/             # ko.js、en.js、zh.js（扁平 key→string 映射）
api/                   # 辅助函数位于 `_` 前缀目录，处理函数在边缘运行时执行，
                       # 因此两者都不占用 Hobby 12 个无服务器函数的上限（#862/#867）
  intro.ts             # 介绍页（/intro）              _intro/       # 其 SSR 模板
  is-down.ts           # “Is X Down?” SSR 页面（46 项服务）   _is-down/  # slug-map、seo-content、template
  methodology.ts       # “AIWatch 如何工作”（/methodology） _methodology/
  plugin.ts            # Claude Code 插件落地页         _plugin/
  badges.ts            # 状态徽章画廊（/badges）     _badges/
  reports.ts           # /reports/* 代理 → Jekyll 站点     _shared/      # 共享 Edge 辅助函数
  confirm.ts csp-report.ts plugin-privacy.ts extension-privacy.ts
public/
  manifest.json        # PWA manifest（Service Worker 由 src/sw/ 构建 → /sw.js）
  icon-192.png         # PWA 图标 192x192
  icon-512.png         # PWA 图标 512x512
scripts/               # 构建/CI/运维脚本（OG 生成、CI lint 门禁、verify-reminders、…）
worker/
  src/
    index.ts           # Worker 入口：CORS、路由、/api/*、/badge、/feed、cron 定时处理
    services.ts        # 服务配置 + 抓取编排器 + 状态判定
    types.ts utils.ts  # 共享类型 + 共享工具
    score.ts           # AIWatch Score 计算
    alerts.ts          # 提醒检测（故障 + 状态边沿）、保持、合并
    ai-analysis.ts     # 混合 AI 故障分析（Gemma 4 主用 + Sonnet 兜底）
    anthropic.ts       # Anthropic Messages REST 调用（模型 id、重试、状态分类）
    probe.ts           # 健康检查探测 — 直接 RTT 测量（`PROBE_TARGETS`）
    rss.ts badge.ts og.ts og-render.ts   # 订阅源、徽章、OG 图片
    daily-summary.ts weekly-briefing.ts monthly-archive.ts monthly-narrative.ts
    security-monitor.ts   # AI 服务安全监控（HN Algolia、OSV.dev SDK 漏洞 — 24 个跟踪包）
    changelog.ts reddit.ts platform-monitor.ts
    suppression.ts overrides.ts withdrawn.ts upstream-link.ts   # 运维 + 故障层
    parsers/           # 平台特定解析器
      statuspage.ts    # Atlassian Statuspage
      incident-io.ts   # incident.io（Atlassian 兼容 API）
      gcloud.ts        # Google Cloud Vertex（gemini 主来源）
      aistudio.ts      # Google AI Studio + 直连 Gemini API（gemini 次要来源，#310）
      instatus.ts      # Instatus
      betterstack.ts   # Better Stack
      datadog.ts       # Datadog Status Page（OpenRouter）
      flashduty.ts     # Flashduty（DeepSeek + DeepSeek App）
      aws.ts           # AWS Health 事件 JSON API — Bedrock（+ 供 Azure OpenAI 复用的 RSS 解析器）
      impact-weights.ts uptime-interval.ts   # 共享可用率原语（#1006）
    __tests__/ parsers/__tests__/   # Vitest 单元测试
```

> 这是一张地图，不是清单 — `worker/src/` 约有 50 个模块。每个模块的用途和塑造它的 issue 见
> **[docs/reference/directory-map.md](docs/reference/directory-map.md)**。

## 贡献

详细指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。

所有编程智能体应先阅读 [AGENTS.md](AGENTS.md) 和
[与智能体无关的开发流程](docs/reference/development-workflow.md)。Claude Code
贡献者还应阅读 [CLAUDE.md](CLAUDE.md) 了解 Claude 专用的自动化规则。

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/my-feature`）
3. 遵循 [AGENTS.md](AGENTS.md) 和
   [docs/reference/development-workflow.md](docs/reference/development-workflow.md) 中的共享流程；Claude Code
   贡献者还应遵循 [CLAUDE.md](CLAUDE.md)
4. 构建 + 测试：`npm run build && npm test && npm run test:src && npm run test:worker`
5. 使用 [PR 模板](.github/pull_request_template.md)提交 pull request

### Issue

- **Bug 报告**：使用 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) 模板
- **功能请求**：使用 [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) 模板

### Pull Request

- 每个 PR 只包含一个功能或修复
- 所有测试必须通过（`npm test` + `npm run test:src` + `npm run test:worker`）— 由 CI 门禁，前端变更会运行 E2E
- 在提交信息中包含 `closes #N`
- 填写 PR 检查清单

## 安全

发现漏洞？请负责任地报告 — 详情见 [SECURITY.md](SECURITY.md)。

## 许可

[AGPL-3.0](LICENSE)
