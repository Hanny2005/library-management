-- =====================================================================
-- Cho phép người dùng đã đăng nhập ĐỌC dòng profile của CHÍNH MÌNH.
-- (để web hiển thị đúng họ tên và quyền USER/ADMIN)
-- Không cho sửa, không cho đọc dòng của người khác.
-- Chạy SAU 01-schema.sql. Chạy lại nhiều lần vẫn an toàn.
-- =====================================================================
drop policy if exists "profiles_select_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);
