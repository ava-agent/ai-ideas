# 💡 ReContext AI - Long-Context Evidence Utilization Enhancer

## Issue #1505

---

## 🎯 用户
AI 应用开发者、LLM 系统工程师、企业知识管理系统管理员

## 🚀 问题
长上下文 LLMs 虽然支持大窗口，但实际推理时无法有效利用上下文中已有的相关证据

## 💡 功能
基于递归证据重放技术，无需训练即可提升长上下文 LLM 的证据利用率和推理准确性

## 🛠️ 方案
1. 使用模型内部相关性信号构建查询条件的证据池
2. 在保留完整原始上下文的同时，递归选择并重放相关证据
3. 分离证据组织与答案生成过程，无需训练或外部记忆
4. 提供理论分析和基准测试验证效果

*生成时间：2026-07-04*
*基于 arXiv:2607.02509 - ReContext: Recursive Evidence Replay as LLM Harness for Long-Context Reasoning*
