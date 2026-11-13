/**
 * ============================================================
 * DỮ LIỆU XEM TRƯỚC — chỉ dùng khi VITE_USE_MOCK=true
 * ============================================================
 * Mục đích: xem và thử giao diện ở Giai đoạn 1 khi chưa có backend.
 * Khi đặt VITE_USE_MOCK=false, toàn bộ ứng dụng gọi API thật và
 * file này không còn được dùng.
 *
 * Kho dữ liệu này cũng áp dụng đúng các quy tắc nghiệp vụ (không mượn quá
 * số lượng còn, duyệt thì trừ, trả thì cộng, không trả 2 lần) để giao diện
 * được kiểm thử với hành vi giống backend sau này.
 */

const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString();

const state = {
  categories: [
    { id: 1, name: 'Văn học', description: 'Tiểu thuyết, truyện ngắn và tác phẩm kinh điển' },
    { id: 2, name: 'Khoa học', description: 'Khoa học tự nhiên và xã hội' },
    { id: 3, name: 'Công nghệ', description: 'Lập trình và kỹ thuật phần mềm' },
    { id: 4, name: 'Kinh tế', description: 'Tài chính, đầu tư, kinh doanh' },
    { id: 5, name: 'Kỹ năng sống', description: 'Phát triển bản thân' },
    { id: 6, name: 'Thiếu nhi', description: 'Sách cho trẻ em và thiếu niên' },
  ],
  books: [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', categoryId: 1, quantity: 8, availableQuantity: 5, coverUrl: cover('9780525559474'), featured: true, createdAt: daysAgo(2),
      description: 'Giữa sự sống và cái chết có một thư viện. Mỗi cuốn sách trên kệ là một cơ hội sống thử một cuộc đời khác — một câu chuyện về lựa chọn, tiếc nuối và ý nghĩa của việc được sống.' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', categoryId: 5, quantity: 10, availableQuantity: 7, coverUrl: cover('9780735211292'), featured: true, createdAt: daysAgo(5),
      description: 'Phương pháp xây dựng thói quen tốt và loại bỏ thói quen xấu bằng những thay đổi nhỏ, nhất quán mỗi ngày.' },
    { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', categoryId: 2, quantity: 6, availableQuantity: 2, coverUrl: cover('9780062316097'), featured: true, createdAt: daysAgo(12),
      description: 'Lược sử loài người từ thời kỳ đồ đá đến kỷ nguyên công nghệ, qua ba cuộc cách mạng: nhận thức, nông nghiệp và khoa học.' },
    { id: 4, title: 'Clean Code', author: 'Robert C. Martin', categoryId: 3, quantity: 5, availableQuantity: 0, coverUrl: cover('9780132350884'), featured: false, createdAt: daysAgo(1),
      description: 'Cẩm nang viết mã sạch: đặt tên, hàm, chú thích, xử lý lỗi và kiểm thử — nền tảng của nghề lập trình chuyên nghiệp.' },
    { id: 5, title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', categoryId: 3, quantity: 4, availableQuantity: 3, coverUrl: cover('9780135957059'), featured: false, createdAt: daysAgo(3),
      description: 'Những bài học thực tiễn giúp lập trình viên trưởng thành: tư duy, công cụ và cách làm việc hiệu quả.' },
    { id: 6, title: 'Dune', author: 'Frank Herbert', categoryId: 1, quantity: 7, availableQuantity: 4, coverUrl: cover('9780441172719'), featured: true, createdAt: daysAgo(20),
      description: 'Sử thi khoa học viễn tưởng về hành tinh sa mạc Arrakis, quyền lực, tôn giáo và sinh thái.' },
    { id: 7, title: '1984', author: 'George Orwell', categoryId: 1, quantity: 9, availableQuantity: 6, coverUrl: cover('9780451524935'), featured: false, createdAt: daysAgo(30),
      description: 'Tiểu thuyết phản địa đàng kinh điển về một xã hội bị giám sát toàn diện và sự thao túng sự thật.' },
    { id: 8, title: 'The Psychology of Money', author: 'Morgan Housel', categoryId: 4, quantity: 6, availableQuantity: 6, coverUrl: cover('9780857197689'), featured: true, createdAt: daysAgo(4),
      description: 'Mười chín câu chuyện ngắn về cách con người nghĩ và hành xử với tiền bạc.' },
    { id: 9, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', categoryId: 2, quantity: 5, availableQuantity: 1, coverUrl: cover('9780374533557'), featured: false, createdAt: daysAgo(9),
      description: 'Hai hệ thống tư duy chi phối quyết định của con người — nhanh, trực giác và chậm, lý trí.' },
    { id: 10, title: 'The Alchemist', author: 'Paulo Coelho', categoryId: 1, quantity: 12, availableQuantity: 9, coverUrl: cover('9780062315007'), featured: false, createdAt: daysAgo(6),
      description: 'Hành trình theo đuổi giấc mơ của chàng chăn cừu Santiago, ngụ ngôn về vận mệnh và lắng nghe trái tim.' },
    { id: 11, title: 'Harry Potter và Hòn đá Phù thủy', author: 'J.K. Rowling', categoryId: 6, quantity: 10, availableQuantity: 8, coverUrl: cover('9780590353427'), featured: false, createdAt: daysAgo(0),
      description: 'Cậu bé Harry phát hiện mình là phù thủy và bước vào trường Hogwarts — khởi đầu bộ truyện nổi tiếng.' },
    { id: 12, title: 'Educated', author: 'Tara Westover', categoryId: 5, quantity: 4, availableQuantity: 4, coverUrl: cover('9780399590504'), featured: false, createdAt: daysAgo(15),
      description: 'Hồi ký của người phụ nữ lớn lên không đến trường và tự học đến tiến sĩ tại Cambridge.' },
  ],
  users: [
    { id: 'demo-user', fullName: 'Nguyễn Văn An', email: 'user@demo.local', role: 'USER', createdAt: daysAgo(40) },
    { id: 'demo-admin', fullName: 'Quản trị viên', email: 'admin@demo.local', role: 'ADMIN', createdAt: daysAgo(90) },
    { id: 'u-3', fullName: 'Trần Thị Bình', email: 'binh@demo.local', role: 'USER', createdAt: daysAgo(20) },
    { id: 'u-4', fullName: 'Lê Minh Châu', email: 'chau@demo.local', role: 'USER', createdAt: daysAgo(8) },
  ],
  borrowings: [
    { id: 101, userId: 'demo-user', status: 'APPROVED', borrowDate: daysAgo(6), dueDate: daysFromNow(8), returnDate: null, createdAt: daysAgo(7), note: '',
      items: [{ bookId: 3, quantity: 1 }] },
    { id: 102, userId: 'demo-user', status: 'PENDING', borrowDate: null, dueDate: null, returnDate: null, createdAt: daysAgo(1), note: 'Mượn cho đồ án', borrowDays: 14,
      items: [{ bookId: 5, quantity: 1 }] },
    { id: 103, userId: 'demo-user', status: 'RETURNED', borrowDate: daysAgo(40), dueDate: daysAgo(26), returnDate: daysAgo(28), createdAt: daysAgo(41), note: '',
      items: [{ bookId: 7, quantity: 1 }] },
    { id: 104, userId: 'u-3', status: 'PENDING', borrowDate: null, dueDate: null, returnDate: null, createdAt: daysAgo(0), note: '', borrowDays: 7,
      items: [{ bookId: 1, quantity: 1 }, { bookId: 8, quantity: 1 }] },
    { id: 105, userId: 'u-4', status: 'APPROVED', borrowDate: daysAgo(18), dueDate: daysAgo(4), returnDate: null, createdAt: daysAgo(19), note: '',
      items: [{ bookId: 9, quantity: 1 }] },
    { id: 106, userId: 'u-3', status: 'REJECTED', borrowDate: null, dueDate: null, returnDate: null, createdAt: daysAgo(10), note: 'Hết sách', borrowDays: 7,
      items: [{ bookId: 4, quantity: 1 }] },
  ],
  nextIds: { book: 13, category: 7, borrowing: 107 },
};

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));

function fail(message, status = 400) {
  const err = new Error(message);
  err.isApiError = true;
  err.status = status;
  return err;
}

let currentUserId = null;
/** Gắn người dùng hiện tại cho kho xem trước (gọi từ AuthContext) */
export function setMockCurrentUser(user) {
  const existing = user && state.users.find((u) => u.id === user.id);
  if (existing) existing.role = user.role ?? existing.role;
  if (user && !existing) {
    state.users.push({ id: user.id, fullName: user.fullName, email: user.email, role: user.role ?? 'USER', createdAt: new Date().toISOString() });
  }
  currentUserId = user?.id ?? null;
}
function requireUser() {
  const user = state.users.find((u) => u.id === currentUserId);
  if (!user) throw fail('Vui lòng đăng nhập để tiếp tục.', 401);
  return user;
}
function requireAdmin() {
  const user = requireUser();
  if (user.role !== 'ADMIN') throw fail('Bạn không có quyền thực hiện thao tác này.', 403);
  return user;
}

const withCategory = (book) => ({
  ...book,
  categoryName: state.categories.find((c) => c.id === book.categoryId)?.name ?? 'Chưa phân loại',
});

function expandBorrowing(b) {
  const user = state.users.find((u) => u.id === b.userId);
  return {
    ...b,
    userName: user?.fullName ?? 'Không rõ',
    userEmail: user?.email ?? '',
    items: b.items.map((it) => {
      const book = state.books.find((x) => x.id === it.bookId);
      return { ...it, title: book?.title ?? 'Sách đã xoá', author: book?.author ?? '', coverUrl: book?.coverUrl ?? '' };
    }),
  };
}

/* ---------------- Auth (xem trước) ---------------- */
export const mockAuth = {
  async signIn(email, password) {
    await delay(500);
    const user = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || password !== 'demo123') throw fail('Email hoặc mật khẩu không đúng.', 401);
    return clone(user);
  },
  async signUp({ fullName, email }) {
    await delay(600);
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw fail('Email này đã được đăng ký.');
    }
    const user = { id: `u-${Date.now()}`, fullName, email, role: 'USER', createdAt: new Date().toISOString() };
    state.users.push(user);
    return clone(user);
  },
  getUser(id) {
    const u = state.users.find((x) => x.id === id);
    return u ? clone(u) : null;
  },
};

/* ---------------- Books ---------------- */
export const mockBooks = {
  async list({ search = '', categoryId = '', page = 0, size = 12, sort = 'newest' } = {}) {
    await delay();
    const q = search.trim().toLowerCase();
    let items = state.books.filter(
      (b) =>
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
        (!categoryId || b.categoryId === Number(categoryId)),
    );
    if (sort === 'newest') items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'title') items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'featured') items = items.filter((b) => b.featured);
    const totalElements = items.length;
    const content = items.slice(page * size, page * size + size).map(withCategory);
    return { content: clone(content), page, size, totalElements, totalPages: Math.max(1, Math.ceil(totalElements / size)) };
  },
  async get(id) {
    await delay();
    const book = state.books.find((b) => b.id === Number(id));
    if (!book) throw fail('Không tìm thấy sách.', 404);
    return clone(withCategory(book));
  },
  async create(payload) {
    await delay();
    requireAdmin();
    const book = { ...payload, id: state.nextIds.book++, createdAt: new Date().toISOString(), featured: false };
    state.books.push(book);
    return clone(withCategory(book));
  },
  async update(id, payload) {
    await delay();
    requireAdmin();
    const book = state.books.find((b) => b.id === Number(id));
    if (!book) throw fail('Không tìm thấy sách.', 404);
    const borrowed = book.quantity - book.availableQuantity;
    if (payload.quantity < borrowed) throw fail(`Tổng số lượng không được nhỏ hơn số sách đang cho mượn (${borrowed}).`);
    Object.assign(book, payload, { availableQuantity: payload.quantity - borrowed });
    return clone(withCategory(book));
  },
  async remove(id) {
    await delay();
    requireAdmin();
    const active = state.borrowings.some(
      (b) => ['PENDING', 'APPROVED'].includes(b.status) && b.items.some((i) => i.bookId === Number(id)),
    );
    if (active) throw fail('Không thể xoá: sách đang nằm trong phiếu mượn chưa hoàn tất.');
    state.books = state.books.filter((b) => b.id !== Number(id));
  },
};

/* ---------------- Categories ---------------- */
export const mockCategories = {
  async list() {
    await delay(250);
    return clone(
      state.categories.map((c) => ({ ...c, bookCount: state.books.filter((b) => b.categoryId === c.id).length })),
    );
  },
  async create(payload) {
    await delay();
    requireAdmin();
    if (state.categories.some((c) => c.name.toLowerCase() === payload.name.trim().toLowerCase())) {
      throw fail('Tên thể loại đã tồn tại.');
    }
    const cat = { id: state.nextIds.category++, name: payload.name.trim(), description: payload.description ?? '' };
    state.categories.push(cat);
    return clone(cat);
  },
  async update(id, payload) {
    await delay();
    requireAdmin();
    const cat = state.categories.find((c) => c.id === Number(id));
    if (!cat) throw fail('Không tìm thấy thể loại.', 404);
    Object.assign(cat, { name: payload.name.trim(), description: payload.description ?? '' });
    return clone(cat);
  },
  async remove(id) {
    await delay();
    requireAdmin();
    if (state.books.some((b) => b.categoryId === Number(id))) {
      throw fail('Không thể xoá: vẫn còn sách thuộc thể loại này.');
    }
    state.categories = state.categories.filter((c) => c.id !== Number(id));
  },
};

/* ---------------- Borrowings ---------------- */
export const mockBorrowings = {
  async create({ items, borrowDays = 14, note = '' }) {
    await delay(500);
    const user = requireUser();
    if (!items?.length) throw fail('Phiếu mượn phải có ít nhất một cuốn sách.');
    for (const it of items) {
      const book = state.books.find((b) => b.id === Number(it.bookId));
      if (!book) throw fail('Sách không tồn tại.', 404);
      if (book.availableQuantity <= 0) throw fail(`"${book.title}" hiện đã hết.`);
      if (it.quantity < 1 || it.quantity > book.availableQuantity) {
        throw fail(`Chỉ còn ${book.availableQuantity} cuốn "${book.title}".`);
      }
    }
    const b = {
      id: state.nextIds.borrowing++, userId: user.id, status: 'PENDING', borrowDate: null, dueDate: null,
      returnDate: null, createdAt: new Date().toISOString(), note, borrowDays,
      items: items.map((i) => ({ bookId: Number(i.bookId), quantity: Number(i.quantity) })),
    };
    state.borrowings.push(b);
    return clone(expandBorrowing(b));
  },
  async my() {
    await delay();
    const user = requireUser();
    return clone(
      state.borrowings
        .filter((b) => b.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(expandBorrowing),
    );
  },
  async all({ status = '' } = {}) {
    await delay();
    requireAdmin();
    return clone(
      state.borrowings
        .filter((b) => !status || b.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(expandBorrowing),
    );
  },
  async approve(id) {
    await delay(500);
    requireAdmin();
    const b = state.borrowings.find((x) => x.id === Number(id));
    if (!b) throw fail('Không tìm thấy phiếu mượn.', 404);
    if (b.status !== 'PENDING') throw fail('Chỉ duyệt được phiếu đang chờ duyệt.');
    // Kiểm tra trước, cập nhật sau — mô phỏng transaction "tất cả hoặc không"
    for (const it of b.items) {
      const book = state.books.find((x) => x.id === it.bookId);
      if (!book || book.availableQuantity < it.quantity) throw fail(`Không đủ sách "${book?.title ?? ''}" để duyệt.`);
    }
    b.items.forEach((it) => {
      state.books.find((x) => x.id === it.bookId).availableQuantity -= it.quantity;
    });
    b.status = 'APPROVED';
    b.borrowDate = new Date().toISOString();
    b.dueDate = daysFromNow(b.borrowDays ?? 14);
    return clone(expandBorrowing(b));
  },
  async reject(id) {
    await delay(400);
    requireAdmin();
    const b = state.borrowings.find((x) => x.id === Number(id));
    if (!b) throw fail('Không tìm thấy phiếu mượn.', 404);
    if (b.status !== 'PENDING') throw fail('Chỉ từ chối được phiếu đang chờ duyệt.');
    b.status = 'REJECTED';
    return clone(expandBorrowing(b));
  },
  async markReturned(id) {
    await delay(500);
    requireAdmin();
    const b = state.borrowings.find((x) => x.id === Number(id));
    if (!b) throw fail('Không tìm thấy phiếu mượn.', 404);
    if (b.status === 'RETURNED') throw fail('Phiếu này đã được trả trước đó.');
    if (b.status !== 'APPROVED') throw fail('Chỉ xác nhận trả cho phiếu đã được duyệt.');
    b.items.forEach((it) => {
      const book = state.books.find((x) => x.id === it.bookId);
      if (book) book.availableQuantity = Math.min(book.quantity, book.availableQuantity + it.quantity);
    });
    b.status = 'RETURNED';
    b.returnDate = new Date().toISOString();
    return clone(expandBorrowing(b));
  },
};

/* ---------------- Admin ---------------- */
export const mockAdmin = {
  async users() {
    await delay();
    requireAdmin();
    return clone(state.users);
  },
  async updateUserRole(id, role) {
    await delay();
    const me = requireAdmin();
    if (id === me.id) throw fail('Bạn không thể tự đổi quyền của chính mình.');
    const u = state.users.find((x) => x.id === id);
    if (!u) throw fail('Không tìm thấy người dùng.', 404);
    u.role = role;
    return clone(u);
  },
  async stats() {
    await delay();
    requireAdmin();
    const borrowedNow = state.borrowings
      .filter((b) => b.status === 'APPROVED')
      .reduce((s, b) => s + b.items.reduce((x, i) => x + i.quantity, 0), 0);
    const byCategory = state.categories.map((c) => ({
      name: c.name,
      books: state.books.filter((b) => b.categoryId === c.id).reduce((s, b) => s + b.quantity, 0),
    }));
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const count = state.borrowings.filter((b) => {
        const c = new Date(b.createdAt);
        return `${c.getFullYear()}-${c.getMonth()}` === key;
      }).length;
      months.push({ month: `T${d.getMonth() + 1}`, borrowings: count });
    }
    return {
      totalBooks: state.books.reduce((s, b) => s + b.quantity, 0),
      totalTitles: state.books.length,
      totalCategories: state.categories.length,
      totalUsers: state.users.length,
      borrowedBooks: borrowedNow,
      pendingBorrowings: state.borrowings.filter((b) => b.status === 'PENDING').length,
      overdueBorrowings: state.borrowings.filter((b) => b.status === 'APPROVED' && new Date(b.dueDate) < new Date()).length,
      byCategory,
      byMonth: months,
    };
  },
};
