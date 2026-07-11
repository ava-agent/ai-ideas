'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import IdeaCard from '@/components/IdeaCard';
import data from '@/data/ideas.json';
import type { Idea, IdeasData } from '@/types/idea';

const categoryIcons: Record<string, string> = {
  '教育': '📚', '健康': '🏥', '金融': '💰', '语言': '🗣️', '职业': '💼',
  '创作': '🎨', '开发者工具': '⚙️', '旅行': '✈️', '法律': '⚖️', '家庭': '👨‍👩‍👧', '其他': '📦',
};

type SortKey = 'overall' | 'title' | 'category';
const ideasData = data as IdeasData;

function IdeasContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [tier, setTier] = useState('all');
  const [sort, setSort] = useState<SortKey>('overall');

  const filtered = useMemo(() => {
    let list: Idea[] = ideasData.ideas;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.pitch && i.pitch.toLowerCase().includes(q)) ||
          (i.verdict && i.verdict.toLowerCase().includes(q))
      );
    }
    if (category !== 'all') list = list.filter((i) => i.category === category);
    if (tier !== 'all') list = list.filter((i) => i.tier === parseInt(tier, 10));

    if (sort === 'overall') {
      list = [...list].sort((a, b) => (b.overall ?? -1) - (a.overall ?? -1));
    } else if (sort === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'zh'));
    } else {
      list = [...list].sort((a, b) => a.category.localeCompare(b.category, 'zh'));
    }
    return list;
  }, [search, category, tier, sort]);

  return (
    <>
      {/* Category pills */}
      <div className="scroll-pills mb-8">
        <button
          onClick={() => setCategory('all')}
          className={`filter-pill ${category === 'all' ? 'filter-pill-active' : ''}`}
        >
          全部
        </button>
        {ideasData.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? 'all' : cat)}
            className={`filter-pill ${category === cat ? 'filter-pill-active' : ''}`}
          >
            {categoryIcons[cat] || '📦'} {cat}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="搜索创意名称、卖点、评价..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box w-full pl-10 pr-4 py-2.5"
          />
        </div>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="filter-select px-4 py-2.5">
          <option value="all">所有层级</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="0">未分级</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="filter-select px-4 py-2.5">
          <option value="overall">按评分</option>
          <option value="title">按名称</option>
          <option value="category">按分类</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-400 mb-5">
        共 <span className="text-gray-700 font-semibold">{filtered.length}</span> 个结果
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 opacity-20">🔍</div>
          <p className="text-gray-400 text-sm">没有找到匹配的创意</p>
        </div>
      )}
    </>
  );
}

export default function IdeasPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">AI 创意库</h1>
        <p className="text-gray-500 text-base">
          精选最好的 AI 产品创意 — 共 {ideasData.totalIdeas} 个，{ideasData.scoredIdeas} 个已评分
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-gray-400 text-center py-10">加载中...</div>}>
        <IdeasContent />
      </Suspense>
    </div>
  );
}
