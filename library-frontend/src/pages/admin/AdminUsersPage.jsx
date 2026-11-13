import { useMemo, useState } from 'react';
import { ShieldCheck, User, Users } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/adminService';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/books/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/StateViews';
import { formatDate } from '../../utils/format';

export default function AdminUsersPage() {
  useDocumentTitle('Quản lý người dùng');
  const toast = useToast();
  const { user: me } = useAuth();
  const { data, loading, error, reload } = useAsync(() => adminService.users(), []);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((u) => !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [data, search]);

  const nextRole = target?.role === 'ADMIN' ? 'USER' : 'ADMIN';

  const changeRole = async () => {
    setWorking(true);
    try {
      await adminService.updateUserRole(target.id, nextRole);
      toast.success(`${target.fullName} giờ là ${nextRole === 'ADMIN' ? 'Quản trị viên' : 'Bạn đọc'}.`);
      setConfirmOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWorking(false);
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'Người dùng',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-100 font-semibold text-navy-700">{(u.fullName || u.email).charAt(0).toUpperCase()}</span>
          <div className="min-w-0">
            <p className="truncate font-medium text-navy-950">
              {u.fullName || '—'} {u.id === me?.id && <span className="text-xs font-normal text-navy-400">(bạn)</span>}
            </p>
            <p className="truncate text-xs text-navy-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Quyền',
      render: (u) =>
        u.role === 'ADMIN' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-1 text-xs font-medium text-white">
            <ShieldCheck className="size-3.5" aria-hidden /> Quản trị
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600 ring-1 ring-navy-200 ring-inset">
            <User className="size-3.5" aria-hidden /> Bạn đọc
          </span>
        ),
    },
    { key: 'createdAt', header: 'Ngày tham gia', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (u) =>
        u.id === me?.id ? null : (
          <button
            type="button"
            onClick={() => {
              setTarget(u);
              setConfirmOpen(true);
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            {u.role === 'ADMIN' ? 'Hạ xuống Bạn đọc' : 'Cấp quyền Quản trị'}
          </button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Người dùng" description={data ? `${data.length} tài khoản` : undefined} />
      <div className="card">
        <div className="border-b border-navy-100 p-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên hoặc email..." className="max-w-md" />
        </div>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState icon={Users} title="Không tìm thấy người dùng" />
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={changeRole}
        loading={working}
        tone={nextRole === 'ADMIN' ? 'accent' : 'danger'}
        title="Đổi quyền người dùng"
        confirmText="Xác nhận"
        message={target ? `Đổi quyền của ${target.fullName} (${target.email}) thành ${nextRole === 'ADMIN' ? 'Quản trị viên' : 'Bạn đọc'}?` : ''}
      />
    </div>
  );
}
