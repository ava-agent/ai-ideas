import Link from 'next/link';
import data from '@/data/ideas.json';
import type { IdeasData, ScoredIdea } from '@/types/idea';

const scoreLabels: Record<string, string> = {
  marketSize: '市场',
  painPoint: '痛点',
  viral: '爆款',
  techFeasibility: '技术',
  differentiation: '差异',
  monetization: '变现',
};

const categoryIcons: Record<string, string> = {
  '教育': '📚', '健康': '🏥', '金融': '💰', '语言': '🗣️', '职业': '💼',
  '创作': '🎨', '开发者工具': '⚙️', '旅行': '✈️', '法律': '⚖️', '家庭': '👨‍👩‍👧', '其他': '📦',
};
const ideasData = data as IdeasData;

export default function LeaderboardPage() {
  const scored: ScoredIdea[] = ideasData.ideas.filter((idea): idea is ScoredIdea => idea.overall != null);

  const topByCategory: Record<string, ScoredIdea> = {};
  for (const idea of scored) {
    if (!topByCategory[idea.category] || (idea.overall ?? 0) > (topByCategory[idea.category].overall ?? 0)) {
      topByCategory[idea.category] = idea;
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">排行榜</h1>
        <p className="text-gray-500 text-base">
          基于 7 维度评分公式 ·{' '}
          <code className="text-[#674DFF] bg-[#F4F2FF] px-2.5 py-1 rounded-md text-xs font-medium">
            (市场 + 痛点 + 爆款×1.5 + 技术 + 差异 + 变现) × 10 / 6.5 − 执行难度 × 2
          </code>
        </p>
      </div>

      {/* Score distribution */}
      {scored.length > 0 && (
        <div className="rounded-2xl p-6 bg-white border border-gray-200 mb-8">
          <h2 className="font-semibold text-gray-900 text-sm mb-5">评分分布</h2>
          <div className="flex items-end gap-2 h-32">
            {(() => {
              const buckets = [0, 0, 0, 0, 0, 0, 0, 0];
              const labels = ['<40', '40-45', '45-50', '50-55', '55-60', '60-65', '65-70', '70+'];
              for (const idea of scored) {
                const s = idea.overall ?? 0;
                if (s < 40) buckets[0]++;
                else if (s < 45) buckets[1]++;
                else if (s < 50) buckets[2]++;
                else if (s < 55) buckets[3]++;
                else if (s < 60) buckets[4]++;
                else if (s < 65) buckets[5]++;
                else if (s < 70) buckets[6]++;
                else buckets[7]++;
              }
              const max = Math.max(...buckets, 1);
              return buckets.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-xs text-[#674DFF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                  <div
                    className="histogram-bar w-full"
                    style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                  />
                  <span className="text-[11px] text-gray-400">{labels[i]}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Ranking table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 mb-8">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">完整排名</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="rank-table w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">创意名称</th>
                <th className="px-4 py-3 text-left">分类</th>
                <th className="px-4 py-3 text-center">总分</th>
                {Object.values(scoreLabels).map((l) => (
                  <th key={l} className="px-3 py-3 text-center hidden sm:table-cell">{l}</th>
                ))}
                <th className="px-3 py-3 text-center hidden md:table-cell">执行</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((idea, idx) => (
                <tr key={idea.id}>
                  <td className="px-4 py-3">
                    {idx < 3 ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0 ? 'medal-gold' : idx === 1 ? 'medal-silver' : 'medal-bronze'
                      }`}>
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">{idx + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/ideas/${idea.slug}`} className="text-gray-900 hover:text-[#674DFF] font-medium transition-colors">
                      {idea.title}
                    </Link>
                    {idea.verdict && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{idea.verdict}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="tag-purple">
                      {categoryIcons[idea.category] || ''} {idea.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-[#674DFF]">{idea.overall}</span>
                  </td>
                  {Object.keys(scoreLabels).map((key) => (
                    <td key={key} className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className={
                        (idea.scores?.[key] || 0) >= 8 ? 'score-high' :
                        (idea.scores?.[key] || 0) >= 5 ? 'score-mid' : 'score-low'
                      }>
                        {idea.scores?.[key] ?? '-'}
                      </span>
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span className={
                      (idea.scores?.executionDifficulty || 0) <= 4 ? 'score-high' :
                      (idea.scores?.executionDifficulty || 0) <= 6 ? 'score-mid' : 'score-low'
                    }>
                      {idea.scores?.executionDifficulty ?? '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category champions */}
      {Object.keys(topByCategory).length > 0 && (
        <div className="rounded-2xl p-6 bg-white border border-gray-200">
          <h2 className="font-semibold text-gray-900 text-sm mb-5">各赛道冠军</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(topByCategory).map(([cat, idea]) => (
              <Link
                key={cat}
                href={`/ideas/${idea.slug}`}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-[#C7C0FF] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F4F2FF] flex items-center justify-center text-lg">
                  {categoryIcons[cat] || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{idea.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat} · <span className="text-[#674DFF] font-semibold">{idea.overall}</span> 分</p>
                </div>
                <svg className="text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
