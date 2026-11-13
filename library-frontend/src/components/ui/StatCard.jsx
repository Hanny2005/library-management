import { formatNumber } from '../../utils/format';

const TONES = {
  navy: 'bg-navy-900 text-white',
  blue: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'blue' }) {
  return (
    <div className="card flex items-center gap-4 p-4 sm:p-5">
      <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}>
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-navy-950 tabular-nums">{formatNumber(value)}</p>
        <p className="truncate text-sm text-navy-500">{label}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-navy-400">{hint}</p>}
      </div>
    </div>
  );
}
