# RFC: AI 阅读知识内化助手

> 让阅读真正转化为记忆 — 从碎片化阅读到长期知识资产的智能助手

## 功能设计

### 核心功能
1. **智能提取**：从网页、PDF、Kindle 高亮中自动提取核心知识点
2. **问答生成**：基于知识点生成测试问题（填空、选择、简答）
3. **间隔复习**：按遗忘曲线安排复习时间，推送微信/Telegram 提醒
4. **关联网络**：自动连接相关知识点，构建个人知识图谱
5. **进度追踪**：可视化记忆强度和复习统计

### MVP 范围
- 单点切入：「摘要 + 问答」功能
- 支持 PDF 格式优先
- 基础间隔重复提醒
- 简单的知识点列表管理

## 技术方案

### 数据层
```
知识点表 (knowledge_points)
- id, user_id, source_type, source_url
- title, content, extracted_at
- memory_strength, next_review_at
- created_at, updated_at  -- 审计字段

复习记录表 (review_records)
- id, knowledge_point_id, reviewed_at
- result (easy/good/hard/again)
- response_time_ms

知识关联表 (knowledge_relations)
- id, source_id, target_id
- relation_type, confidence_score
```

### 逻辑层
```
src/
├── extraction/
│   ├── pdf-parser.ts      # PDF 文本提取
│   ├── web-scraper.ts     # 网页内容抓取
│   └── llm-extractor.ts   # LLM 知识点提取
├── learning/
│   ├── spaced-repetition.ts  # SM-2 算法（经典且验证充分）
│   ├── qa-generator.ts       # 问答生成
│   └── relation-builder.ts   # 知识关联
├── notification/
│   ├── telegram-bot.ts    # Telegram 推送
│   └── scheduler.ts       # 复习调度
└── api/
    └── routes/            # RESTful API
```

**SM-2 算法选择原因**：
- SuperMemo 2 是最经典、应用最广的间隔重复算法
- Anki、Quizlet 等主流产品均基于此或其变体
- 算法简单、参数少、易于实现和调试
- 社区经验丰富，优化策略成熟

### 展示层
- **Web Dashboard**：React + Tailwind
  - 知识点卡片视图
  - 复习日历
  - 记忆曲线图表
- **Telegram Bot**：复习提醒 + 快速问答

## 实现步骤

### Phase 1: MVP (2-3 周)
> 注：2 周为理想情况，LLM 提取调优可能需要额外时间

1. [ ] 项目初始化：Next.js + Prisma + PostgreSQL
2. [ ] PDF 上传 + 文本提取
3. [ ] LLM 知识点提取 (GLM-4 / Claude)
4. [ ] 基础问答生成
5. [ ] 简单间隔重复算法
6. [ ] Telegram Bot 集成

### Phase 2: 核心功能 (2 周)
7. [ ] 记忆强度可视化
8. [ ] 知识点关联推荐
9. [ ] 复习统计分析
10. [ ] 多格式支持（网页、Kindle）

### Phase 3: 增强体验 (1 周)
11. [ ] 知识图谱可视化
12. [ ] 导入 Anki 卡片
13. [ ] 导出笔记到 Notion

## 资源需求

### API
- **LLM**：GLM-4 (智谱) 或 Claude (Anthropic)
  - 知识点提取：~500 tokens/篇
  - 问答生成：~200 tokens/知识点
- **Telegram Bot API**：免费

### 服务
- **数据库**：PostgreSQL (Vercel Postgres / Supabase)
- **存储**：PDF 文件存储 (S3 / Vercel Blob)
- **定时任务**：Vercel Cron / GitHub Actions

### 预估成本（月）
- LLM API：$10-30（100 用户）
- 数据库：$0-10（Vercel 免费额度）
- 存储：$0-5（小文件为主）

## 风险与对策

| 风险 | 对策 |
|------|------|
| 竞品众多（Readwise、Anki） | 聚焦「主动内化」差异化 |
| 用户续费率低 | 细分场景（考研、职业认证）|
| PDF 解析质量不稳定 | 多引擎备份 + 人工修正 |

## 成功指标

- 用户周复习完成率 > 60%
- 知识点记忆强度 30 天保持 > 50%
- 付费转化率 > 5%（3 个月内）

---

*Created from Issue #16*
