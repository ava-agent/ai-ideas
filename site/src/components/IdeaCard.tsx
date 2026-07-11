import Link from 'next/link';
import type { Idea } from '@/types/idea';

const categoryIcons: Record<string, string> = {
  '教育': '📚', '健康': '🏥', '金融': '💰', '语言': '🗣️', '职业': '💼',
  '创作': '🎨', '开发者工具': '⚙️', '旅行': '✈️', '法律': '⚖️', '家庭': '👨‍👩‍👧', '其他': '📦',
};

const categoryGradients: Record<string, string> = {
  '教育': 'from-blue-500 to-indigo-600',
  '健康': 'from-emerald-500 to-teal-600',
  '金融': 'from-amber-500 to-orange-600',
  '语言': 'from-violet-500 to-purple-600',
  '职业': 'from-sky-500 to-blue-600',
  '创作': 'from-pink-500 to-rose-600',
  '开发者工具': 'from-slate-500 to-gray-700',
  '旅行': 'from-teal-500 to-cyan-600',
  '法律': 'from-orange-500 to-red-600',
  '家庭': 'from-rose-500 to-pink-600',
  '其他': 'from-gray-400 to-gray-600',
};

export default function IdeaCard({ idea }: { idea: Idea }) {
  const icon = categoryIcons[idea.category] || '📦';
  const gradient = categoryGradients[idea.category] || 'from-gray-400 to-gray-600';

  return (
    <Link href={`/ideas/${idea.slug}`} className="block h-full group">
      <div className="idea-card h-full flex flex-col">
        {/* Cover — gradient with light pattern overlay */}
        <div className={`cover-pattern h-32 w-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{icon}</span>
          {idea.overall != null && (
            <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#674DFF] text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {idea.overall} 分
            </span>
          )}
          {/* Subtle corner accent */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3.5 flex flex-col">
          {/* Title */}
          <div className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-1 tracking-tight group-hover:text-[#674DFF] transition-colors">
            {idea.title}
          </div>

          {/* Description */}
          {idea.pitch && (
            <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 mb-3 flex-1">{idea.pitch}</p>
          )}

          {/* Tags */}
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="tag-purple">{idea.category}</span>
              {idea.tier === 1 && <span className="tier-1">T1</span>}
              {idea.tier === 2 && <span className="tier-2">T2</span>}
            </div>
            <svg className="text-gray-300 group-hover:text-[#674DFF] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
