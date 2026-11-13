import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookCopy, BookOpenCheck, ClipboardList, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useAsync from '../../hooks/useAsync';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/adminService';
import { borrowingService } from '../../services/borrowingService';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/StateViews';
import { formatDate } from '../../utils/format';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--color-navy-100)',
  boxShadow: '0 8px 24px -8px rgb(15 31 61 / 0.2)',
  fontSize: 13,
};

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold text-navy-950">{title}</h2>
      {subtitle && <p className="text-xs text-navy-500">{subtitle}</p>}
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  useDocumentTitle('Tổng quan quản trị');
  const stats = useAsync(() => adminService.stats(), []);
  const pending = useAsync(() => borrowingService.all({ status: 'PENDING' }), []);
  const s = stats.data;

  return (
    <div>
      <PageHeader title="Tổng quan" description="Tình hình hoạt động của thư viện." />

      {stats.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] rounded-2xl" />
          ))}
        </div>
      ) : stats.error ? (
        <div className="card">
          <ErrorState error={stats.error} onRetry={stats.reload} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BookCopy} label="Tổng số sách" value={s.totalBooks} hint={`${s.totalTitles} đầu sách · ${s.totalCategories} thể loại`} tone="navy" />
            <StatCard icon={Users} label="Người dùng" value={s.totalUsers} tone="blue" />
            <StatCard icon={BookOpenCheck} label="Sách đang được mượn" value={s.borrowedBooks} tone="green" />
            <StatCard icon={ClipboardList} label="Phiếu chờ duyệt" value={s.pendingBorrowings} tone="amber" />
          </div>

          {s.overdueBorrowings > 0 && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center">
              <AlertTriangle className="size-5 shrink-0" aria-hidden />
              <p className="flex-1">
                Có <strong>{s.overdueBorrowings}</strong> phiếu mượn đã quá hạn trả.
              </p>
              <Link to="/admin/borrowings?status=APPROVED" className="font-semibold underline-offset-2 hover:underline">
                Xem phiếu mượn
              </Link>
            </div>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ChartCard title="Lượt mượn theo tháng" subtitle="6 tháng gần nhất">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.byMonth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e9f5" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6a85bc', fontSize: 12 }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#6a85bc', fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Phiếu mượn']} />
                  <Line type="monotone" dataKey="borrowings" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: '#2563eb' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Số lượng sách theo thể loại" subtitle="Tổng số cuốn trong kho">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.byCategory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e9f5" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6a85bc', fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#6a85bc', fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f2f5fb' }} formatter={(v) => [v, 'Cuốn']} />
                  <Bar dataKey="books" fill="#1d2e52" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}

      <div className="card mt-6">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h2 className="font-semibold text-navy-950">Yêu cầu mượn chờ duyệt</h2>
          <Link to="/admin/borrowings" className="group flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
            Xử lý <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        {pending.loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : pending.error ? (
          <ErrorState error={pending.error} onRetry={pending.reload} />
        ) : pending.data.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Không có yêu cầu nào đang chờ" />
        ) : (
          <ul className="divide-y divide-navy-100">
            {pending.data.slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-100 font-semibold text-navy-700">
                  {b.userName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy-900">{b.userName}</p>
                  <p className="truncate text-xs text-navy-500">{b.items.map((i) => i.title).join(', ')}</p>
                </div>
                <span className="hidden text-xs text-navy-500 sm:block">{formatDate(b.createdAt)}</span>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
