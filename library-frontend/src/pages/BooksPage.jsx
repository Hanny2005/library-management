import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import SearchBar from '../components/books/SearchBar';
import CategoryChips from '../components/books/CategoryChips';
import BookGrid from '../components/books/BookGrid';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { BookGridSkeleton, Skeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/StateViews';

const PAGE_SIZE = 10;

export default function BooksPage() {
  useDocumentTitle('Kho sách');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? 'newest';
  const page = Math.max(0, Number(params.get('page') ?? 1) - 1);

  // Ô tìm kiếm gõ tự do; chỉ ghi vào URL (và gọi API) sau 350ms ngừng gõ
  const [search, setSearch] = useState(q);
  const debounced = useDebounce(search);
  useEffect(() => setSearch(q), [q]);

  const updateParams = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === '' || v == null ? next.delete(k) : next.set(k, String(v))));
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced !== q) updateParams({ q: debounced.trim(), page: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const categories = useAsync(() => categoryService.list(), []);
  const books = useAsync(
    () => bookService.list({ search: q, categoryId: category, sort, page, size: PAGE_SIZE }),
    [q, category, sort, page],
  );

  const hasFilters = q || category;

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">Kho sách</h1>
        <p className="text-sm text-navy-500">
          {books.data ? `${books.data.totalElements} đầu sách${hasFilters ? ' phù hợp' : ''}` : 'Đang tải danh sách...'}
        </p>
      </div>

      <div className="card mt-6 space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar className="flex-1" value={search} onChange={setSearch} onSubmit={(v) => updateParams({ q: v.trim(), page: '' })} />
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? '' : e.target.value, page: '' })}
            className="input sm:w-48"
            aria-label="Sắp xếp"
          >
            <option value="newest">Mới nhất</option>
            <option value="title">Tên A → Z</option>
            <option value="featured">Nổi bật</option>
          </select>
        </div>
        {categories.loading ? (
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        ) : (
          <CategoryChips categories={categories.data ?? []} value={category} onChange={(id) => updateParams({ category: id, page: '' })} />
        )}
      </div>

      <div className="mt-6">
        {books.loading ? (
          <BookGridSkeleton count={PAGE_SIZE} />
        ) : books.error ? (
          <div className="card">
            <ErrorState error={books.error} onRetry={books.reload} />
          </div>
        ) : books.data.content.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={SearchX}
              title="Không tìm thấy sách phù hợp"
              description="Thử từ khoá khác hoặc bỏ bớt bộ lọc."
              action={
                hasFilters && (
                  <Button variant="secondary" size="sm" onClick={() => setParams({}, { replace: true })}>
                    Xoá bộ lọc
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <BookGrid books={books.data.content} />
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={books.data.totalPages}
                onChange={(p) => {
                  updateParams({ page: p === 0 ? '' : p + 1 });
                  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
