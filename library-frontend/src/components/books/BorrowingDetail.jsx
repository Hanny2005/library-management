import { CalendarCheck, CalendarClock, CalendarPlus, CalendarX2, StickyNote, User } from 'lucide-react';
import BookCover from './BookCover';
import StatusBadge from '../ui/StatusBadge';
import { daysUntil, formatDate } from '../../utils/format';

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="flex items-center gap-2 text-navy-500">
        <Icon className="size-4" aria-hidden /> {label}
      </span>
      <span className="text-right font-medium text-navy-900">{value}</span>
    </div>
  );
}

/** Nội dung chi tiết một phiếu mượn (dùng trong Modal ở trang người dùng và admin) */
export default function BorrowingDetail({ borrowing, showUser = false }) {
  const left = daysUntil(borrowing.dueDate);
  const overdue = borrowing.status === 'APPROVED' && left !== null && left < 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-navy-500">
          Mã phiếu <span className="font-semibold text-navy-900">#{borrowing.id}</span>
        </span>
        <StatusBadge status={borrowing.status} overdue={overdue} />
      </div>

      <div className="divide-y divide-navy-100 rounded-xl border border-navy-100 px-4">
        {showUser && <Row icon={User} label="Người mượn" value={`${borrowing.userName}${borrowing.userEmail ? ` · ${borrowing.userEmail}` : ''}`} />}
        <Row icon={CalendarPlus} label="Ngày gửi yêu cầu" value={formatDate(borrowing.createdAt)} />
        <Row icon={CalendarCheck} label="Ngày mượn" value={formatDate(borrowing.borrowDate)} />
        <Row
          icon={CalendarClock}
          label="Hạn trả"
          value={
            borrowing.dueDate ? (
              <span className={overdue ? 'text-red-600' : ''}>
                {formatDate(borrowing.dueDate)}
                {borrowing.status === 'APPROVED' && left !== null && (
                  <span className="ml-1 font-normal text-navy-500">({left < 0 ? `quá ${-left} ngày` : left === 0 ? 'hôm nay' : `còn ${left} ngày`})</span>
                )}
              </span>
            ) : (
              '—'
            )
          }
        />
        <Row icon={CalendarX2} label="Ngày trả" value={formatDate(borrowing.returnDate)} />
        {borrowing.note && <Row icon={StickyNote} label="Ghi chú" value={borrowing.note} />}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Sách trong phiếu ({borrowing.items.length})</h3>
        <ul className="space-y-2">
          {borrowing.items.map((it) => (
            <li key={it.bookId} className="flex items-center gap-3 rounded-xl bg-navy-50/60 p-2.5">
              <div className="w-10 shrink-0 overflow-hidden rounded-md">
                <BookCover src={it.coverUrl} title={it.title} className="aspect-[2/3] w-full [&_p]:text-[6px] [&_svg]:hidden" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-900">{it.title}</p>
                <p className="truncate text-xs text-navy-500">{it.author}</p>
              </div>
              <span className="text-sm font-semibold text-navy-700">×{it.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
