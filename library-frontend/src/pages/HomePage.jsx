import { Link } from 'react-router-dom';
import { ArrowRight, Atom, BookOpen, Baby, Cpu, Feather, Layers, Library, Sparkles, TrendingUp } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import BookRow from '../components/books/BookRow';
import BookCover from '../components/books/BookCover';
import StatCard from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/StateViews';

// Biểu tượng theo tên thể loại (không có thì dùng biểu tượng chung)
const CATEGORY_ICONS = [
  [/văn|tiểu thuyết|truyện/i, Feather],
  [/khoa học/i, Atom],
  [/công nghệ|lập trình|tin học/i, Cpu],
  [/kinh tế|tài chính/i, TrendingUp],
  [/kỹ năng|bản thân/i, Sparkles],
  [/thiếu nhi|trẻ em/i, Baby],
];
const iconFor = (name) => CATEGORY_ICONS.find(([re]) => re.test(name))?.[1] ?? Layers;

function SectionHeader({ title, subtitle, to }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-navy-500">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="group flex shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
          Xem tất cả <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-40 shrink-0 sm:w-44">
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-4/5" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function BookSection({ title, subtitle, to, state }) {
  return (
    <section className="mt-12">
      <SectionHeader title={title} subtitle={subtitle} to={to} />
      {state.loading ? (
        <RowSkeleton />
      ) : state.error ? (
        <div className="card">
          <ErrorState error={state.error} onRetry={state.reload} />
        </div>
      ) : state.data?.content?.length ? (
        <BookRow books={state.data.content} />
      ) : (
        <div className="card">
          <EmptyState title="Chưa có sách" description="Sách sẽ hiển thị tại đây khi thư viện cập nhật." />
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle('Trang chủ');
  const featured = useAsync(() => bookService.list({ sort: 'featured', size: 10 }), []);
  const newest = useAsync(() => bookService.list({ sort: 'newest', size: 10 }), []);
  const categories = useAsync(() => categoryService.list(), []);

  const heroBooks = (featured.data?.content ?? []).slice(0, 3);
  const totalTitles = newest.data?.totalElements;

  return (
    <div>
      {/* ---------- Banner ---------- */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-10 text-white sm:px-10 sm:py-12 lg:py-14">
        <div className="absolute -top-32 -right-20 size-[28rem] rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 left-1/3 size-80 rounded-full bg-brand-400/10 blur-3xl" aria-hidden />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-white/15">
              <Library className="size-3.5" aria-hidden /> Thư viện số Tri Thức
            </span>
            <h1 className="mt-5 font-display text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
              Tìm cuốn sách tiếp theo <span className="text-brand-300">bạn sẽ yêu thích</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-navy-300 sm:text-base">
              Tra cứu kho sách, đăng ký mượn trực tuyến và theo dõi hạn trả — tất cả ở một nơi, trên mọi thiết bị.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/books" className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 font-medium text-white transition-colors hover:bg-brand-500">
                <BookOpen className="size-4" aria-hidden /> Khám phá kho sách
              </Link>
              <Link to="/my-borrowings" className="inline-flex h-12 items-center rounded-xl bg-white/10 px-6 font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/15">
                Sách tôi đang mượn
              </Link>
            </div>
          </div>

          {/* Chồng 3 bìa sách nổi bật */}
          <div className="relative hidden h-72 lg:block" aria-hidden>
            {heroBooks.map((book, i) => (
              <div
                key={book.id}
                className="absolute top-1/2 w-40 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
                style={{
                  left: `${10 + i * 26}%`,
                  transform: `translateY(-50%) rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? -14 : 6}px)`,
                  zIndex: i === 1 ? 2 : 1,
                }}
              >
                <BookCover src={book.coverUrl} title={book.title} author={book.author} className="aspect-[2/3] w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Thống kê ---------- */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {newest.loading || categories.loading ? (
          <>
            <Skeleton className="h-[88px] rounded-2xl" />
            <Skeleton className="h-[88px] rounded-2xl" />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} label="Đầu sách trong thư viện" value={totalTitles ?? 0} tone="navy" />
            <StatCard icon={Layers} label="Thể loại sách" value={categories.data?.length ?? 0} tone="blue" />
          </>
        )}
      </section>

      <BookSection title="Sách nổi bật" subtitle="Được bạn đọc quan tâm nhiều nhất" to="/books" state={featured} />
      <BookSection title="Mới cập nhật" subtitle="Những đầu sách vừa về thư viện" to="/books" state={newest} />

      {/* ---------- Danh mục ---------- */}
      <section className="mt-12">
        <SectionHeader title="Danh mục sách" subtitle="Chọn thể loại bạn quan tâm" />
        {categories.loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : categories.error ? (
          <div className="card">
            <ErrorState error={categories.error} onRetry={categories.reload} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.data.map((c) => {
              const Icon = iconFor(c.name);
              return (
                <Link
                  key={c.id}
                  to={`/books?category=${c.id}`}
                  className="group card flex flex-col gap-3 p-4 transition-[border-color,box-shadow] hover:border-brand-200 hover:shadow-lift"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy-950">{c.name}</span>
                    {c.bookCount != null && <span className="text-xs text-navy-500">{c.bookCount} đầu sách</span>}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
