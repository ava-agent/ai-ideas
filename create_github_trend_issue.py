#!/usr/bin/env python3
"""
基于GitHub热门AI项目快速创建1个AI创意Issue
"""

import requests
import json
import re
import os
from datetime import datetime
import subprocess
import sys
import urllib.parse


def fetch_trending_ai_projects():
    """Fetch trending AI projects from GitHub"""
    # Search for AI-related repos (without date filter for reliability)
    queries = [
        "topic:llm",
        "topic:ai",
        "topic:machine-learning",
        "topic:deep-learning",
    ]

    repos = []

    for query in queries:
        encoded_query = urllib.parse.quote(query)
        url = f"https://api.github.com/search/repositories?q={encoded_query}&sort=stars&order=desc&per_page=10"

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            repos.extend(data.get('items', []))
        except Exception as e:
            print(f"Error fetching {query}: {e}", file=sys.stderr)

    # Deduplicate by full_name
    seen = set()
    unique = []
    for repo in repos:
        if repo['full_name'] not in seen:
            seen.add(repo['full_name'])
            unique.append(repo)

    # Sort by stars
    unique.sort(key=lambda x: x['stargazers_count'], reverse=True)

    return unique[:20]


def generate_creative_idea(repo):
    """基于GitHub项目生成创意"""
    repo_name = repo.get('full_name', 'Unknown')
    repo_desc = repo.get('description', 'No description available')
    repo_url = repo.get('html_url', '#')
    repo_stars = repo.get('stargazers_count', 0)

    # 简化标题用于文件名
    safe_title = re.sub(r'[^\w\s-]', '', repo_name.lower())
    safe_title = re.sub(r'[-\s]+', '-', safe_title).strip('-')

    # 确定用户群体和问题
    repo_lower = repo_desc.lower() + repo_name.lower()
    if 'llm' in repo_lower or 'language' in repo_lower or 'gpt' in repo_lower:
        user = "开发者团队、AI产品经理、企业AI团队"
        problem = "LLM集成复杂、成本高、质量不可控"
        idea_title = f"💡 [for {user}] {repo_name} - 智能LLM应用与集成平台"
        functions = "多模型管理、成本优化、质量监控、工作流编排"
        solution = """1. 多模型统一接口 - 支持主流LLM和自部署模型
2. 成本优化引擎 - 智能路由和缓存降低调用成本
3. 质量监控系统 - 实时监控输出质量和安全性
4. 工作流编排 - 可视化的LLM工作流设计和执行
5. 应用快速构建 - 低代码平台快速构建AI应用"""
    elif 'code' in repo_lower or 'developer' in repo_lower or 'dev' in repo_lower:
        user = "开发者团队、技术公司CTO、编程教育机构"
        problem = "开发效率低、代码质量不稳定、学习曲线陡峭"
        idea_title = f"💡 [for {user}] {repo_name} - 智能代码开发与协作平台"
        functions = "智能代码补全、代码审查、自动化测试、知识管理"
        solution = """1. 智能代码助手 - 基于项目上下文的代码补全和生成
2. 自动代码审查 - 多维度质量评估和修复建议
3. 测试自动化 - AI驱动的测试用例生成和执行
4. 知识管理 - 自动积累和共享开发知识
5. 协作增强 - 团队开发流程的智能化协作"""
    elif 'vision' in repo_lower or 'image' in repo_lower or 'video' in repo_lower:
        user = "内容创作者、营销团队、媒体公司"
        problem = "内容制作成本高、效率低、创意不足"
        idea_title = f"💡 [for {user}] {repo_name} - 智能视觉内容创作平台"
        functions = "图像生成、视频编辑、风格迁移、内容理解"
        solution = """1. 多模态内容生成 - 文本到图像/视频的智能生成
2. 智能编辑工具 - AI驱动的内容编辑和优化
3. 风格迁移系统 - 多种艺术风格的智能转换
4. 内容理解引擎 - 自动分析和标注视觉内容
5. 协作创作环境 - 团队协同的内容创作平台"""
    elif 'agent' in repo_lower or 'autonomous' in repo_lower:
        user = "AI研究团队、企业自动化部门、产品团队"
        problem = "Agent开发复杂、部署困难、监控缺失"
        idea_title = f"💡 [for {user}] {repo_name} - 智能Agent开发与运维平台"
        functions = "Agent构建、部署管理、运行监控、技能编排"
        solution = """1. Agent开发框架 - 简化的Agent构建和调试工具
2. 自动化部署 - 一键部署Agent到各种环境
3. 运行监控中心 - 实时监控Agent状态和行为
4. 技能编排系统 - 可视化的Agent技能组合
5. 协作生态 - Agent之间的协作和知识共享"""
    else:
        user = "各行业创新团队、产品经理、创业者"
        problem = "创新效率低、创意不足、技术落地难"
        idea_title = f"💡 [for {user}] {repo_name} - 创新AI应用与实验平台"
        functions = "智能化工作流、个性化体验、实时协作、持续学习"
        solution = """1. 智能工作流引擎 - 自动化的AI驱动业务流程优化
2. 个性化推荐系统 - 基于用户行为的智能推荐
3. 实时协作环境 - 多用户协同的AI增强协作
4. 持续学习机制 - 系统从使用中不断优化
5. 创新管理工具 - 创意收集、评估、落地的全流程管理"""

    return {
        'idea_title': idea_title,
        'user': user,
        'problem': problem,
        'functions': functions,
        'solution': solution,
        'source_url': repo_url,
        'source_title': f"{repo_name} (⭐ {repo_stars:,})",
        'safe_title': safe_title,
        'repo': repo
    }


def save_idea_file(idea):
    """保存创意到ideas目录"""
    ideas_dir = "ideas"
    if not os.path.exists(ideas_dir):
        os.makedirs(ideas_dir)

    # 生成文件名
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"issue-{timestamp}--{idea['safe_title']}.md"
    filepath = os.path.join(ideas_dir, filename)

    # 生成内容
    content = f"""# {idea['idea_title']}

## 🎯 用户
{idea['user']}

## 🚀 问题
{idea['problem']}

## 💡 功能
{idea['functions']}

## 🛠️ 方案
{idea['solution']}

---

*基于GitHub项目：{idea['source_title']} ({idea['source_url']})*
*生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return filepath


def create_github_issue(idea, idea_filepath):
    """创建GitHub Issue"""
    # 生成Issue body
    issue_body = f"""# {idea['idea_title']}

## 🎯 用户
{idea['user']}

## 🚀 问题
{idea['problem']}

## 💡 功能
{idea['functions']}

## 🛠️ 方案
{idea['solution']}

---

*基于GitHub项目：{idea['source_title']} ({idea['source_url']})*
*相关文件已创建：{idea_filepath}*
"""

    # 保存到issue-body.md
    with open('issue-body.md', 'w', encoding='utf-8') as f:
        f.write(issue_body)

    # 使用gh CLI创建Issue
    try:
        result = subprocess.run(
            ['gh', 'issue', 'create',
             '--title', idea['idea_title'],
             '--body-file', 'issue-body.md',
             '--label', 'ai-idea', '--label', 'github-trend', '--label', 'automated-generated'],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ GitHub Issue创建成功: {result.stdout.strip()}")
        return True
    except Exception as e:
        print(f"⚠️ 创建GitHub Issue失败: {e}")
        return False


def main():
    print("🚀 基于GitHub热门AI项目创建AI创意Issue")
    print("="*50)

    # 1. 获取项目
    print("📚 正在获取GitHub热门AI项目...")
    repos = fetch_trending_ai_projects()
    if not repos:
        print("❌ 没有获取到项目")
        return

    print(f"📝 找到 {len(repos)} 个项目")

    # 2. 选择第一个项目
    repo = repos[0]
    print(f"🎯 选择项目: {repo.get('full_name', 'Unknown')} (⭐ {repo.get('stargazers_count', 0):,})")

    # 3. 生成创意
    print("💡 正在生成创意...")
    idea = generate_creative_idea(repo)

    # 4. 保存文件
    print("📄 正在保存创意文件...")
    idea_filepath = save_idea_file(idea)
    print(f"✅ 创意文件已保存: {idea_filepath}")

    # 5. 创建GitHub Issue
    print("🔗 正在创建GitHub Issue...")
    create_github_issue(idea, idea_filepath)

    print("\n🎉 任务完成!")
    print(f"📌 创意标题: {idea['idea_title']}")


if __name__ == "__main__":
    main()
