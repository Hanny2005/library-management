import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookMarked, CalendarClock, ChevronRight, Clock, History, Library } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { borrowingService } from '../services/borrowingService';
import BookCover from '../components/books/BookCover';
import BorrowingDetail from '../components/books/BorrowingDetail';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/StateViews';
import { motionScale, motionTokens } from '../components/motion/tokens';
import { daysUntil, formatDate } from '../utils/format';

const TABS = [
  { value: 'active', label: 'Đang mượn', match: (b) => b.status === 'APPROVED' },
  { value: 'pending', label: 'Chờ duyệt', match: (b) => b.status === 'PENDING' },
  { value: 'history', label: 'Lịch sử', match: (b) => ['RETURNED', 'REJECTED'].includes(b.status) },
];

function BorrowingRow({ borrowing, onOpen }) {
  const first = borrowing.items[0];
  const left = daysUntil(borrowing.dueDate);
  const overdue = borrowing.status === 'APPROVED' && left !== null && left < 0;
  const totalBooks = borrowing.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(borrowing)}
      whileTap={{ scale: motionScale.pressSurface }}
      transition={motionTokens.press}
      className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-navy-50"
    >
      <div className="w-12 shrink-0 overflow-hidden rounded-lg shadow-sm">
        <BookCover src={first?.coverUrl} title={first?.title} className="aspect-[2/3] w-full [&_p]:text-[7px] [&_svg]:hidden" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-950">
          {first?.title}
          {borrowing.items.length > 1 && <span className="font-normal text-navy-500"> +{borrowing.items.length - 1} sách khác</span>}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-500">
          <span>#{borrowing.id} · {totalBooks} cuốn</span>
          {borrowing.borrowDate && <span>Mượn: {formatDate(borrowing.borrowDate)}</span>}
          {borrowing.dueDate && (
            <span className={`flex items-center gap-1 ${overdue ? 'font-semibold text-red-600' : ''}`}>
              <CalendarClock className="size-3.5" aria-hidden /> Hạn trả: {formatDate(borrowing.dueDate)}
            </span>
          )}
          {!borrowing.borrowDate && <span>Gửi lúc: {formatDate(borrowing.createdAt)}</span>}
        </div>
      </div>
      <div className="hidden sm:block">
        <StatusBadge status={borrowing.status} overdue={overdue} />
      </div>
      <ChevronRight className="size-4 shrink-0 text-navy-300" aria-hidden />
    </motion.button>
  );
}

export default function MyBorrowingsPage() {
  useDocumentTitle('Sách tôi mượn');
  const { data, loading, error, reload } = useAsync(() => borrowingService.my(), []);
  const [tab, setTab] = useState('active');
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const openDetail = (b) => {
    setSelected(b);
    setDetailOpen(true);
  };

  const groups = useMemo(() => {
    const list = data ?? [];
    return Object.fromEntries(TABS.map((t) => [t.value, list.filter(t.match)]));
  }, [data]);

  const overdueCount = (groups.active ?? []).filter((b) => daysUntil(b.dueDate) < 0).length;
  const current = groups[tab] ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">Sách tôi mượn</h1>
      <p className="mt-1 text-sm text-navy-500">Theo dõi yêu cầu mượn, hạn trả và lịch sử của bạn.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookMarked} label="Phiếu đang mượn" value={groups.active?.length ?? 0} tone="navy" />
        <StatCard icon={Clock} label="Đang chờ duyệt" value={groups.pending?.length ?? 0} tone="amber" />
        <StatCard icon={History} label="Quá hạn" value={overdueCount} tone={overdueCount ? 'red' : 'green'} hint={overdueCount ? 'Vui lòng trả sách sớm' : 'Bạn không có sách quá hạn'} />
      </div>

      <div className="card mt-6">
        <div className="border-b border-navy-100 p-3 sm:p-4">
          <Tabs tabs={TABS.map((t) => ({ ...t, count: groups[t.value]?.length }))} value={tab} onChange={setTab} layoutId="my-borrowings-tab" />
        </div>

        {loading ? (
          <TableSkeleton rows={3} />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : current.length === 0 ? (
          <EmptyState
            icon={Library}
            title={tab === 'active' ? 'Bạn chưa mượn cuốn sách nào' : tab === 'pending' ? 'Không có yêu cầu đang chờ' : 'Chưa có lịch sử mượn'}
            description="Khám phá kho sách và gửi yêu cầu mượn ngay."
            action={
              <Link to="/books" className="inline-flex h-10 items-center rounded-xl bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800">
                Tới kho sách
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-navy-100 p-2">
            {current.map((b) => (
              <BorrowingRow key={b.id} borrowing={b} onOpen={openDetail} />
            ))}
          </div>
        )}
      </div>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Chi tiết phiếu mượn">
        {selected && <BorrowingDetail borrowing={selected} />}
      </Modal>
    </div>
  );
}
