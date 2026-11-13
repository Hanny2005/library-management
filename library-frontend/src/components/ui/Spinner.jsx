import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Đang tải...', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-2 py-10 text-sm text-navy-500 ${className}`}>
      <Loader2 className="size-5 animate-spin text-brand-600" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <Spinner label="Đang khởi động thư viện..." />
    </div>
  );
}
