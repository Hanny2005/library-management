import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  tone = 'danger',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button variant={tone} onClick={onConfirm} loading={loading} data-autofocus>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className={`grid size-10 shrink-0 place-items-center rounded-full ${tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
          <AlertTriangle className="size-5" aria-hidden />
        </div>
        <p className="pt-2 text-sm text-navy-600">{message}</p>
      </div>
    </Modal>
  );
}
