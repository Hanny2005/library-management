import { AlertTriangle, BookX, RotateCcw } from 'lucide-react';
import Button from './Button';

export function EmptyState({ icon: Icon = BookX, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-400">
        <Icon className="size-7" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-navy-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center" role="alert">
      <div className="grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="size-7" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-navy-900">Không tải được dữ liệu</h3>
      <p className="mt-1 max-w-sm text-sm text-navy-500">{error?.message || 'Đã có lỗi xảy ra.'}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCcw} className="mt-5" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
