---
name: library-management
description: Quy ước, kiến trúc và quy tắc nghiệp vụ của project Thư viện Tri Thức (React + Vite + Tailwind, Spring Boot 3, Supabase). Dùng khi thêm hoặc sửa tính năng, viết backend, viết SQL, sửa giao diện hoặc kiểm thử trong repo này.
---

# Thư viện Tri Thức — cách làm việc với project

Website quản lý thư viện: React 19 + Vite 7 + Tailwind 4 (JavaScript), backend Java 21 + Spring Boot 3, Supabase PostgreSQL + Supabase Auth. Người dùng làm việc trên **Windows**, dùng VS Code, giao tiếp bằng **tiếng Việt**.

## Nguyên tắc bắt buộc

1. **Không đổi tên bảng hoặc cột** đã có (xem `database/01-schema.sql`). Thêm cột mới phải bằng một file SQL mới, đánh số tiếp (`05-...sql`) và chạy lại được nhiều lần.
2. **Không tin `user_id` từ frontend.** Backend lấy người dùng từ JWT (`sub`). Request tạo phiếu mượn không có `userId`.
3. **Phân quyền ở backend.** `AdminRoute` ở frontend chỉ ẩn giao diện; mọi endpoint ADMIN phải kiểm tra quyền phía server.
4. **Bí mật:** frontend chỉ dùng publishable key. Không bao giờ đặt `service_role`/secret key hoặc mật khẩu database vào code, `.env.example`, README hay commit. Không yêu cầu người dùng gửi mật khẩu database; để họ tự điền vào biến môi trường.
5. **Không bịa thông tin kết nối.** Thiếu URL hay key thì hỏi người dùng.
6. **Code hoàn chỉnh**, không để TODO hay chức năng rỗng. Ghi rõ đường dẫn từng file khi hướng dẫn.
7. **Dữ liệu mẫu chỉ dùng khi `VITE_USE_MOCK=true`.** Khi `false`, không được có dữ liệu giả.

## Quy tắc nghiệp vụ mượn/trả

- Trạng thái phiếu: `PENDING → APPROVED → RETURNED`, hoặc `PENDING → REJECTED`.
- Tạo phiếu: mỗi sách phải có `1 ≤ quantity ≤ available_quantity`; sách hết thì từ chối.
- **Duyệt**: chỉ phiếu `PENDING`. Trong **một transaction**, khoá dòng sách (`SELECT … FOR UPDATE` / `@Lock(PESSIMISTIC_WRITE)`), kiểm tra đủ số lượng cho **tất cả** item, trừ `available_quantity`, đặt `borrow_date = now()` và `due_date = now() + borrow_days`. Thiếu một cuốn thì rollback toàn bộ.
- **Từ chối**: chỉ phiếu `PENDING`; không đổi số lượng.
- **Trả**: chỉ phiếu `APPROVED`. Phiếu đã `RETURNED` thì báo lỗi "đã trả trước đó". Cộng lại `available_quantity` (không vượt `quantity`) và đặt `return_date = now()`.
- Sửa sách: `quantity` mới không được nhỏ hơn số đang cho mượn (`quantity - available_quantity`); khi đó `available_quantity = quantity_mới - đang_mượn`.
- Không xoá sách đang nằm trong phiếu `PENDING`/`APPROVED`; không xoá thể loại còn sách.
- Database đã có ràng buộc `0 ≤ available_quantity ≤ quantity`, nên mọi lỗi logic sẽ bị DB chặn. Đừng gỡ ràng buộc này.

## Database (Supabase)

Các file trong `database/` được chạy theo thứ tự trong Supabase SQL Editor:
`01-schema.sql` (bắt buộc), `02-seed.sql`, `03-profile-read-own.sql` (bắt buộc), `04-demo-accounts.sql`.

| Bảng | Cột chính |
|---|---|
| `profiles` | `id uuid` (FK `auth.users`), `full_name`, `email`, `role` (`USER`/`ADMIN`), `created_at`, `updated_at` |
| `categories` | `id bigint identity`, `name` (unique, không phân biệt hoa thường), `description` |
| `books` | `id`, `title`, `author`, `description`, `quantity`, `available_quantity`, `category_id`, `cover_url` |
| `borrowings` | `id`, `user_id`, `status`, `borrow_days` (1–60), `borrow_date`, `due_date`, `return_date`, `note` |
| `borrowing_items` | `id`, `borrowing_id` (cascade), `book_id`, `quantity` (>0), unique (`borrowing_id`, `book_id`) |

- Trigger `on_auth_user_created` tạo profile khi đăng ký (lấy `full_name` từ `raw_user_meta_data`).
- RLS bật trên cả 5 bảng, không policy nào trừ `profiles_select_own` (đọc dòng của chính mình). Backend kết nối JDBC bằng tài khoản chủ bảng nên không bị RLS chặn.
- Backend nên dùng **Session pooler** (IPv4) của Supabase, vì Direct connection chỉ có IPv6.

## Hợp đồng API (frontend đã code sẵn theo đây)

Base: `VITE_API_BASE_URL` (mặc định `http://localhost:8080/api`). Header `Authorization: Bearer <access_token Supabase>` do `services/apiClient.js` tự gắn.

| Endpoint | Request | Response |
|---|---|---|
| `GET /books` | `search, categoryId, page (từ 0), size, sort` (`createdAt,desc` · `title,asc` · `quantity,desc`) | Spring `Page<BookDto>` |
| `GET /books/{id}` | — | `BookDto` |
| `POST/PUT /books[/{id}]` (ADMIN) | `{title, author, description, quantity, availableQuantity, categoryId, coverUrl}` | `BookDto` |
| `GET /categories` | — | `CategoryDto[]` (kèm `bookCount`) |
| `POST/PUT /categories[/{id}]` (ADMIN) | `{name, description}` | `CategoryDto` |
| `POST /borrowings` | `{items:[{bookId, quantity}], borrowDays, note}` | `BorrowingDto` |
| `GET /borrowings/my` | — | `BorrowingDto[]` |
| `GET /borrowings?status=` (ADMIN) | — | `BorrowingDto[]` |
| `PUT /borrowings/{id}/approve · reject · return` (ADMIN) | — | `BorrowingDto` |
| `GET /me` | — | `{id, fullName, email, role, createdAt}` |
| `GET /admin/stats` (ADMIN) | — | `{totalBooks, totalTitles, totalCategories, totalUsers, borrowedBooks, pendingBorrowings, overdueBorrowings, byCategory:[{name, books}], byMonth:[{month, borrowings}]}` |
| `GET /admin/users` · `PUT /admin/users/{id}/role` (ADMIN) | `{role}` | `UserDto[]` / `UserDto` |

- `BookDto`: `id, title, author, description, quantity, availableQuantity, categoryId, categoryName, coverUrl, createdAt`.
- `BorrowingDto`: `id, userId, userName, userEmail, status, borrowDate, dueDate, returnDate, createdAt, note, items:[{bookId, title, author, coverUrl, quantity}]`.
- Lỗi trả JSON `{ "message": "<tiếng Việt, hiển thị được cho người dùng>", "errors": {field: msg} }` với mã 400/401/403/404/409. `apiClient` hiển thị `message` lên toast.
- JSON dùng camelCase. `services/mappers.js` chấp nhận cả snake_case nhưng nên trả camelCase.

## Frontend — quy ước

- **Gọi dữ liệu chỉ qua `src/services/*Service.js`**. Mỗi hàm có nhánh `if (USE_MOCK) return mockX...` và nhánh gọi API thật. Khi thêm API mới, phải thêm cả hai nhánh (mock trong `mockStore.js` áp dụng đúng quy tắc nghiệp vụ).
- Đọc dữ liệu trong component bằng `useAsync(fn, deps)`. Luôn xử lý đủ 3 trạng thái: skeleton (`components/ui/Skeleton.jsx`), lỗi (`ErrorState` có nút Thử lại), rỗng (`EmptyState`).
- Thông báo dùng `useToast()` (`success`, `error`, `info`). Thao tác nguy hiểm dùng `ConfirmDialog`.
- Form dùng `FormField`, có validate phía client và thông báo tiếng Việt.
- Màu: token trong `src/index.css` (`navy-*`, `brand-*`, `paper`); class tiện ích `.card`, `.input`, `.label`, `.section-title`. Font: Be Vietnam Pro (chữ) và Lora (tiêu đề).
- Icon: `lucide-react`. Biểu đồ: `recharts`.
- Mọi chữ trên giao diện viết **tiếng Việt có dấu**.
- Trang mới: thêm route trong `routes/AppRoutes.jsx`, gọi `useDocumentTitle('...')`, thêm mục vào `components/layout/navItems.js` nếu cần.

### Chuyển động (Animate UI, mức subtle)

- Mọi giá trị lấy từ `src/components/motion/tokens.js` (`motionTokens.press · highlight · selection · dialog · dismiss · sheet · drawerOut · toast · enter · disclosure`, `motionScale.press 0.97 · pressSurface 0.985`). Không tự gõ spring hay duration mới.
- Nhấn: `whileTap={{ scale: motionScale.press }}`. Hover chỉ đổi màu, bóng hoặc viền; không scale nút khi hover.
- Mục đang chọn (sidebar, tabs, chip, phân trang) dùng `layoutId` với spring highlight/selection.
- Có `exit` thì phải có `AnimatePresence` phía trên và transition nằm trong `exit`.
- Chỉ animate `transform`/`opacity` (height chỉ cho khối mở/đóng). `MotionConfig reducedMotion="user"` trong `main.jsx` đã lo phần giảm chuyển động.

## Backend Spring Boot — quy ước (khi viết Giai đoạn 2+)

- Thư mục `library-backend/`, package gốc `com.thuvien.library`, gồm `controller · service · repository · entity · dto · config · exception · security`.
- Maven, Java 21, Spring Boot 3: `spring-boot-starter-web`, `-data-jpa`, `-validation`, `-security`, `-oauth2-resource-server`, `org.postgresql:postgresql`.
- Cấu hình bằng biến môi trường: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `SUPABASE_URL`. Có `application.yml` với `${...}` và một `.env.example`; không commit giá trị thật.
- Xác thực JWT Supabase qua JWKS `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`, kiểm tra `aud = authenticated`. Quyền đọc từ `profiles.role` theo `sub`, không lấy từ claim do client sửa được.
- `spring.jpa.hibernate.ddl-auto=validate` (schema do SQL quản lý, không để Hibernate tự sửa).
- Entity map đúng tên cột snake_case (`@Column(name = "available_quantity")`). DTO dùng `record` và Bean Validation (`@NotBlank`, `@Min`…).
- `@RestControllerAdvice` chuyển mọi lỗi thành `{message, errors}` tiếng Việt.
- CORS cho phép `http://localhost:5173`.
- Chạy trên Windows: `mvnw.cmd spring-boot:run`; cổng 8080.

## Chạy & kiểm tra trên Windows

- Frontend: nhấp đúp `library-frontend/chay-frontend.bat`, hoặc `npm install` rồi `npm run dev`.
- Build kiểm tra: `npm run build` phải không lỗi.
- Bật dữ liệu thật: `.env` → `VITE_USE_MOCK=false`. Sau khi sửa `.env` phải chạy lại `npm run dev`.
- Tài khoản mẫu: `admin@thuvien.test / Admin@2026` (ADMIN), `docgia@thuvien.test / Docgia@2026` (USER). Tạo bằng `database/04-demo-accounts.sql`.
- Checklist kiểm thử tay theo từng chức năng: `library-frontend/README.md`, mục 5.

## Khi kết thúc một thay đổi

1. Cập nhật bảng **Tiến độ** trong `README.md` gốc nếu xong một giai đoạn.
2. Thêm hoặc đổi endpoint thì cập nhật bảng API trong `README.md` và trong skill này.
3. Thêm file SQL thì cập nhật bảng thứ tự chạy trong `README.md`.
4. Kiểm tra `git status`: không có `.env`, `node_modules`, `dist`, `*.zip`.
