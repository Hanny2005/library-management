import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import BookCover from '../books/BookCover';

const EMPTY = { title: '', author: '', description: '', quantity: 1, categoryId: '', coverUrl: '' };

/** Form thêm / sửa sách. onSubmit(payload) trả Promise; lỗi được hiển thị qua toast ở trang cha */
export default function BookFormModal({ open, onClose, onSubmit, book, categories }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(book);
  const borrowed = book ? book.quantity - book.availableQuantity : 0;

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      book
        ? {
            title: book.title,
            author: book.author,
            description: book.description ?? '',
            quantity: book.quantity,
            categoryId: book.categoryId ?? '',
            coverUrl: book.coverUrl ?? '',
          }
        : EMPTY,
    );
  }, [open, book]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.title.trim()) er.title = 'Vui lòng nhập tên sách.';
    else if (form.title.trim().length > 255) er.title = 'Tên sách tối đa 255 ký tự.';
    if (!form.author.trim()) er.author = 'Vui lòng nhập tác giả.';
    if (!form.categoryId) er.categoryId = 'Vui lòng chọn thể loại.';
    const qty = Number(form.quantity);
    if (!Number.isInteger(qty) || qty < 0) er.quantity = 'Số lượng phải là số nguyên ≥ 0.';
    else if (qty < borrowed) er.quantity = `Không được nhỏ hơn số đang cho mượn (${borrowed}).`;
    if (form.coverUrl && !/^https?:\/\//i.test(form.coverUrl.trim())) er.coverUrl = 'Đường dẫn ảnh phải bắt đầu bằng http(s)://';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const quantity = Number(form.quantity);
      await onSubmit({
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        quantity,
        // Khi thêm mới: số còn lại = tổng. Khi sửa: backend tự tính lại theo số đang mượn.
        availableQuantity: isEdit ? quantity - borrowed : quantity,
        categoryId: Number(form.categoryId),
        coverUrl: form.coverUrl.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      title={isEdit ? 'Sửa thông tin sách' : 'Thêm sách mới'}
      description={isEdit ? `Mã sách #${book.id}` : 'Điền thông tin cuốn sách cần thêm vào thư viện.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button type="submit" form="book-form" loading={saving}>
            {isEdit ? 'Lưu thay đổi' : 'Thêm sách'}
          </Button>
        </>
      }
    >
      <form id="book-form" onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-[120px_1fr]">
        <div className="hidden sm:block">
          <div className="overflow-hidden rounded-xl ring-1 ring-navy-100">
            <BookCover key={form.coverUrl} src={form.coverUrl.trim()} title={form.title || 'Tên sách'} author={form.author} className="aspect-[2/3] w-full" />
          </div>
          <p className="mt-2 text-center text-xs text-navy-400">Xem trước bìa</p>
        </div>
        <div className="space-y-4">
          <FormField label="Tên sách *" value={form.title} onChange={set('title')} error={errors.title} maxLength={255} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tác giả *" value={form.author} onChange={set('author')} error={errors.author} />
            <FormField as="select" label="Thể loại *" value={form.categoryId} onChange={set('categoryId')} error={errors.categoryId}>
              <option value="">— Chọn thể loại —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormField>
          </div>
          <FormField
            label="Tổng số lượng *"
            type="number"
            min={borrowed}
            value={form.quantity}
            onChange={set('quantity')}
            error={errors.quantity}
            hint={isEdit ? `Đang cho mượn ${borrowed} cuốn — số còn lại sẽ là ${Math.max(0, Number(form.quantity || 0) - borrowed)}.` : 'Số còn lại ban đầu bằng tổng số lượng.'}
          />
          <FormField label="Link ảnh bìa" placeholder="https://..." value={form.coverUrl} onChange={set('coverUrl')} error={errors.coverUrl} />
          <FormField as="textarea" label="Mô tả" value={form.description} onChange={set('description')} maxLength={2000} />
        </div>
      </form>
    </Modal>
  );
}
