import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScoreBar from '@/components/ScoreBar';
import ScoreRadar from '@/components/RadarChart';
import data from '@/data/ideas.json';
import contentMap from '@/data/content-map.json';
import type { IdeaScores, IdeasData } from '@/types/idea';

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
const ideasData = data as IdeasData;

function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr />')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[1-3]|<blockquote|<pre|<hr|<ul|<ol|<table|<div)/g, '$1');
  html = html.replace(/(<\/h[1-3]>|<\/blockquote>|<\/pre>|<hr \/>|<\/ul>|<\/ol>|<\/table>|<\/div>)\s*<\/p>/g, '$1');
  return html;
}

export function generateStaticParams() {
  return ideasData.ideas.map((idea) => ({ slug: idea.slug }));
}

export default async function IdeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idea = ideasData.ideas.find((i) => i.slug === slug);
  if (!idea) notFound();

  const contentData = (contentMap as Record<string, { content: string }>)[slug];
  const htmlContent = contentData?.content ? markdownToHtml(contentData.content) : '<p>内容加载失败</p>';

  const icon = categoryIcons[idea.category] || '📦';
  const gradient = categoryGradients[idea.category] || 'from-gray-400 to-gray-600';

  const scoreLabels: Record<keyof IdeaScores, string> = {
    marketSize: '市场规模',
    painPoint: '痛点强度',
    viral: '爆款潜力',
    techFeasibility: '技术可行性',
    differentiation: '差异化',
    monetization: '变现能力',
    executionDifficulty: '执行难度',
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/ideas" className="hover:text-[#674DFF] transition-colors">创意库</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        <span className="text-gray-500">{idea.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cover */}
          <div className={`cover-pattern h-40 w-full bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-8`}>
            <span className="text-6xl drop-shadow-sm">{icon}</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="tag-purple">{idea.category}</span>
              {idea.tier === 1 && <span className="tier-1">Tier 1</span>}
              {idea.tier === 2 && <span className="tier-2">Tier 2</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">{idea.title}</h1>
            {idea.pitch && (
              <p className="text-base text-gray-500 leading-relaxed">{idea.pitch}</p>
            )}
          </div>

          <div
            className="prose max-w-none rounded-2xl p-6 sm:p-8 bg-white border border-gray-200"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {idea.scores && (
            <div className="rounded-2xl p-5 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 text-sm">综合评分</h3>
                <span className="text-3xl font-bold tracking-tight" style={{ color: '#674DFF' }}>{idea.overall}</span>
              </div>
              <div className="flex justify-center mb-5">
                <ScoreRadar scores={idea.scores} size={200} />
              </div>
              <div className="space-y-2.5">
                {Object.entries(scoreLabels).map(([key, label]) => {
                  const val = idea.scores?.[key];
                  if (val == null) return null;
                  return <ScoreBar key={key} label={label} value={val} />;
                })}
              </div>
            </div>
          )}

          {idea.verdict && (
            <div className="rounded-2xl p-5 bg-[#F4F2FF] border border-[#D8D1FF]">
              <h3 className="font-semibold text-[#2D14B8] text-sm mb-2">一句话判断</h3>
              <p className="text-sm text-[#3D20B8] leading-relaxed">{idea.verdict}</p>
            </div>
          )}

          <div className="rounded-2xl p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">元信息</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">来源目录</dt>
                <dd className="text-gray-600 font-medium">{idea.sourceDir}/</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">文件路径</dt>
                <dd className="text-gray-400 text-xs font-mono max-w-[200px] truncate">{idea.filePath}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
