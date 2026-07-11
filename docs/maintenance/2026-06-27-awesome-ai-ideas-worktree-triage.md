# Awesome AI Ideas 工作区 Triage

- 日期: 2026-06-27
- 仓库: `ava-agent/awesome-ai-ideas`
- 分支: `main`
- 用途: 在继续优化创意库和 Next.js 站点前，先把未跟踪文件分组，避免把本地生成物、截图和部署元数据混入业务提交。

## 当前结论

- `site/` 是 Next.js 16 目录，包含源码、依赖锁文件、设计记录和本地构建产物。
- `.playwright-mcp/`、`site/.next/`、`site/node_modules/`、`site/.vercel/` 属于本地工具、依赖或部署元数据，已通过 `.gitignore` 忽略。
- 根目录截图文件是本地 QA/设计产物，是否提交需要人工确认。
- `evaluation-final-report.md` 是 212 个创意的综合评估报告，可作为内容资产审阅。
- `evaluation_report.json` 的两处未转义英文双引号已修复，`jq empty` 通过。

## 变更分组

| 分组 | 路径/范围 | 状态 | 建议处理 |
|---|---|---|---|
| 维护规则 | `.gitignore`, `AGENTS.md`, `DEPLOYMENT.md`, `docs/maintenance/2026-06-27-awesome-ai-ideas-worktree-triage.md` | 新增/更新 | 作为 `maintenance-baseline` 提交。 |
| 站点应用 | `site/` | 未跟踪 | 提交前跑 lint、type-check、test、build；不要提交 `.next/`、`.vercel/`、`node_modules/`。 |
| 环境模板 | `site/.env.example` | 新增 | 记录当前无运行时环境变量。 |
| 评估报告 | `evaluation-final-report.md` | 未跟踪 | 审阅后作为产品分析资料提交。 |
| 评估 JSON | `evaluation_report.json` | 已修复 | 与评估报告一起提交，并在构建时强制解析。 |
| QA 截图 | `detail-page.png`, `homepage*.png`, `ideas-page.png`, `leaderboard-page.png`, `redesign-*.png` | 未跟踪 | 判断是否作为设计证据保留；否则归档或忽略。 |

## 推荐提交顺序

1. `maintenance-baseline`: `.gitignore`、`AGENTS.md`、`DEPLOYMENT.md`、本 triage 文档。
2. `site-app`: `site/` 源码、锁文件、`site/.env.example` 和站点文档。
3. `evaluation-report`: `evaluation-final-report.md`，以及修复后的 `evaluation_report.json`。
4. `qa-screenshots`: 经确认需要保留的截图。

## 验证记录

- `git -c core.quotePath=false status --short --ignored`: 已用于分类当前工作区。
- `jq 'keys' evaluation_report.json`: 失败，确认 JSON 当前不可解析。
- `git diff --check`: 已通过。
- `cd site && npm run lint`: 已通过。
- `cd site && npm run type-check`: 已通过。
- `cd site && npm run test`: 已通过，当前等价于 lint + type-check。
- `cd site && npm run build`: 已通过，Next.js 生成 221 个静态页面。
- 2026-07-11 复验: 数据脚本生成 223 个 idea、38 个评分项和 216 个正文映射；Next.js 生成 222 个静态页面。
- 构建不再因为预生成 JSON 已存在而跳过数据刷新；源评估 JSON 无效时会明确失败。
- 敏感信息文件级扫描: 新增/变更维护文档、站点源码和评估文件未命中常见密钥模式。
