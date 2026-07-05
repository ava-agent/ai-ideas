# 运营改进建议 - 2026-W32

## 识别的改进点

### 1. 统一脚本存放位置
- 问题：根目录和 scripts/ 目录都存放脚本
- 建议：将根目录脚本统一移动到 scripts/ 目录

### 2. 大量 untracked 文件需要管理
- 问题：存在多个未提交的 idea 新文件、脚本、proposal
- 建议：要么提交这些文件，要么清理

### 3. idea-tracker.json 过期
- 问题：idea-tracker.json 最后同步在 2026-04-23，存在大量未追踪 idea
- 建议：运行 update_idea_tracker.py 更新追踪文件

---
**记录时间**：2026-07-05
