export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatNumber(n) {
  return new Intl.NumberFormat('vi-VN').format(n ?? 0);
}

/** Số ngày còn lại tới hạn trả (âm = quá hạn) */
export function daysUntil(value) {
  if (!value) return null;
  const ms = new Date(value).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

export const BORROWING_STATUS = {
  PENDING: { label: 'Chờ duyệt', tone: 'amber' },
  APPROVED: { label: 'Đang mượn', tone: 'blue' },
  REJECTED: { label: 'Bị từ chối', tone: 'red' },
  RETURNED: { label: 'Đã trả', tone: 'green' },
};

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
