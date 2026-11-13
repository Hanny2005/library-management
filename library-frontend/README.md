# Thư viện Tri Thức — Frontend (Giai đoạn 1)

ReactJS + Vite + Tailwind CSS v4 + React Router + Axios + Supabase JS, chuyển động bằng Motion với token của Animate UI (mức **subtle**).

## 1. Yêu cầu

- **Node.js 20 LTS trở lên** (khuyên dùng 22): https://nodejs.org → tải bản LTS cho Windows, cài đặt mặc định.
- **Visual Studio Code** + các extension gợi ý trong `.vscode/extensions.json` (VS Code sẽ tự hỏi cài).

Kiểm tra trong PowerShell:

```powershell
node -v
npm -v
```

## 2. Cài đặt và chạy (Windows / PowerShell)

```powershell
# Giải nén file zip, ví dụ vào D:\library-management\
cd D:\library-management\library-frontend

# Cài thư viện (đọc package.json)
npm install

# Tạo file cấu hình (đã có sẵn .env trong zip; nếu thiếu thì chạy lệnh dưới)
Copy-Item .env.example .env

# Chạy môi trường phát triển → mở http://localhost:5173
npm run dev
```

Build bản production:

```powershell
npm run build
npm run preview
```

> Nếu PowerShell báo *"running scripts is disabled"*, chạy một lần:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Các thư viện đã dùng

| Thư viện | Vai trò |
|---|---|
| `react`, `react-dom` | Giao diện |
| `vite`, `@vitejs/plugin-react` | Dev server & build |
| `tailwindcss`, `@tailwindcss/vite` | CSS (Tailwind v4, cấu hình trong `src/index.css`) |
| `react-router-dom` | Định tuyến |
| `axios` | Gọi REST API Spring Boot (tự gắn JWT) |
| `@supabase/supabase-js` | Đăng nhập / đăng ký Supabase Auth |
| `motion`, `@animate-ui/react` | Chuyển động + bộ token của Animate UI |
| `lucide-react` | Biểu tượng |
| `recharts` | Biểu đồ Admin Dashboard |

## 3. Biến môi trường (`.env`)

| Biến | Ý nghĩa |
|---|---|
| `VITE_USE_MOCK` | `true` = dữ liệu xem trước (Giai đoạn 1). `false` = gọi API thật. |
| `VITE_API_BASE_URL` | Địa chỉ backend, mặc định `http://localhost:8080/api` |
| `VITE_SUPABASE_URL` | Project URL của Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key — **không** dùng service_role key |

- Để trống 2 biến Supabase → đăng nhập bằng tài khoản xem trước.
- Điền đủ → đăng nhập/đăng ký thật bằng Supabase Auth.
- Sau khi sửa `.env` phải **dừng (Ctrl+C) và chạy lại** `npm run dev`.

## 4. Cấu trúc thư mục

```
library-frontend/
├─ index.html, vite.config.js, package.json, .env.example
├─ public/favicon.svg
└─ src/
   ├─ main.jsx, App.jsx, index.css        # entry + design tokens (màu, font)
   ├─ assets/                              # logo
   ├─ components/
   │  ├─ ui/        Button, Modal, ConfirmDialog, FormField, Tabs, Pagination,
   │  │             Skeleton, Spinner, StatCard, StatusBadge, StateViews, Logo
   │  ├─ books/     BookCard, BookCover, BookGrid, BookRow, SearchBar,
   │  │             CategoryChips, BorrowingDetail
   │  ├─ layout/    SidebarNav, MobileSidebar, Topbar, UserMenu, Footer, PreviewBanner
   │  ├─ admin/     PageHeader, DataTable, BookFormModal
   │  └─ motion/    tokens.js (token Animate UI), PageTransition
   ├─ pages/        HomePage, BooksPage, BookDetailPage, LoginPage, RegisterPage,
   │                MyBorrowingsPage, NotFoundPage
   │  └─ admin/     AdminDashboardPage, AdminBooksPage, AdminCategoriesPage,
   │                AdminBorrowingsPage, AdminUsersPage
   ├─ layouts/      MainLayout (sidebar + topbar + footer), AuthLayout
   ├─ routes/       AppRoutes, ProtectedRoute, AdminRoute, GuestRoute
   ├─ context/      AuthContext, ToastContext
   ├─ hooks/        useAsync, useDebounce, useDocumentTitle
   ├─ services/     config, apiClient (axios), supabaseClient, authService,
   │                bookService, categoryService, borrowingService, adminService,
   │                mappers, mockStore (chỉ dùng khi VITE_USE_MOCK=true)
   └─ utils/        format.js
```

## 5. Kiểm tra từng chức năng (chế độ xem trước)

Tài khoản xem trước (mật khẩu `demo123`): `user@demo.local` (bạn đọc), `admin@demo.local` (quản trị).

| # | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1 | Mở `/` | Banner, 2 thẻ thống kê, dải "Sách nổi bật", "Mới cập nhật", lưới danh mục, footer |
| 2 | Thu nhỏ cửa sổ < 1024px | Sidebar ẩn; nút ☰ mở ngăn kéo trượt từ trái; Esc/chạm nền để đóng |
| 3 | Gõ "harari" ở thanh tìm kiếm topbar → Enter | Sang `/books?q=harari`, hiện Sapiens |
| 4 | `/books`: chọn chip "Công nghệ", đổi sắp xếp, chuyển trang | Lọc đúng, highlight chip/trang trượt sang |
| 5 | Hover card sách (chuột) | Card nâng nhẹ, bóng đậm, bìa zoom nhẹ |
| 6 | Bấm một sách | Trang chi tiết: bìa, tác giả, mô tả, thể loại, tổng/còn lại |
| 7 | Chưa đăng nhập bấm "Đăng nhập để mượn" | Sang `/login`, đăng nhập xong quay lại đúng sách |
| 8 | Đăng nhập sai mật khẩu | Khung lỗi đỏ "Email hoặc mật khẩu không đúng." |
| 9 | Mượn "Clean Code" (còn 0) | Không có form, báo "đã được mượn hết" |
| 10 | Mượn sách còn hàng | Nút +/− giới hạn theo số còn; gửi xong toast xanh, sang "Sách tôi mượn" tab Chờ duyệt |
| 11 | `/my-borrowings` | 3 thẻ thống kê, tab Đang mượn / Chờ duyệt / Lịch sử, bấm dòng mở chi tiết |
| 12 | Đăng ký với mật khẩu không khớp | Báo lỗi dưới ô "Xác nhận mật khẩu" |
| 13 | Đăng nhập `user@demo.local`, vào `/admin` | "Bạn không có quyền truy cập" |
| 14 | Đăng nhập `admin@demo.local` → Tổng quan | 4 thẻ thống kê, cảnh báo quá hạn, 2 biểu đồ, danh sách chờ duyệt |
| 15 | Quản lý sách: thêm / sửa / xoá | Toast thành công; xoá sách đang trong phiếu chưa xong → toast lỗi |
| 16 | Sửa tổng số lượng nhỏ hơn số đang mượn | Báo lỗi ngay trong form |
| 17 | Thể loại: xoá thể loại còn sách | Toast lỗi "vẫn còn sách thuộc thể loại này" |
| 18 | Phiếu mượn: Duyệt phiếu chờ | Trạng thái → Đang mượn; số "còn lại" của sách giảm |
| 19 | Phiếu đang mượn → "Đã trả" | Trạng thái → Đã trả; số "còn lại" tăng lại; không còn nút trả |
| 20 | Người dùng: đổi quyền người khác | Toast thành công; không có nút đổi quyền cho chính mình |
| 21 | Bật "Giảm chuyển động" của Windows (Settings → Accessibility → Visual effects → Animation effects: Off) | Trang/hộp thoại chỉ fade, không trượt/scale |

> Dữ liệu xem trước nằm trong bộ nhớ trình duyệt — tải lại trang (F5) sẽ về trạng thái ban đầu.

## 6. Chuyển động (Animate UI, mức subtle)

| Thành phần | Chuyển động | Token |
|---|---|---|
| Nút bấm | Nhấn co còn 0.97 | `spring.press` |
| Card sách / dòng phiếu | Nhấn 0.985; hover nâng 4px + bóng (CSS, chỉ thiết bị có chuột) | `spring.press` |
| Sidebar, chip thể loại, tabs, phân trang | Nền mục đang chọn trượt sang mục mới | `spring.highlight`, `spring.selection` |
| Chuyển trang | Fade + trượt lên 8px khi vào, chỉ fade khi rời | `transition.menu` |
| Hộp thoại | Scale từ 0.94 ở giữa màn hình, đóng nhanh | `spring.dialog`, `transition.dismiss` |
| Ngăn kéo di động | Trượt từ cạnh trái, ra nhanh | `transition.sheet`, `transition.drawerOut` |
| Thông báo | Nổi lên từ dưới | `spring.toast` |
| Menu tài khoản | Mọc từ nút (góc trên-phải), scale từ 0.9 | `transition.menu` |

Mọi giá trị nằm tập trung trong `src/components/motion/tokens.js`.
`MotionConfig reducedMotion="user"` trong `main.jsx` tôn trọng cài đặt giảm chuyển động.

## 7. Bảo mật đã áp dụng ở frontend

- Chỉ dùng publishable key; không có service_role key hay mật khẩu database trong code.
- `.env` nằm trong `.gitignore`.
- Không gửi `userId` khi tạo phiếu mượn — backend lấy từ JWT.
- `AdminRoute` chỉ ẩn giao diện; quyền ADMIN **bắt buộc** kiểm tra lại ở backend (Giai đoạn 4).

## 8. Tài khoản mẫu (nút "Dùng tài khoản mẫu" ở trang Đăng nhập)

Cấu hình trong `.env`:

```
VITE_SHOW_DEMO_ACCOUNTS=true
VITE_DEMO_ADMIN_EMAIL=admin@thuvien.test
VITE_DEMO_ADMIN_PASSWORD=Admin@2026
VITE_DEMO_USER_EMAIL=docgia@thuvien.test
VITE_DEMO_USER_PASSWORD=Docgia@2026
```

Khi đã nối Supabase, 2 tài khoản này phải được tạo **một lần**:
1. Supabase → Authentication → Sign In / Providers → Email → tắt **Confirm email**.
2. Trên web → Đăng ký: tạo `admin@thuvien.test` / `Admin@2026`, đăng xuất, rồi tạo `docgia@thuvien.test` / `Docgia@2026`.
3. Supabase → SQL Editor:
   ```sql
   update public.profiles set role = 'ADMIN' where email = 'admin@thuvien.test';
   ```
4. Từ đó trên trang Đăng nhập: **Dùng tài khoản mẫu → Quản trị viên / Bạn đọc** là vào ngay.

Đổi email/mật khẩu mẫu: sửa `.env` (phải trùng tài khoản đã tạo trên Supabase).
Ẩn nút khi đưa web lên chạy thật: `VITE_SHOW_DEMO_ACCOUNTS=false`.
