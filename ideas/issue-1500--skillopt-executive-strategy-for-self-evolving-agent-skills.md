# 💡 [Hot] SkillOpt: Executive Strategy for Self-Evolving Agent Skills

## Paper: https://huggingface.co/papers/2605.23904

---

## 🎯 问题

**痛点背景：**
- Agent skills today are hand-crafted, generated one-shot, or evolved through loosely controlled self-revision
- None of these approaches behaves like a deep-learning optimizer for the skill
- None reliably improves over its starting point under feedback
- There's a need for systematic, reproducible skill optimization

**具体问题：**
- How to treat agent skills as trainable external state with the same discipline as weight-space optimization?
- How to create a controllable text-space optimizer for agent skills?
- How to ensure stable updates with zero deployment inference overhead?

---

## 🤖 功能

**核心功能：**
- Systematic text-space optimizer for agent skills
- Train skills as external agent state with stable updates
- Zero deployment inference overhead
- Add/delete/replace edits on a single skill document
- Validation score-based edit acceptance

**特色功能：**
- Textual learning-rate budget
- Rejected-edit buffer
- Epoch-wise slow/meta update
- Cross-model transferability
- Cross-environment compatibility (Codex, Claude Code)

---

## 🏗️ 方案

**技术架构：**
- Separate optimizer model that turns scored rollouts into edits
- Single skill document as the trainable external state
- Strict validation mechanism for edit acceptance
- Zero inference-time model calls at deployment

**实现路线：**
- MVP: Core SkillOpt framework with basic optimization loop
- V1: Multiple benchmarks support, cross-model transfer
- V2: Community skill library, collaborative optimization

**技术栈：**
- Python backend for optimization loop
- Modern web interface for skill management
- Integration with popular agent frameworks

---

## 📊 验证

**成功指标：**
- +23.5 points average accuracy lift on GPT-5.5 in direct chat
- +24.8 points inside Codex agentic loop
- +19.1 points inside Claude Code
- Best or tied on all 52 evaluated (model, benchmark, harness) cells

**验证计划：**
- Test across 6 benchmarks, 7 target models, 3 execution harnesses
- Measure transferability across model scales and environments
- Compare against human, one-shot LLM, Trace2Skill, TextGrad, GEPA, EvoSkill

---

## 🎯 用户

**目标用户：**
- AI Agent Developers and Builders
- Product Teams building agentic applications
- Researchers in multi-agent systems
- Enterprises adopting agent technology

---

*生成时间：2026-07-03*
*基于 Paper: https://huggingface.co/papers/2605.23904*
*Microsoft Research, 2026*
