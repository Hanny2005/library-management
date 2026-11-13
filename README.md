# 📚 Thư viện Tri Thức — Library Management System

Website quản lý thư viện: bạn đọc tra cứu sách, gửi yêu cầu mượn và theo dõi hạn trả. Thủ thư (Admin) quản lý sách, thể loại, phiếu mượn và người dùng.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Auth-3FCF8E?logo=supabase&logoColor=white)

---

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ](#công-nghệ)
- [Kiến trúc](#kiến-trúc)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Tài khoản mẫu](#tài-khoản-mẫu)
- [Database](#database)
- [API (backend)](#api-backend)
- [Bảo mật](#bảo-mật)
- [Tiến độ](#tiến-độ)

---

## Tính năng

**Bạn đọc**
- Xem trang chủ: sách nổi bật, sách mới, danh mục, thống kê
- Tìm sách theo tên hoặc tác giả, lọc theo thể loại, sắp xếp, phân trang
- Xem chi tiết sách và số lượng còn lại
- Gửi yêu cầu mượn (chọn số lượng, số ngày mượn, ghi chú)
- Theo dõi phiếu đang mượn, chờ duyệt, lịch sử, hạn trả và cảnh báo quá hạn

**Quản trị viên (ADMIN)**
- Dashboard: tổng số sách, người dùng, sách đang mượn, phiếu chờ duyệt, biểu đồ
- Thêm, sửa, xoá sách và thể loại
- Duyệt, từ chối phiếu mượn và xác nhận trả sách
- Phân quyền người dùng (USER ↔ ADMIN)

**Quy tắc nghiệp vụ**
- Không mượn khi số lượng còn lại bằng 0, không mượn quá số còn lại
- Duyệt phiếu thì trừ số lượng còn lại; xác nhận trả thì cộng lại
- Không trả một phiếu đã trả; chỉ duyệt hoặc từ chối phiếu đang chờ
- Mọi cập nhật số lượng chạy trong transaction; database có ràng buộc `0 ≤ available_quantity ≤ quantity`

**Giao diện:** tông trắng, navy và xanh dương; responsive cho máy tính, tablet và điện thoại; có skeleton loading, thông báo thành công/lỗi và chuyển động nhẹ theo bộ token của [Animate UI](https://animate-ui.com) (tôn trọng cài đặt *giảm chuyển động* của hệ điều hành).

---

## Công nghệ

| Phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite 7, JavaScript, Tailwind CSS 4, React Router 7, Axios |
| UI | lucide-react (icon), Recharts (biểu đồ), Motion + Animate UI (chuyển động) |
| Backend | Java 21, Spring Boot 3 (REST API, Spring Security, Spring Data JPA) |
| Database | Supabase PostgreSQL |
| Xác thực | Supabase Auth (JWT), backend xác thực JWT và phân quyền USER/ADMIN |
| Môi trường | Windows, Visual Studio Code |

---

## Kiến trúc

```
┌──────────────────────┐   đăng nhập / đăng ký    ┌────────────────────────┐
│  Frontend React      │ ───────────────────────▶ │  Supabase Auth          │
│  (localhost:5173)    │ ◀──── access token (JWT) │                        │
└─────────┬────────────┘                          └────────────────────────┘
          │ Axios + "Authorization: Bearer <JWT>"
          ▼
┌──────────────────────┐   JDBC (transaction)     ┌────────────────────────┐
│  Backend Spring Boot │ ───────────────────────▶ │  Supabase PostgreSQL    │
│  (localhost:8080)    │                          │  5 bảng + RLS           │
│  kiểm tra JWT + quyền│                          └────────────────────────┘
└──────────────────────┘
```

- Frontend **không** đọc hay ghi bảng dữ liệu trực tiếp. Mọi thao tác đi qua backend.
- Backend lấy danh tính người dùng **từ JWT**, không tin `user_id` do frontend gửi lên.
- Ngoại lệ duy nhất: frontend được đọc **đúng dòng profile của chính mình** (RLS) để hiển thị tên và quyền.

---

## Cấu trúc thư mục

```
library-management/
├─ README.md                    ← file này
├─ CLAUDE.md                    ← ngữ cảnh ngắn cho Claude
├─ .claude/skills/library-management/SKILL.md   ← quy ước & cách làm việc với project
├─ database/                    ← script SQL chạy trong Supabase SQL Editor
│  ├─ 01-schema.sql             5 bảng, khoá, ràng buộc, trigger tạo profile, RLS
│  ├─ 02-seed.sql               6 thể loại + 12 sách ban đầu (tuỳ chọn)
│  ├─ 03-profile-read-own.sql   cho người dùng đọc profile của chính mình
│  └─ 04-demo-accounts.sql      tạo 2 tài khoản mẫu (chỉ để thử nghiệm)
├─ library-frontend/            ← React + Vite (xem README riêng bên trong)
│  ├─ src/
│  │  ├─ components/  ui · books · layout · admin · motion
│  │  ├─ pages/       Home, Books, BookDetail, Login, Register, MyBorrowings, admin/*
│  │  ├─ layouts/     MainLayout, AuthLayout
│  │  ├─ routes/      AppRoutes, ProtectedRoute, AdminRoute, GuestRoute
│  │  ├─ context/     AuthContext, ToastContext
│  │  ├─ services/    apiClient, supabaseClient, *Service, mappers, mockStore
│  │  ├─ hooks/       useAsync, useDebounce, useDocumentTitle
│  │  └─ utils/       format.js
│  ├─ .env.example
│  └─ chay-frontend.bat         ← nhấp đúp để cài và chạy trên Windows
└─ library-backend/             ← Spring Boot (Giai đoạn 2, sắp có)
```

---

## Cài đặt và chạy

### Yêu cầu

- [Node.js](https://nodejs.org) 20 LTS trở lên
- Một project [Supabase](https://supabase.com) (gói miễn phí là đủ)
- Java 21 + Maven (cho backend, từ Giai đoạn 2)

### 1. Chuẩn bị database trên Supabase

Vào Supabase → **SQL Editor → New query**, dán và chạy lần lượt:

| Thứ tự | File | Bắt buộc |
|---|---|---|
| 1 | `database/01-schema.sql` | ✅ |
| 2 | `database/02-seed.sql` | tuỳ chọn |
| 3 | `database/03-profile-read-own.sql` | ✅ |
| 4 | `database/04-demo-accounts.sql` | tuỳ chọn |

Khi đang phát triển, nên tắt xác nhận email: **Authentication → Sign In / Providers → Email → tắt *Confirm email***.

Các script chạy lại nhiều lần vẫn an toàn.

### 2. Cấu hình frontend

```powershell
cd library-frontend
Copy-Item .env.example .env
```

Mở `.env` và điền **Project URL** cùng **Publishable key** (Supabase → nút **Connect**):

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

> ⚠️ Chỉ dùng **publishable key**. Không đặt `service_role` / secret key hay mật khẩu database vào frontend.

### 3. Chạy

**Cách nhanh (Windows):** nhấp đúp `library-frontend/chay-frontend.bat`.

**Hoặc bằng lệnh:**

```powershell
cd library-frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # build production vào dist/
```

### Chế độ dữ liệu

| `VITE_USE_MOCK` | Ý nghĩa |
|---|---|
| `true` | Sách, phiếu mượn, thống kê lấy từ dữ liệu mẫu trong trình duyệt (F5 là mất). Đăng nhập vẫn qua Supabase nếu đã cấu hình. Đầu trang có dải xanh "Chế độ xem trước". |
| `false` | Mọi dữ liệu đi qua backend Spring Boot và lưu thật vào Supabase. |

---

## Tài khoản mẫu

Sau khi chạy `04-demo-accounts.sql`, trang Đăng nhập có nút **Dùng tài khoản mẫu**:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin@thuvien.test` | `Admin@2026` |
| Bạn đọc | `docgia@thuvien.test` | `Docgia@2026` |

> Chỉ dùng để thử nghiệm. Khi đưa web lên chạy thật: đổi mật khẩu hoặc xoá các tài khoản này, và đặt `VITE_SHOW_DEMO_ACCOUNTS=false` trong `.env`.

Cấp quyền Admin cho một tài khoản bất kỳ:

```sql
update public.profiles set role = 'ADMIN' where email = 'email@cua-ban.com';
```

---

## Database

5 bảng trong schema `public` (tên bảng và tên cột cố định, không đổi):

```
auth.users (Supabase)
   │ 1–1
profiles ─────────────┐ 1–n
 id · full_name · email · role (USER|ADMIN)
                      ▼
categories ──1–n──▶ books ◀──n–1── borrowing_items ──n–1──▶ borrowings
 id · name          id · title · author ·  id · borrowing_id ·       id · user_id · status ·
 · description      description · quantity · book_id · quantity      borrow_days · borrow_date ·
                    available_quantity ·                             due_date · return_date · note
                    category_id · cover_url
```

- `borrowings.status`: `PENDING → APPROVED → RETURNED` hoặc `PENDING → REJECTED`
- Khi người dùng đăng ký, trigger `on_auth_user_created` tự tạo dòng trong `profiles`
- Không lưu mật khẩu trong bảng nào; Supabase Auth quản lý (đã băm)

---

## API (backend)

Tiền tố `/api`. Mọi request kèm `Authorization: Bearer <Supabase JWT>`.

| Method | Endpoint | Quyền |
|---|---|---|
| GET | `/books?search=&categoryId=&page=&size=&sort=` | Công khai |
| GET | `/books/{id}` | Công khai |
| POST · PUT · DELETE | `/books`, `/books/{id}` | ADMIN |
| GET | `/categories` | Công khai |
| POST · PUT · DELETE | `/categories`, `/categories/{id}` | ADMIN |
| POST | `/borrowings` | USER |
| GET | `/borrowings/my` | USER |
| GET | `/borrowings?status=` | ADMIN |
| PUT | `/borrowings/{id}/approve` · `/reject` · `/return` | ADMIN |
| GET | `/me` | USER |
| GET | `/admin/stats` · `/admin/users` | ADMIN |
| PUT | `/admin/users/{id}/role` | ADMIN |

---

## Bảo mật

- Frontend chỉ chứa publishable key; file `.env` không đưa lên Git
- Backend xác thực JWT của Supabase và kiểm tra quyền ADMIN ở mọi endpoint quản trị (không chỉ ẩn nút ở frontend)
- Không tin `user_id` từ frontend; người mượn được xác định từ JWT
- RLS bật trên cả 5 bảng: không ai đọc hay ghi trực tiếp qua Data API (trừ đọc profile của chính mình)
- Ràng buộc ở database chặn số lượng âm hoặc vượt tổng, và chặn xoá thể loại hay sách đang được dùng
- Kiểm tra dữ liệu đầu vào ở cả frontend và backend

---

## Tiến độ

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 1 | Giao diện frontend & cấu trúc project | ✅ Xong |
| 2 | Backend Spring Boot | ⏳ |
| 3 | Kết nối Supabase PostgreSQL | 🟡 Đã có schema SQL |
| 4 | Supabase Auth + JWT | 🟡 Frontend xong, chờ backend |
| 5 | CRUD sách & thể loại (API thật) | ⏳ |
| 6 | Mượn & trả sách (transaction) | ⏳ |
| 7 | Admin Dashboard (API thật) | ⏳ |
| 8 | Kiểm thử toàn bộ | ⏳ |
