#!/usr/bin/env python3
"""
AI Ideas 质量评估和优化工具
分析现有创意并提供改进建议
"""

import re
import json
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
    
    def batch_evaluate(self, ideas: List[str]) -> List[Dict]:
        """批量评估多个创意"""
        results = []
        for i, idea in enumerate(ideas):
            result = self.evaluate_idea(idea)
            result['idea_id'] = i + 1
            results.append(result)
        
        return results
    
    def generate_optimization_report(self, results: List[Dict]) -> str:
        """生成优化报告"""
        report = []
        report.append("## AI Ideas 质量评估报告")
        report.append(f"评估时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"评估数量：{len(results)}")
        report.append("")
        
        # 按质量等级分类
        excellent = [r for r in results if r['quality_level'] == '优秀']
        good = [r for r in results if r['quality_level'] == '良好']
        average = [r for r in results if r['quality_level'] == '合格']
        poor = [r for r in results if r['quality_level'] in ['一般', '需改进']]
        
        report.append("### 质量分布")
        report.append(f"🌟 优秀：{len(excellent)} 个")
        report.append(f"👍 良好：{len(good)} 个")
        report.append(f"📊 合格：{len(average)} 个")
        report.append(f"⚠️ 需改进：{len(poor)} 个")
        report.append("")
        
        # 总体平均分
        avg_score = sum(r['total_score'] for r in results) / len(results)
        report.append(f"### 平均分数：{avg_score:.1f} 分")
        report.append("")
        
        # 改进建议
        if poor:
            report.append("### 重点改进建议")
            for result in poor:
                report.append(f"**创意 #{result['idea_id']}**：")
                for suggestion in result['improvement_suggestions']:
                    report.append(f"  - {suggestion}")
                report.append("")
        
        return "\n".join(report)

if __name__ == "__main__":
    # 使用示例
    evaluator = AIIdeasEvaluator()
    
    # 示例创意内容
    sample_idea = """
    💡 [for 外卖骑手] AI 路径优化大脑 - 从随机抢单疲劳奔波到智能规划收入最大化
    
    创意概述
    为外卖骑手打造一个基于 AI 的路径优化和收入提升系统，解决传统配送工作中的随机性和低效性问题。
    
    核心功能
    🎯 智能抢单系统
    热力图预测: 基于历史订单数据、天气、时段预测热门区域
    订单价值评估: 综合距离、配送费、高峰溢价、评价等级进行订单排序
    时间窗口优化: 智能组合短途、长途订单，减少空驶率
    
    🗺️ 动态路径优化
    实时路况整合: 接入交通数据、事故信息、施工路段
    多订单路径规划: 将多个订单配送路线进行最优组合
    充电/补给点推荐: 根据电量、体力状况智能推荐休息点
    
    💰 收入提升策略
    收益目标设定: 根据骑手目标、能力制定个性化收入计划
    峰值时段激励: 识别高收入时间段，推送精准抢单提醒
    成本优化建议: 油耗、电动车充电成本分析优化
    
    技术实现
    数据源
    平台订单历史数据
    第三方交通数据 API
    天气、事件信息聚合
    用户行为模式分析
    
    AI 能力
    预测模型: LSTM 网络预测订单密度和最优路径
    强化学习: 自适应优化策略，持续学习骑手偏好
    图神经网络: 处理复杂路径优化问题
    
    商业模式
    骑手端
    基础功能免费
    高级分析功能订阅制
    智能路线建议按次付费
    
    平台端
    为外卖平台提供骑手优化服务
    数据分析洞察服务
    运营效率提升合作
    
    市场前景
    目标用户
    全国 700 万+ 外卖骑手
    同城货运司机
    快递员
    
    扩展应用
    城市物流优化
    最后一公里配送效率提升
    共享经济从业者效率工具
    """
    
    # 评估创意
    result = evaluator.evaluate_idea(sample_idea)
    print("评估结果：")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    # 生成优化建议
    suggestions = result['improvement_suggestions']
    print("\n改进建议：")
    for suggestion in suggestions:
        print(f"- {suggestion}")