# AdDisclosure AI — Issue #1562

> 来源 Issue: https://github.com/ava-agent/awesome-ai-ideas/issues/1562
> 灵感：TIME 已开始向 AI Agent 投放广告（Digiday / Hacker News, 2026-08-09）

## 一句话定义

面向 AI Agent 生态的**广告披露与归因中间件**：不做给人看的横幅，而做 Agent 时代的广告透明层 + 归因协议，让商业化与用户信任可以共存。

## 背景与痛点

当 AI Agent 代替用户浏览、比价、汇总信息时，传统"给人看"的广告投放逻辑正在失效：

1. **品牌方**：无法判断自己的产品/服务是否被 Agent 正确引用、推荐或排除，预算花出去却看不到"Agent 侧曝光"。
2. **内容发布方**：直接给 Agent 投广告缺乏标准格式，容易污染回答、引发用户反感，也难以衡量效果。
3. **用户**：Agent 回答中悄悄夹带付费推荐，透明度低，无法区分"客观建议"与"赞助内容"。
4. **Agent 开发者**：缺少合规的商业化接口，要么全免费烧钱，要么偷偷塞广告损害信任。

## 产品形态

- **For 品牌方**：提供"Agent 可读"的结构化赞助信息包（产品卖点、优惠码、适用场景、披露文案），并追踪哪些 Agent 在什么问题下引用了自己。
- **For Agent 开发者**：提供标准化 SDK，在回答涉及赞助内容时自动插入 `[Sponsored]` 标签 + 原因说明，保持用户信任，同时获得合规收入分成。
- **For 用户**：一键查看"本回答中哪些信息来自赞助"，可选择关闭个性化赞助推荐。
- **For 内容发布方**：将原有广告位转化为"Agent 友好型"结构化数据，按 Agent 引用次数而非页面展示次数计费。

## 核心模块

### 1. Sponsored Knowledge Pack（SKP）
结构化赞助内容包，基于 JSON-LD / schema.org 扩展，字段建议：

```json
{
  "@context": "https://addisclosure.ai/ns/v1",
  "advertiser": "BrandX",
  "offer": "10% off with code AGENT10",
  "applicableIntents": ["best_noise_cancelling_headphones", "travel_headphone_review"],
  "disclosure": "Sponsored by BrandX",
  "attributionId": "skp_01HX...",
  "validUntil": "2026-12-31"
}
```

### 2. Disclosure SDK
- 在 LLM 生成阶段对"引用了 SKP 的片段"进行标注，输出 `[Sponsored]` 前缀与悬浮原因卡。
- 提供"为什么推荐这个"的可解释链路：命中意图 → SKP 版本 → 广告主。
- 支持用户级开关与全局"零赞助"模式。

### 3. Attribution Protocol
- 每次引用生成不可篡改的引用回执（quote + SKP 版本 hash + Agent ID + 时间戳）。
- 品牌方后台按"Agent / 问题意图 / 转化"维度看曝光与归因，而非 PV。
- 与发布方结算改为按"有效 Agent 引用次数"计费。

### 4. Trust Layer
- 独立审计：披露标签是否真实插入、是否存在未标记的赞助内容。
- 面向用户的透明页：列出本会话中所有赞助来源与广告主。
- 对 Agent 开发者的合规评分，作为分发与收益分成的依据。

## MVP 范围

1. SKP 规范 v0.1 + 品牌方自助上传后台。
2. 一个开源 Python/TS SDK：函数调用级别的 `with_disclosure()` 装饰器，自动注入披露标签并上报引用回执。
3. 一个可演示的"购物比价 Agent"：3 个模拟品牌 SKP，回答中明确标注赞助、给出关闭开关。
4. 最简归因看板：按 Agent / 意图统计引用次数。

## 技术可行性

- **结构化数据**：JSON-LD + schema.org 扩展即可，协议层无重资产。
- **披露注入**：在 RAG 检索结果里附带 SKP，提示词强制要求模型输出 `[Sponsored]` 标记；后处理用规则兜底，避免模型漏标。
- **归因**：引用回执可先落对象存储 +  ClickHouse / BigQuery；上量后再引入 Merkle 树或透明日志做审计。
- **难点**：
  - 模型可能"复述"赞助内容但跳过标签，需要后处理与评测集持续守门。
  - 跨 Agent 的统一归因 ID 与反作弊需要生态采纳，早期应先拿下 1–2 家 Agent 平台共创。
  - 与 IAB / ads.txt 等既有广告标准的衔接，避免重复造轮子。

## 商业模式

- 品牌方：按 SKP 托管 + 引用回执收费（SaaS + 用量）。
- Agent 开发者：收入分成，披露 SDK 免费。
- 发布方：结构化广告位改造与撮合佣金。

## 目标用户

- AI Agent 平台 / 创业公司开发者
- 希望触达 Agent 流量的品牌方与数字营销团队
- 正在寻找 AI 时代商业模式的内容发布方
- 关心 AI 回答透明度的终端用户

## 优先级

**Medium** — 趋势明确（TIME 已开先例）但市场尚早期，适合作为协议型产品卡位：先把"披露 + 归因"标准做出来，再随 Agent 流量增长收税。

## 风险与边界

- 若头部 Agent 厂商自建封闭广告体系，第三方协议空间会被压缩；应优先走开源 + 标准路线。
- 披露不是审查：SDK 只负责透明标记，不替模型决定是否推荐。
- 隐私：归因回执默认不包含可识别个人信息，符合 GDPR / 个保法最小必要原则。
