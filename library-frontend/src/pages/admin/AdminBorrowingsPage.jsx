import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ClipboardList, Eye, RotateCcw, X } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useToast } from '../../context/ToastContext';
import { borrowingService } from '../../services/borrowingService';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import BorrowingDetail from '../../components/books/BorrowingDetail';
import Modal from '../../components/ui/Modal';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/StateViews';
import { daysUntil, formatDate } from '../../utils/format';

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đang mượn' },
  { value: 'RETURNED', label: 'Đã trả' },
  { value: 'REJECTED', label: 'Từ chối' },
];

const ACTIONS = {
  approve: {
    title: 'Duyệt phiếu mượn',
    confirmText: 'Duyệt',
    tone: 'success',
    message: (b) => `Duyệt phiếu #${b.id} của ${b.userName}? Số lượng sách còn lại sẽ được trừ tương ứng.`,
    run: (id) => borrowingService.approve(id),
    success: (b) => `Đã duyệt phiếu #${b.id}.`,
  },
  reject: {
    title: 'Từ chối phiếu mượn',
    confirmText: 'Từ chối',
    tone: 'danger',
    message: (b) => `Từ chối phiếu #${b.id} của ${b.userName}?`,
    run: (id) => borrowingService.reject(id),
    success: (b) => `Đã từ chối phiếu #${b.id}.`,
  },
  return: {
    title: 'Xác nhận trả sách',
    confirmText: 'Xác nhận đã trả',
    tone: 'accent',
    message: (b) => `Xác nhận ${b.userName} đã trả đủ sách của phiếu #${b.id}? Số lượng sách sẽ được cộng lại vào kho.`,
    run: (id) => borrowingService.markReturned(id),
    success: (b) => `Phiếu #${b.id} đã được đánh dấu trả.`,
  },
};

export default function AdminBorrowingsPage() {
  useDocumentTitle('Quản lý phiếu mượn');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  // Tải toàn bộ một lần để đếm theo tab; lọc phía client
  const { data, loading, error, reload } = useAsync(() => borrowingService.all(), []);

  const [detail, setDetail] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pending, setPending] = useState(null); // { action, borrowing }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const counts = useMemo(() => {
    const c = { '': data?.length ?? 0 };
    (data ?? []).forEach((b) => (c[b.status] = (c[b.status] ?? 0) + 1));
    return c;
  }, [data]);

  const rows = useMemo(() => (data ?? []).filter((b) => !status || b.status === status), [data, status]);

  const ask = (action, borrowing) => {
    setPending({ action, borrowing });
    setConfirmOpen(true);
  };

  const runAction = async () => {
    const { action, borrowing } = pending;
    setWorking(true);
    try {
      await ACTIONS[action].run(borrowing.id);
      toast.success(ACTIONS[action].success(borrowing));
      setConfirmOpen(false);
      setDetailOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message, 'Thao tác thất bại');
      reload();
    } finally {
      setWorking(false);
    }
  };

  const actionButtons = (b, withView = true) => (
    <div className="flex justify-end gap-1.5">
      {withView && (
      <button
        type="button"
        onClick={() => {
          setDetail(b);
          setDetailOpen(true);
        }}
        className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-navy-100 hover:text-navy-900"
        aria-label={`Xem phiếu #${b.id}`}
        title="Xem chi tiết"
      >
        <Eye className="size-4" />
      </button>
      )}
      {b.status === 'PENDING' && (
        <>
          <Button size="sm" variant="success" icon={Check} onClick={() => ask('approve', b)}>
            Duyệt
          </Button>
          <Button size="sm" variant="secondary" icon={X} onClick={() => ask('reject', b)}>
            Từ chối
          </Button>
        </>
      )}
      {b.status === 'APPROVED' && (
        <Button size="sm" variant="accent" icon={RotateCcw} onClick={() => ask('return', b)}>
          Đã trả
        </Button>
      )}
    </div>
  );

  const columns = [
    { key: 'id', header: 'Mã', render: (b) => <span className="font-medium text-navy-900">#{b.id}</span> },
    {
      key: 'user',
      header: 'Người mượn',
      render: (b) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy-900">{b.userName}</p>
          <p className="truncate text-xs text-navy-500">{b.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'books',
      header: 'Sách',
      render: (b) => (
        <span className="line-clamp-2 max-w-60">
          {b.items.map((i) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Ngày gửi', render: (b) => <span className="whitespace-nowrap">{formatDate(b.createdAt)}</span> },
    {
      key: 'dueDate',
      header: 'Hạn trả',
      render: (b) => {
        const overdue = b.status === 'APPROVED' && daysUntil(b.dueDate) < 0;
        return <span className={`whitespace-nowrap ${overdue ? 'font-semibold text-red-600' : ''}`}>{formatDate(b.dueDate)}</span>;
      },
    },
    { key: 'status', header: 'Trạng thái', render: (b) => <StatusBadge status={b.status} overdue={b.status === 'APPROVED' && daysUntil(b.dueDate) < 0} /> },
    { key: 'actions', header: '', className: 'text-right', render: actionButtons },
  ];

  const pendingMeta = pending ? ACTIONS[pending.action] : null;

  return (
    <div>
      <PageHeader title="Phiếu mượn" description="Duyệt, từ chối và xác nhận trả sách." />

      <div className="card">
        <div className="border-b border-navy-100 p-3 sm:p-4">
          <Tabs
            tabs={STATUS_TABS.map((t) => ({ ...t, count: data ? counts[t.value] ?? 0 : undefined }))}
            value={status}
            onChange={(v) => setParams(v ? { status: v } : {}, { replace: true })}
            layoutId="admin-borrowing-tab"
          />
        </div>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Không có phiếu mượn nào" />
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </div>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Chi tiết phiếu mượn"
        footer={detail && (detail.status === 'PENDING' || detail.status === 'APPROVED') ? actionButtons(detail, false) : undefined}
      >
        {detail && <BorrowingDetail borrowing={detail} showUser />}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={runAction}
        loading={working}
        title={pendingMeta?.title}
        confirmText={pendingMeta?.confirmText}
        tone={pendingMeta?.tone}
        message={pending ? pendingMeta.message(pending.borrowing) : ''}
      />
    </div>
  );
}
