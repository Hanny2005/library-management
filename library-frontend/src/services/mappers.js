/**
 * Chuẩn hoá dữ liệu trả về từ API về cùng một dạng camelCase mà giao diện dùng.
 * Backend Spring Boot (Giai đoạn 2) sẽ trả DTO camelCase; các mapper này vẫn
 * chấp nhận snake_case để an toàn nếu một số field giữ nguyên tên cột database.
 */
const pick = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  return undefined;
};

export const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  description: pick(c, 'description') ?? '',
  bookCount: pick(c, 'bookCount', 'book_count'),
});

export const mapBook = (b) => ({
  id: b.id,
  title: b.title,
  author: b.author,
  description: pick(b, 'description') ?? '',
  quantity: Number(pick(b, 'quantity', 'totalQuantity', 'total_quantity') ?? 0),
  availableQuantity: Number(pick(b, 'availableQuantity', 'available_quantity') ?? 0),
  categoryId: pick(b, 'categoryId', 'category_id') ?? b.category?.id ?? null,
  categoryName: pick(b, 'categoryName', 'category_name') ?? b.category?.name ?? 'Chưa phân loại',
  coverUrl: pick(b, 'coverUrl', 'cover_url', 'imageUrl', 'image_url') ?? '',
  createdAt: pick(b, 'createdAt', 'created_at'),
  featured: Boolean(pick(b, 'featured')),
});

export const mapBorrowing = (r) => ({
  id: r.id,
  userId: pick(r, 'userId', 'user_id'),
  userName: pick(r, 'userName', 'user_name', 'fullName', 'full_name') ?? '',
  userEmail: pick(r, 'userEmail', 'user_email', 'email') ?? '',
  status: r.status,
  borrowDate: pick(r, 'borrowDate', 'borrow_date'),
  dueDate: pick(r, 'dueDate', 'due_date'),
  returnDate: pick(r, 'returnDate', 'return_date'),
  createdAt: pick(r, 'createdAt', 'created_at'),
  note: pick(r, 'note') ?? '',
  items: (r.items ?? r.borrowingItems ?? r.borrowing_items ?? []).map((it) => ({
    bookId: pick(it, 'bookId', 'book_id') ?? it.book?.id,
    title: pick(it, 'title', 'bookTitle', 'book_title') ?? it.book?.title ?? '',
    author: pick(it, 'author') ?? it.book?.author ?? '',
    coverUrl: pick(it, 'coverUrl', 'cover_url') ?? it.book?.coverUrl ?? '',
    quantity: Number(pick(it, 'quantity') ?? 1),
  })),
});

export const mapUser = (u) => ({
  id: u.id,
  fullName: pick(u, 'fullName', 'full_name') ?? '',
  email: u.email ?? '',
  role: (u.role ?? 'USER').toUpperCase(),
  createdAt: pick(u, 'createdAt', 'created_at'),
});

/** Spring Data trả Page {content,totalPages,...}; nếu trả mảng thì tự bọc lại */
export const mapPage = (data, mapper, page = 0, size = 12) => {
  if (Array.isArray(data)) {
    return { content: data.map(mapper), page, size, totalElements: data.length, totalPages: 1 };
  }
  return {
    content: (data.content ?? []).map(mapper),
    page: data.number ?? data.page ?? page,
    size: data.size ?? size,
    totalElements: data.totalElements ?? 0,
    totalPages: Math.max(1, data.totalPages ?? 1),
  };
};
