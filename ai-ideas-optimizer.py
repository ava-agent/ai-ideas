#!/usr/bin/env python3
"""
AI Ideas 优化脚本
分析现有创意并提供具体的改进建议
"""

import subprocess
import json
import re
from datetime import datetime
from typing import Dict, List, Tuple

class AIIdeasEvaluator:
    def __init__(self):
        self.quality_criteria = {
            'title_clarity': 15,
            'value_proposition': 20,
            'technical_depth': 25,
            'market_analysis': 15,
            'business_model': 15,
            'implementation_feasibility': 10
        }
        
    def evaluate_idea(self, idea_content: str) -> Dict:
        """评估单个创意的质量"""
        scores = {}
        feedback = []
        
        # 1. 标题清晰度评估
        title_score, title_fb = self._evaluate_title_clarity(idea_content)
        scores['title_clarity'] = title_score
        feedback.append(title_fb)
        
        # 2. 价值主张评估
        value_score, value_fb = self._evaluate_value_proposition(idea_content)
        scores['value_proposition'] = value_score
        feedback.append(value_fb)
        
        # 3. 技术深度评估
        tech_score, tech_fb = self._evaluate_technical_depth(idea_content)
        scores['technical_depth'] = tech_score
        feedback.append(tech_fb)
        
        # 4. 市场分析评估
        market_score, market_fb = self._evaluate_market_analysis(idea_content)
        scores['market_analysis'] = market_score
        feedback.append(market_fb)
        
        # 5. 商业模式评估
        business_score, business_fb = self._evaluate_business_model(idea_content)
        scores['business_model'] = business_score
        feedback.append(business_fb)
        
        # 6. 实施可行性评估
        feasibility_score, feasibility_fb = self._evaluate_feasibility(idea_content)
        scores['implementation_feasibility'] = feasibility_score
        feedback.append(feasibility_fb)
        
        total_score = sum(scores.values())
        
        return {
            'scores': scores,
            'total_score': total_score,
            'feedback': feedback,
            'quality_level': self._get_quality_level(total_score),
            'improvement_suggestions': self._generate_improvement_suggestions(scores, idea_content)
        }
    
    def _evaluate_title_clarity(self, content: str) -> Tuple[int, str]:
        """评估标题清晰度"""
        # 检查是否包含标准结构
        has_target_audience = '[for' in content
        has_problem_solution = '从' in content and '到' in content
        has_emoji = bool(re.search(r'[💡✨🎯🗺️💰📊]', content))
        
        score = 0
        feedback = []
        
        if has_target_audience:
            score += 5
            feedback.append("✅ 包含目标受众标识")
        else:
            feedback.append("❌ 缺少目标受众标识")
            
        if has_problem_solution:
            score += 5
            feedback.append("✅ 采用问题-解决方案结构")
        else:
            feedback.append("❌ 缺少问题-解决方案结构")
            
        if has_emoji:
            score += 5
            feedback.append("✅ 使用emoji增强可读性")
        else:
            feedback.append("❌ 未使用emoji增强可读性")
        
        return score, " ".join(feedback)
    
    def _evaluate_value_proposition(self, content: str) -> Tuple[int, str]:
        """评估价值主张"""
        score = 0
        feedback = []
        
        # 检查量化指标
        has_numbers = bool(re.search(r'\d+%|\d+万|\d+亿|\d+倍', content))
        if has_numbers:
            score += 7
            feedback.append("✅ 包含量化价值指标")
        else:
            feedback.append("❌ 缺少量化价值指标")
            
        # 检查用户痛点描述
        has_pain_points = bool(re.search(r'痛点|问题|困难|挑战', content))
        if has_pain_points:
            score += 7
            feedback.append("✅ 识别用户痛点")
        else:
            feedback.append("❌ 未明确识别用户痛点")
            
        # 检查解决方案清晰度
        has_solution = bool(re.search(r'解决|优化|提升|改善', content))
        if has_solution:
            score += 6
            feedback.append("✅ 提出清晰解决方案")
        else:
            feedback.append("❌ 解决方案描述不清晰")
        
        return score, " ".join(feedback)
    
    def _evaluate_technical_depth(self, content: str) -> Tuple[int, str]:
        """评估技术深度"""
        score = 0
        feedback = []
        
        # 检查技术架构描述
        has_architecture = bool(re.search(r'架构|技术栈|API|数据库', content))
        if has_architecture:
            score += 8
            feedback.append("✅ 包含技术架构描述")
        else:
            feedback.append("❌ 缺少技术架构描述")
            
        # 检查AI模型选择
        has_ai_models = bool(re.search(r'GPT|Claude|LLM|Transformer|深度学习', content))
        if has_ai_models:
            score += 8
            feedback.append("✅ 提到AI模型选择")
        else:
            feedback.append("❌ 未明确AI技术方案")
            
        # 检查实现细节
        has_implementation = bool(re.search(r'实现|开发|部署|集成', content))
        if has_implementation:
            score += 9
            feedback.append("✅ 包含实现细节")
        else:
            feedback.append("❌ 缺少具体实现方案")
        
        return score, " ".join(feedback)
    
    def _evaluate_market_analysis(self, content: str) -> Tuple[int, str]:
        """评估市场分析"""
        score = 0
        feedback = []
        
        # 检查市场规模
        has_market_size = bool(re.search(r'市场|用户数|规模|潜力', content))
        if has_market_size:
            score += 5
            feedback.append("✅ 涉及市场规模分析")
        else:
            feedback.append("❌ 缺少市场规模分析")
            
        # 检查目标用户
        has_target_users = bool(re.search(r'目标用户|用户画像|受众', content))
        if has_target_users:
            score += 5
            feedback.append("✅ 明确目标用户")
        else:
            feedback.append("❌ 目标用户不明确")
            
        # 检查市场机会
        has_opportunity = bool(re.search(r'机会|需求|痛点', content))
        if has_opportunity:
            score += 5
            feedback.append("✅ 识别市场机会")
        else:
            feedback.append("❌ 缺少市场机会分析")
        
        return score, " ".join(feedback)
    
    def _evaluate_business_model(self, content: str) -> Tuple[int, str]:
        """评估商业模式"""
        score = 0
        feedback = []
        
        # 检查盈利模式
        has_revenue = bool(re.search(r'盈利|收费|付费|订阅', content))
        if has_revenue:
            score += 5
            feedback.append("✅ 提出盈利模式")
        else:
            feedback.append("❌ 缺少盈利模式")
            
        # 检查定价策略
        has_pricing = bool(re.search(r'定价|价格|收费', content))
        if has_pricing:
            score += 5
            feedback.append("✅ 包含定价策略")
        else:
            feedback.append("❌ 缺少定价策略")
            
        # 检查成本结构
        has_costs = bool(re.search(r'成本|投入|资源', content))
        if has_costs:
            score += 5
            feedback.append("✅ 考虑成本结构")
        else:
            feedback.append("❌ 未考虑成本结构")
        
        return score, " ".join(feedback)
    
    def _evaluate_feasibility(self, content: str) -> Tuple[int, str]:
        """评估实施可行性"""
        score = 0
        feedback = []
        
        # 检查实施步骤
        has_steps = bool(re.search(r'步骤|阶段|计划', content))
        if has_steps:
            score += 3
            feedback.append("✅ 包含实施步骤")
        else:
            feedback.append("❌ 缺少实施步骤")
            
        # 检查时间规划
        has_timeline = bool(re.search(r'时间|周期|阶段', content))
        if has_timeline:
            score += 3
            feedback.append("✅ 考虑时间规划")
        else:
            feedback.append("❌ 缺少时间规划")
            
        # 检查风险评估
        has_risks = bool(re.search(r'风险|挑战|困难', content))
        if has_risks:
            score += 4
            feedback.append("✅ 评估风险")
        else:
            feedback.append("❌ 缺少风险评估")
        
        return score, " ".join(feedback)
    
    def _get_quality_level(self, total_score: int) -> str:
        """根据总分获取质量等级"""
        if total_score >= 90:
            return "优秀"
        elif total_score >= 75:
            return "良好"
        elif total_score >= 60:
            return "合格"
        elif total_score >= 45:
            return "一般"
        else:
            return "需改进"
    
    def _generate_improvement_suggestions(self, scores: Dict, content: str) -> List[str]:
        """生成改进建议"""
        suggestions = []
        
        # 找出最低分的两个维度
        sorted_scores = sorted(scores.items(), key=lambda x: x[1])
        
        for criterion, score in sorted_scores[:2]:
            if criterion == 'title_clarity':
                suggestions.append("优化标题结构：确保包含目标受众、问题-解决方案结构和emoji标识")
            elif criterion == 'value_proposition':
                suggestions.append("强化价值主张：添加具体量化指标，明确对比现有解决方案的优势")
            elif criterion == 'technical_depth':
                suggestions.append("提升技术深度：详细说明技术架构、AI模型选择和具体实现方案")
            elif criterion == 'market_analysis':
                suggestions.append("完善市场分析：提供市场规模数据，细化目标用户画像")
            elif criterion == 'business_model':
                suggestions.append("构建商业模式：明确盈利模式，制定具体定价策略，分析成本结构")
            elif criterion == 'implementation_feasibility':
                suggestions.append("增强可行性：制定详细实施步骤，规划时间线，识别并缓解风险")
        
        return suggestions

class AIIdeasOptimizer:
    def __init__(self):
        self.evaluator = AIIdeasEvaluator()
        
    def get_current_ideas(self):
        """获取当前仓库中的创意"""
        try:
            # 获取开放issues
            issues_cmd = "gh issue list --repo ava-agent/awesome-ai-ideas --state open --limit 10 --json number,title,body"
            issues_result = subprocess.run(issues_cmd, shell=True, capture_output=True, text=True)
            
            if issues_result.returncode == 0:
                issues = json.loads(issues_result.stdout)
            else:
                issues = []
                
            # 获取已合并的PRs
            prs_cmd = "gh pr list --repo ava-agent/awesome-ai-ideas --state merged --limit 5 --json number,title,body"
            prs_result = subprocess.run(prs_cmd, shell=True, capture_output=True, text=True)
            
            if prs_result.returncode == 0:
                prs = json.loads(prs_result.stdout)
            else:
                prs = []
                
            return issues, prs
            
        except Exception as e:
            print(f"获取创意时出错: {e}")
            return [], []
    
    def analyze_ideas_quality(self):
        """分析创意质量并生成优化建议"""
        issues, prs = self.get_current_ideas()
        
        all_ideas = []
        
        # 分析开放issues
        for issue in issues:
            idea_content = f"{issue.get('title', '')}\n\n{issue.get('body', '')}"
            evaluation = self.evaluator.evaluate_idea(idea_content)
            evaluation['source'] = 'issue'
            evaluation['number'] = issue.get('number')
            evaluation['title'] = issue.get('title')
            all_ideas.append(evaluation)
        
        # 分析已合并PRs
        for pr in prs:
            idea_content = f"{pr.get('title', '')}\n\n{pr.get('body', '')}"
            evaluation = self.evaluator.evaluate_idea(idea_content)
            evaluation['source'] = 'pr'
            evaluation['number'] = pr.get('number')
            evaluation['title'] = pr.get('title')
            all_ideas.append(evaluation)
        
        # 生成优化报告
        report = self.generate_optimization_report(all_ideas)
        
        # 生成具体优化任务
        optimization_tasks = self.generate_optimization_tasks(all_ideas)
        
        return report, optimization_tasks
    
    def generate_optimization_report(self, ideas):
        """生成优化报告"""
        report = []
        report.append("# AI Ideas 创作风格优化报告")
        report.append(f"生成时间：{subprocess.run('date', shell=True, capture_output=True, text=True).stdout.strip()}")
        report.append("")
        
        # 按质量等级分类
        excellent = [r for r in ideas if r['quality_level'] == '优秀']
        good = [r for r in ideas if r['quality_level'] == '良好']
        average = [r for r in ideas if r['quality_level'] == '合格']
        poor = [r for r in ideas if r['quality_level'] in ['一般', '需改进']]
        
        report.append("## 📊 质量分布")
        report.append(f"- 🌟 优秀：{len(excellent)} 个")
        report.append(f"- 👍 良好：{len(good)} 个")
        report.append(f"- 📊 合格：{len(average)} 个")
        report.append(f"- ⚠️ 需改进：{len(poor)} 个")
        report.append("")
        
        # 详细评分
        report.append("## 🔍 详细评分")
        for idea in ideas:
            icon = "🌟" if idea['quality_level'] == '优秀' else "👍" if idea['quality_level'] == '良好' else "📊" if idea['quality_level'] == '合格' else "⚠️"
            report.append(f"{icon} **#{idea['number']}** {idea['title']}")
            report.append(f"   质量：{idea['quality_level']} ({idea['total_score']}/100)")
            
            for criterion, score in idea['scores'].items():
                criterion_name = self.get_criterion_display_name(criterion)
                report.append(f"   - {criterion_name}: {score}/15")
            
            report.append("")
        
        return "\n".join(report)
    
    def generate_optimization_tasks(self, ideas):
        """生成具体的优化任务"""
        tasks = []
        
        # 找出需要改进的创意
        poor_ideas = [r for r in ideas if r['quality_level'] in ['一般', '需改进']]
        
        for idea in poor_ideas:
            task = {
                'target': f"#{idea['number']}",
                'title': idea['title'],
                'improvements': idea['improvement_suggestions'],
                'priority': self.calculate_priority(idea)
            }
            tasks.append(task)
        
        # 按优先级排序
        tasks.sort(key=lambda x: x['priority'], reverse=True)
        
        return tasks
    
    def calculate_priority(self, idea):
        """计算优化优先级"""
        # 基于分数和参与度计算优先级
        base_score = idea['total_score']
        
        # 根据来源调整权重
        source_weight = 1.2 if idea['source'] == 'pr' else 1.0
        
        # 分数越低，优先级越高
        priority = (100 - base_score) * source_weight
        
        return priority
    
    def get_criterion_display_name(self, criterion):
        """获取评分标准显示名称"""
        names = {
            'title_clarity': '标题清晰度',
            'value_proposition': '价值主张',
            'technical_depth': '技术深度',
            'market_analysis': '市场分析',
            'business_model': '商业模式',
            'implementation_feasibility': '实施可行性'
        }
        return names.get(criterion, criterion)
    
    def apply_template_optimization(self, idea_content):
        """应用模板优化建议"""
        suggestions = []
        
        # 检查标题结构
        if not re.search(r'\[for\s+.*\]', idea_content):
            suggestions.append("添加目标受众标识：[for 目标用户]")
        
        if not re.search(r'从.*到.*', idea_content):
            suggestions.append("添加问题-解决方案结构：从[当前痛点]到[理想状态]")
        
        # 检查量化指标
        if not re.search(r'\d+%|\d+万|\d+亿|\d+倍', idea_content):
            suggestions.append("添加量化指标：效率提升XX%，用户数量XX万")
        
        # 检查技术架构
        if not re.search(r'技术|架构|API|数据库', idea_content):
            suggestions.append("补充技术架构：AI模型选择、数据源、部署方案")
        
        # 检查商业模式
        if not re.search(r'盈利|收费|订阅', idea_content):
            suggestions.append("构建商业模式：定价策略、收入来源、成本结构")
        
        return suggestions

def main():
    optimizer = AIIdeasOptimizer()
    
    print("🎨 AI Ideas 创作风格优化分析...")
    print("=" * 50)
    
    # 获取当前创意
    report, tasks = optimizer.analyze_ideas_quality()
    
    # 输出报告
    print(report)
    
    # 输出优化任务
    print("\n" + "=" * 50)
    print("🎯 具体优化任务")
    print("=" * 50)
    
    for i, task in enumerate(tasks, 1):
        print(f"\n### 任务 {i}: {task['target']}")
        print(f"**标题:** {task['title']}")
        print(f"**优先级:** {'🔴 高' if task['priority'] > 50 else '🟡 中' if task['priority'] > 25 else '🟢 低'}")
        print("**改进建议:**")
        for suggestion in task['improvements']:
            print(f"  - {suggestion}")
    
    # 输出模板优化建议
    print("\n" + "=" * 50)
    print("📋 模板化优化建议")
    print("=" * 50)
    
    print("\n### 标准化结构要求:")
    print("1. 标题必须包含：[emoji] [for 目标用户] AI [功能] - 从[问题]到[解决方案]")
    print("2. 内容必须包含：一句话卖点、创意概述、核心功能、技术实现、商业模式")
    print("3. 所有功能点必须有量化指标")
    print("4. 必须包含3个以上的差异化优势")
    print("5. 必须包含风险评估和缓解措施")

if __name__ == "__main__":
    main()