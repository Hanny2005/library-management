import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookMarked, CalendarClock, Layers, Library, LogIn, Minus, Plus, User } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookService } from '../services/bookService';
import { borrowingService } from '../services/borrowingService';
import BookCover from '../components/books/BookCover';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { AvailabilityBadge } from '../components/ui/StatusBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateViews';

const BORROW_DAYS = [7, 14, 21, 30];

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-navy-50/70 p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-navy-500">{label}</p>
        <p className="truncate text-sm font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    </div>
  );
}

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { data: book, loading, error, reload, setData } = useAsync(() => bookService.get(id), [id]);
  useDocumentTitle(book?.title ?? 'Chi tiết sách');

  const [quantity, setQuantity] = useState(1);
  const [borrowDays, setBorrowDays] = useState(14);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const available = book?.availableQuantity ?? 0;
  const canBorrow = available > 0;

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (quantity < 1 || quantity > available) {
      toast.error(`Số lượng mượn phải từ 1 đến ${available}.`);
      return;
    }
    setSubmitting(true);
    try {
      await borrowingService.create({ items: [{ bookId: book.id, quantity }], borrowDays, note: note.trim() });
      toast.success('Yêu cầu mượn đã được gửi. Vui lòng chờ thủ thư duyệt.');
      setNote('');
      setQuantity(1);
      navigate('/my-borrowings');
    } catch (err) {
      toast.error(err.message);
      // Số lượng có thể đã thay đổi (người khác mượn trước) → tải lại để hiển thị đúng
      const fresh = await bookService.get(id).catch(() => null);
      if (fresh) setData(fresh);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/books'))}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
      >
        <ArrowLeft className="size-4" aria-hidden /> Quay lại
      </button>

      {loading ? (
        <DetailSkeleton />
      ) : error ? (
        <div className="card">
          <ErrorState error={error} onRetry={reload} />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          <div className="mx-auto w-full max-w-xs md:max-w-none">
            <div className="overflow-hidden rounded-2xl shadow-lift ring-1 ring-navy-100">
              <BookCover src={book.coverUrl} title={book.title} author={book.author} className="aspect-[2/3] w-full" />
            </div>
          </div>

          <div className="min-w-0">
            <Link
              to={`/books?category=${book.categoryId ?? ''}`}
              className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 ring-inset hover:bg-brand-100"
            >
              {book.categoryName}
            </Link>
            <h1 className="mt-3 font-display text-3xl leading-tight font-semibold text-navy-950 sm:text-4xl">{book.title}</h1>
            <p className="mt-2 text-base text-navy-600">
              bởi <span className="font-medium text-navy-900">{book.author}</span>
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <InfoItem icon={User} label="Tác giả" value={book.author} />
              <InfoItem icon={Layers} label="Thể loại" value={book.categoryName} />
              <InfoItem icon={Library} label="Tổng số lượng" value={`${book.quantity} cuốn`} />
              <InfoItem icon={BookMarked} label="Còn lại" value={`${available} cuốn`} />
            </div>

            <section className="mt-8">
              <h2 className="text-sm font-semibold tracking-wide text-navy-900 uppercase">Mô tả</h2>
              <p className="mt-2 leading-relaxed whitespace-pre-line text-navy-600">{book.description || 'Chưa có mô tả cho cuốn sách này.'}</p>
            </section>

            {/* ---------- Đăng ký mượn ---------- */}
            <section className="card mt-8 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-navy-950">Đăng ký mượn sách</h2>
                <AvailabilityBadge available={available} total={book.quantity} />
              </div>

              {!isAuthenticated ? (
                <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <p className="flex-1 text-sm text-navy-500">Bạn cần đăng nhập để gửi yêu cầu mượn sách.</p>
                  <Button icon={LogIn} onClick={() => navigate('/login', { state: { from: { pathname: `/books/${book.id}` } } })}>
                    Đăng nhập để mượn
                  </Button>
                </div>
              ) : !canBorrow ? (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  Sách hiện đã được mượn hết. Vui lòng quay lại sau.
                </p>
              ) : (
                <form onSubmit={handleBorrow} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className="label" id="qty-label">Số lượng</span>
                      <div className="flex h-11 items-center rounded-xl border border-navy-200 bg-white" role="group" aria-labelledby="qty-label">
                        <button
                          type="button"
                          className="grid h-full w-11 place-items-center text-navy-600 hover:bg-navy-50 disabled:opacity-40"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="grid h-full w-11 place-items-center text-navy-600 hover:bg-navy-50 disabled:opacity-40"
                          onClick={() => setQuantity((q) => Math.min(available, q + 1))}
                          disabled={quantity >= available}
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-navy-400">Tối đa {available} cuốn</p>
                    </div>
                    <FormField as="select" label="Thời gian mượn" value={borrowDays} onChange={(e) => setBorrowDays(Number(e.target.value))}>
                      {BORROW_DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d} ngày
                        </option>
                      ))}
                    </FormField>
                  </div>
                  <FormField
                    as="textarea"
                    label="Ghi chú (không bắt buộc)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={300}
                    placeholder="Ví dụ: Nhận sách vào chiều thứ 6"
                    className="[&_textarea]:min-h-20"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs text-navy-500">
                      <CalendarClock className="size-4 text-brand-600" aria-hidden />
                      Hạn trả được tính từ ngày thủ thư duyệt phiếu.
                    </p>
                    <Button type="submit" variant="accent" size="lg" icon={BookMarked} loading={submitting}>
                      Gửi yêu cầu mượn
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
