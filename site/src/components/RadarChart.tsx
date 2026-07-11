'use client';

import type { IdeaScores } from '@/types/idea';

interface ScoreRadarProps {
  scores: IdeaScores;
  size?: number;
}

const labelMap: Record<string, string> = {
  marketSize: '市场',
  painPoint: '痛点',
  viral: '爆款',
  techFeasibility: '技术',
  differentiation: '差异',
  monetization: '变现',
};

export default function ScoreRadar({ scores, size = 200 }: ScoreRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;

  const keys = Object.keys(labelMap);
  const points = keys.map((key, i) => {
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    const val = (scores[key] || 0) / 10;
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
    };
  });

  const gridPoints = (level: number) =>
    keys.map((_, i) => {
      const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
      return { x: cx + r * level * Math.cos(angle), y: cy + r * level * Math.sin(angle) };
    });

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#674DFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#674DFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8, 1].map((level) => (
        <path key={level} d={toPath(gridPoints(level))} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
      ))}
      {keys.map((_, i) => {
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#f3f4f6" strokeWidth="0.5" />
        );
      })}
      <path d={toPath(points)} fill="url(#radarGrad)" stroke="#674DFF" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#674DFF" />
      ))}
      {keys.map((key, i) => {
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        const lx = cx + (r + 20) * Math.cos(angle);
        const ly = cy + (r + 20) * Math.sin(angle);
        return (
          <text key={key} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-xs" fill="#6b7280">
            {labelMap[key]}
          </text>
        );
      })}
    </svg>
  );
}
