import { BORROWING_STATUS } from '../../utils/format';

const TONE_CLASS = {
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  blue: 'bg-brand-50 text-brand-700 ring-brand-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  slate: 'bg-navy-50 text-navy-600 ring-navy-200',
};

export default function StatusBadge({ status, overdue = false }) {
  const meta = overdue ? { label: 'Quá hạn', tone: 'red' } : BORROWING_STATUS[status] ?? { label: status, tone: 'slate' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[meta.tone]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {meta.label}
    </span>
  );
}

export function AvailabilityBadge({ available, total }) {
  if (available <= 0) {
    return <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200 ring-inset">Hết sách</span>;
  }
  const low = available <= 2;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        low ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      }`}
    >
      Còn {available}
      {total ? `/${total}` : ''}
    </span>
  );
}
