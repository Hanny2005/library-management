-- =====================================================================
-- THƯ VIỆN TRI THỨC — SCHEMA DATABASE (Supabase PostgreSQL)
-- Chạy 1 lần trong Supabase: SQL Editor → New query → dán toàn bộ → Run
-- Script chạy lại nhiều lần vẫn an toàn (IF NOT EXISTS / OR REPLACE).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. profiles — hồ sơ người dùng, 1-1 với auth.users của Supabase Auth
--    Mật khẩu KHÔNG lưu ở đây; Supabase Auth tự quản lý (đã băm).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   varchar(150) not null default '',
  email       varchar(255) not null,
  role        varchar(10)  not null default 'USER'
              check (role in ('USER', 'ADMIN')),
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);

-- ---------------------------------------------------------------------
-- 2. categories — thể loại sách
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        varchar(100) not null,
  description varchar(500) not null default '',
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);
create unique index if not exists categories_name_unique
  on public.categories (lower(name));

-- ---------------------------------------------------------------------
-- 3. books — sách
--    available_quantity luôn nằm trong [0, quantity] (ràng buộc ở DB,
--    nên dù backend có lỗi cũng không thể mượn vượt số lượng thực tế).
-- ---------------------------------------------------------------------
create table if not exists public.books (
  id                  bigint generated always as identity primary key,
  title               varchar(255) not null,
  author              varchar(255) not null,
  description         text         not null default '',
  quantity            integer      not null default 0 check (quantity >= 0),
  available_quantity  integer      not null default 0,
  category_id         bigint       references public.categories (id) on delete restrict,
  cover_url           varchar(1000) not null default '',
  created_at          timestamptz  not null default now(),
  updated_at          timestamptz  not null default now(),
  constraint books_available_range
    check (available_quantity >= 0 and available_quantity <= quantity)
);
create index if not exists books_category_idx on public.books (category_id);
create index if not exists books_title_idx    on public.books (lower(title));
create index if not exists books_author_idx   on public.books (lower(author));

-- ---------------------------------------------------------------------
-- 4. borrowings — phiếu mượn
--    PENDING → APPROVED → RETURNED   hoặc   PENDING → REJECTED
-- ---------------------------------------------------------------------
create table if not exists public.borrowings (
  id           bigint generated always as identity primary key,
  user_id      uuid        not null references public.profiles (id) on delete restrict,
  status       varchar(10) not null default 'PENDING'
               check (status in ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED')),
  borrow_days  integer     not null default 14 check (borrow_days between 1 and 60),
  borrow_date  timestamptz,
  due_date     timestamptz,
  return_date  timestamptz,
  note         varchar(300) not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Phiếu đã duyệt/đã trả bắt buộc có ngày mượn & hạn trả; đã trả bắt buộc có ngày trả
  constraint borrowings_dates_by_status check (
    (status in ('PENDING', 'REJECTED'))
    or (status = 'APPROVED' and borrow_date is not null and due_date is not null)
    or (status = 'RETURNED' and borrow_date is not null and due_date is not null and return_date is not null)
  )
);
create index if not exists borrowings_user_idx   on public.borrowings (user_id);
create index if not exists borrowings_status_idx on public.borrowings (status);

-- ---------------------------------------------------------------------
-- 5. borrowing_items — chi tiết sách trong một phiếu mượn
-- ---------------------------------------------------------------------
create table if not exists public.borrowing_items (
  id            bigint generated always as identity primary key,
  borrowing_id  bigint  not null references public.borrowings (id) on delete cascade,
  book_id       bigint  not null references public.books (id) on delete restrict,
  quantity      integer not null default 1 check (quantity > 0),
  constraint borrowing_items_unique_book unique (borrowing_id, book_id)
);
create index if not exists borrowing_items_book_idx on public.borrowing_items (book_id);

-- ---------------------------------------------------------------------
-- Tự cập nhật cột updated_at khi sửa dòng
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles', 'categories', 'books', 'borrowings'] loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on public.%1$s
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Tự tạo profile khi có người đăng ký qua Supabase Auth
-- (frontend gửi full_name trong options.data khi signUp)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tạo profile cho các tài khoản đã đăng ký TRƯỚC khi chạy script này
insert into public.profiles (id, email, full_name)
select u.id, u.email,
       coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1))
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Bảo mật: bật Row Level Security, KHÔNG tạo policy nào.
-- → Không ai đọc/ghi trực tiếp các bảng này qua Supabase Data API bằng
--   publishable key. Mọi dữ liệu đi qua backend Spring Boot (kết nối
--   bằng JDBC với tài khoản chủ bảng nên không bị RLS chặn), nơi kiểm
--   tra JWT và quyền ADMIN.
-- ---------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.books           enable row level security;
alter table public.borrowings      enable row level security;
alter table public.borrowing_items enable row level security;
