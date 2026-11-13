import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useToast } from '../../context/ToastContext';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import BookFormModal from '../../components/admin/BookFormModal';
import BookCover from '../../components/books/BookCover';
import SearchBar from '../../components/books/SearchBar';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import { AvailabilityBadge } from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/StateViews';

const PAGE_SIZE = 8;

export default function AdminBooksPage() {
  useDocumentTitle('Quản lý sách');
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(0);
  const debounced = useDebounce(search);

  useEffect(() => setPage(0), [debounced, categoryId]);

  const categories = useAsync(() => categoryService.list(), []);
  const books = useAsync(
    () => bookService.list({ search: debounced, categoryId, page, size: PAGE_SIZE, sort: 'newest' }),
    [debounced, categoryId, page],
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (book) => {
    setEditing(book);
    setFormOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await bookService.update(editing.id, payload);
        toast.success(`Đã cập nhật "${payload.title}".`);
      } else {
        await bookService.create(payload);
        toast.success(`Đã thêm "${payload.title}" vào thư viện.`);
      }
      setFormOpen(false);
      books.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await bookService.remove(deleting.id);
      toast.success(`Đã xoá "${deleting.title}".`);
      setDeleteOpen(false);
      // Nếu xoá phần tử cuối của trang cuối → lùi một trang
      if (books.data.content.length === 1 && page > 0) setPage((p) => p - 1);
      else books.reload();
    } catch (err) {
      toast.error(err.message, 'Không thể xoá');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Sách',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-10 shrink-0 overflow-hidden rounded-md">
            <BookCover src={b.coverUrl} title={b.title} className="aspect-[2/3] w-full [&_p]:text-[6px] [&_svg]:hidden" />
          </div>
          <div className="min-w-0">
            <p className="max-w-64 truncate font-medium text-navy-950">{b.title}</p>
            <p className="text-xs text-navy-500">#{b.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'author', header: 'Tác giả', render: (b) => <span className="whitespace-nowrap">{b.author}</span> },
    { key: 'categoryName', header: 'Thể loại' },
    { key: 'quantity', header: 'Tổng', className: 'text-center', render: (b) => <span className="tabular-nums">{b.quantity}</span> },
    { key: 'available', header: 'Còn lại', className: 'text-center', render: (b) => <AvailabilityBadge available={b.availableQuantity} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (b) => (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => openEdit(b)} className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-brand-50 hover:text-brand-700" aria-label={`Sửa ${b.title}`} title="Sửa">
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleting(b);
              setDeleteOpen(true);
            }}
            className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Xoá ${b.title}`}
            title="Xoá"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý sách"
        description={books.data ? `${books.data.totalElements} đầu sách` : undefined}
        actions={
          <Button icon={Plus} onClick={openCreate} disabled={categories.loading}>
            Thêm sách
          </Button>
        }
      />

      <div className="card">
        <div className="flex flex-col gap-3 border-b border-navy-100 p-4 sm:flex-row">
          <SearchBar className="flex-1" value={search} onChange={setSearch} />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input sm:w-56" aria-label="Lọc theo thể loại">
            <option value="">Tất cả thể loại</option>
            {(categories.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {books.loading ? (
          <TableSkeleton />
        ) : books.error ? (
          <ErrorState error={books.error} onRetry={books.reload} />
        ) : books.data.content.length === 0 ? (
          <EmptyState title="Không có sách nào" description={search || categoryId ? 'Không có sách khớp bộ lọc.' : 'Bấm "Thêm sách" để bắt đầu.'} />
        ) : (
          <>
            <DataTable columns={columns} rows={books.data.content} />
            <div className="border-t border-navy-100 p-4">
              <Pagination page={page} totalPages={books.data.totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      <BookFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSave} book={editing} categories={categories.data ?? []} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Xoá sách"
        confirmText="Xoá sách"
        message={deleting ? `Bạn chắc chắn muốn xoá "${deleting.title}"? Thao tác này không thể hoàn tác.` : ''}
      />
    </div>
  );
}
