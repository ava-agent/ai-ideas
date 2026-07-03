# 运营改进建议 - 2026-W30

## 识别的改进点

### 1. 统一脚本存放位置
- 问题：根目录和 scripts/ 目录都存放脚本（fetch_huggingface_trends.py, predict_trends.py, search_arxiv.py, update_idea_tracker.py, update_stats.py 等在根目录，其它在 scripts/）
- 建议：将根目录脚本统一移动到 scripts/ 目录

### 2. idea-tracker.json 同步
- 问题：idea-tracker.json 最后更新时间为 2026-06-29，存在多个未被追踪的 idea 文件
- 建议：运行 idea 同步脚本更新 idea-tracker.json

### 3. 整理 untracked 目录/文件
- 问题：存在 untracked 目录 awesome-ai-ideas/ 及多个临时/idea 文件
- 建议：要么提交，要么清理

---
**记录时间**：2026-07-03
