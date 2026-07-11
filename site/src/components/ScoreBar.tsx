export default function ScoreBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = value >= 8
    ? 'bg-emerald-500'
    : value >= 6
    ? 'bg-[#674DFF]'
    : value >= 4
    ? 'bg-amber-500'
    : 'bg-red-400';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-16 text-right shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`bar-fill h-1.5 rounded-full ${color}`}
          style={{ '--bar-width': `${pct}%` } as React.CSSProperties}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-6 text-center">{value}</span>
    </div>
  );
}
