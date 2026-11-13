import { useState } from 'react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useToast } from '../../context/ToastContext';
import { categoryService } from '../../services/categoryService';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/StateViews';

export default function AdminCategoriesPage() {
  useDocumentTitle('Quản lý thể loại');
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => categoryService.list(), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openForm = (cat = null) => {
    setEditing(cat);
    setForm({ name: cat?.name ?? '', description: cat?.description ?? '' });
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) return setFormError('Tên thể loại phải có ít nhất 2 ký tự.');
    if (name.length > 100) return setFormError('Tên thể loại tối đa 100 ký tự.');
    setSaving(true);
    try {
      if (editing) await categoryService.update(editing.id, { name, description: form.description.trim() });
      else await categoryService.create({ name, description: form.description.trim() });
      toast.success(editing ? `Đã cập nhật thể loại "${name}".` : `Đã thêm thể loại "${name}".`);
      setFormOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await categoryService.remove(deleting.id);
      toast.success(`Đã xoá thể loại "${deleting.name}".`);
      setDeleteOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message, 'Không thể xoá');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID', render: (c) => <span className="text-navy-500">#{c.id}</span> },
    { key: 'name', header: 'Tên thể loại', render: (c) => <span className="font-medium text-navy-950">{c.name}</span> },
    { key: 'description', header: 'Mô tả', render: (c) => <span className="line-clamp-1 max-w-md text-navy-500">{c.description || '—'}</span> },
    { key: 'bookCount', header: 'Số đầu sách', className: 'text-center', render: (c) => <span className="tabular-nums">{c.bookCount ?? '—'}</span> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => openForm(c)} className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-brand-50 hover:text-brand-700" aria-label={`Sửa ${c.name}`} title="Sửa">
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleting(c);
              setDeleteOpen(true);
            }}
            className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Xoá ${c.name}`}
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
        title="Thể loại"
        description={data ? `${data.length} thể loại` : undefined}
        actions={
          <Button icon={Plus} onClick={() => openForm()}>
            Thêm thể loại
          </Button>
        }
      />

      <div className="card">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : data.length === 0 ? (
          <EmptyState icon={Tags} title="Chưa có thể loại" description='Bấm "Thêm thể loại" để tạo mới.' />
        ) : (
          <DataTable columns={columns} rows={data} />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={saving ? undefined : () => setFormOpen(false)}
        title={editing ? 'Sửa thể loại' : 'Thêm thể loại'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)} disabled={saving}>
              Huỷ
            </Button>
            <Button type="submit" form="category-form" loading={saving}>
              {editing ? 'Lưu' : 'Thêm'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSave} noValidate className="space-y-4">
          <FormField
            label="Tên thể loại *"
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              setFormError('');
            }}
            error={formError}
            maxLength={100}
          />
          <FormField as="textarea" label="Mô tả" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} maxLength={500} />
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Xoá thể loại"
        confirmText="Xoá"
        message={deleting ? `Xoá thể loại "${deleting.name}"? Chỉ xoá được khi không còn sách nào thuộc thể loại này.` : ''}
      />
    </div>
  );
}
