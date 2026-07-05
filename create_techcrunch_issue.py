#!/usr/bin/env python3
"""
基于TechCrunch AI创业新闻快速创建1个AI创意Issue
"""

import requests
import json
import re
import os
from datetime import datetime
import subprocess
import sys
import xml.etree.ElementTree as ET


def fetch_techcrunch_ai_news():
    """
    获取TechCrunch AI创业新闻
    """
    # TechCrunch AI category RSS feed
    url = "https://techcrunch.com/category/artificial-intelligence/feed/"
    topics = []

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()
        
        # Parse RSS feed
        root = ET.fromstring(response.content)
        
        # Find all items
        for item in root.findall('.//item'):
            try:
                title_elem = item.find('title')
                link_elem = item.find('link')
                
                if title_elem is not None and link_elem is not None:
                    title = title_elem.text.strip()
                    link = link_elem.text.strip()
                    
                    topics.append({
                        'title': title,
                        'url': link,
                        'source': 'TechCrunch'
                    })
            except Exception as e:
                continue
    
    except Exception as e:
        print(f"Error fetching from TechCrunch RSS: {e}", file=sys.stderr)
    
    # If no topics found, use fallback
    if not topics:
        topics = [
            {
                'title': "AI Agents for Enterprise Automation",
                'url': "#",
                'source': 'Fallback'
            },
            {
                'title': "Multimodal AI for Content Creation",
                'url': "#",
                'source': 'Fallback'
            }
        ]

    return topics


def generate_creative_idea(topic):
    """基于话题生成创意"""
    title = topic.get('title', 'AI Trend')
    url = topic.get('url', '#')
    source = topic.get('source', 'Unknown')
    
    # 简化标题用于文件名
    safe_title = re.sub(r'[^\w\s-]', '', title.lower())
    safe_title = re.sub(r'[-\s]+', '-', safe_title).strip('-')
    title_lower = title.lower()
    
    # 确定用户群体和问题
    if 'agent' in title_lower or 'autonomous' in title_lower:
        user = "企业运营团队、AI产品经理、自动化部门"
        problem = "业务流程繁琐、人工成本高、执行效率低"
        idea_title = f"💡 {title} — 企业级AI Agent自动化平台"
        functions = "工作流编排、多Agent协作、实时监控、智能调度"
        solution = """1. 可视化工作流设计 - 拖拽式编排业务流程
2. 多Agent协作引擎 - 专业化Agent分工协作
3. 实时监控中心 - 全流程状态追踪和异常告警
4. 智能调度系统 - 动态分配任务和资源
5. 持续学习机制 - 从执行中优化流程"""
    
    elif 'multimodal' in title_lower or 'image' in title_lower or 'video' in title_lower or 'vision' in title_lower:
        user = "内容创作者、营销团队、媒体公司"
        problem = "内容制作成本高、效率低、创意不足"
        idea_title = f"💡 {title} — 多模态AI内容创作平台"
        functions = "多模态生成、智能编辑、风格迁移、内容理解"
        solution = """1. 多模态内容生成 - 文本/图像/视频智能生成
2. 智能编辑工具 - AI驱动的内容编辑和优化
3. 风格迁移系统 - 多种艺术风格智能转换
4. 内容理解引擎 - 自动分析和标注视觉内容
5. 协作创作环境 - 团队协同内容创作平台"""
    
    elif 'code' in title_lower or 'developer' in title_lower or 'dev' in title_lower:
        user = "开发者团队、技术公司CTO、编程教育机构"
        problem = "开发效率低、代码质量不稳定、学习曲线陡峭"
        idea_title = f"💡 {title} — 智能代码开发与协作平台"
        functions = "智能代码补全、代码审查、自动化测试、知识管理"
        solution = """1. 智能代码助手 - 基于项目上下文的代码补全和生成
2. 自动代码审查 - 多维度质量评估和修复建议
3. 测试自动化 - AI驱动的测试用例生成和执行
4. 知识管理 - 自动积累和共享开发知识
5. 协作增强 - 团队开发流程的智能化协作"""
    
    elif 'llm' in title_lower or 'language' in title_lower or 'gpt' in title_lower:
        user = "开发者团队、AI产品经理、企业AI团队"
        problem = "LLM集成复杂、成本高、质量不可控"
        idea_title = f"💡 {title} — 智能LLM应用与集成平台"
        functions = "多模型管理、成本优化、质量监控、工作流编排"
        solution = """1. 多模型统一接口 - 支持主流LLM和自部署模型
2. 成本优化引擎 - 智能路由和缓存降低调用成本
3. 质量监控系统 - 实时监控输出质量和安全性
4. 工作流编排 - 可视化的LLM工作流设计和执行
5. 应用快速构建 - 低代码平台快速构建AI应用"""
    
    else:
        user = "各行业创新团队、产品经理、创业者"
        problem = "创新效率低、创意不足、技术落地难"
        idea_title = f"💡 {title} — 创新AI应用与实验平台"
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
        'source_url': url,
        'source_title': f"{title} ({source})",
        'safe_title': safe_title,
        'topic': topic
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

*基于话题：{idea['source_title']} ({idea['source_url']})*
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

*基于话题：{idea['source_title']} ({idea['source_url']})*
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
             '--label', 'idea'],
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
    print("🚀 基于TechCrunch AI创业新闻创建AI创意Issue")
    print("="*50)

    # 1. 获取话题
    print("📚 正在获取TechCrunch AI新闻...")
    topics = fetch_techcrunch_ai_news()
    if not topics:
        print("❌ 没有获取到话题")
        return

    print(f"📝 找到 {len(topics)} 个话题")

    # 2. 选择第一个话题
    topic = topics[0]
    print(f"🎯 选择话题: {topic.get('title', 'Unknown')} ({topic.get('source')})")

    # 3. 生成创意
    print("💡 正在生成创意...")
    idea = generate_creative_idea(topic)

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
