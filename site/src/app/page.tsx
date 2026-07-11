import fs from 'fs';
import path from 'path';
import IdeaCard from '@/components/IdeaCard';
import Link from 'next/link';
import type { Idea, IdeasData } from '@/types/idea';

function getData(): IdeasData {
  const dataPath = path.join(process.cwd(), 'src/data/ideas.json');
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as IdeasData;
}

const categoryIcons: Record<string, string> = {
  '教育': '📚', '健康': '🏥', '金融': '💰', '语言': '🗣️', '职业': '💼',
  '创作': '🎨', '开发者工具': '⚙️', '旅行': '✈️', '法律': '⚖️', '家庭': '👨‍👩‍👧', '其他': '📦',
};

export default function Home() {
  const data = getData();
  const tier1 = data.tier1.slice(0, 8);
  const topIdea = data.tier1[0];

  return (
    <div>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F2FF] border border-[#D8D1FF] text-[#2D14B8] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#674DFF] animate-pulse" />
              {data.totalIdeas} 个 AI 创意 · {data.scoredIdeas} 个已深度评估
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
              精选最好的
              <br />
              <span className="gradient-text">AI 产品创意</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              经过 7 维度深度评估的 AI 创意库，涵盖教育、健康、金融、创作等多个赛道，助你找到下一个创业方向。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ideas"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-[#674DFF] hover:bg-[#5B42E6] transition-colors shadow-sm shadow-[#674DFF]/20"
              >
                浏览创意库
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                查看排行榜
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="pb-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">分类</span>
            {data.categories.map((cat: string) => (
              <Link
                key={cat}
                href={`/ideas?category=${encodeURIComponent(cat)}`}
                className="filter-pill text-[13px]"
              >
                {categoryIcons[cat] || '📦'} {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured idea — if available */}
      {topIdea && (
        <section className="pb-12">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <Link href={`/ideas/${topIdea.slug}`} className="block group">
              <div className="rounded-2xl border border-gray-200 overflow-hidden hover:border-[#C7C0FF] hover:shadow-lg hover:shadow-[#674DFF]/5 transition-all duration-300">
                <div className="grid md:grid-cols-2">
                  {/* Cover */}
                  <div className="cover-pattern h-48 md:h-auto bg-gradient-to-br from-[#674DFF] to-[#8B73FF] flex items-center justify-center">
                    <span className="text-7xl drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                      {categoryIcons[topIdea.category] || '💡'}
                    </span>
                    {topIdea.overall && (
                      <span className="absolute top-4 right-4 bg-white/95 text-[#674DFF] text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                        {topIdea.overall} 分
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="tier-1">Top 1</span>
                      <span className="tag-purple">{topIdea.category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2 group-hover:text-[#674DFF] transition-colors">
                      {topIdea.title}
                    </h2>
                    {topIdea.pitch && (
                      <p className="text-gray-500 leading-relaxed mb-4">{topIdea.pitch}</p>
                    )}
                    {topIdea.verdict && (
                      <p className="text-sm text-[#2D14B8] bg-[#F4F2FF] rounded-lg px-4 py-2.5">{topIdea.verdict}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Top Ideas grid */}
      <section className="pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Top 创意</h2>
            <Link href="/ideas" className="text-sm text-[#674DFF] hover:text-[#5035E0] font-semibold transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(topIdea ? tier1.slice(1) : tier1).map((idea: Idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{data.totalIdeas}</div>
              <div className="text-sm text-gray-400 mt-1">创意总数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#674DFF] tracking-tight">{data.scoredIdeas}</div>
              <div className="text-sm text-gray-400 mt-1">已评分</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{data.categories.length}</div>
              <div className="text-sm text-gray-400 mt-1">覆盖赛道</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">7</div>
              <div className="text-sm text-gray-400 mt-1">评估维度</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
