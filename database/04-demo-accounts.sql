-- =====================================================================
-- TẠO SẴN 2 TÀI KHOẢN MẪU (đã xác nhận email) — chỉ dùng để thử nghiệm
--   Quản trị viên : admin@thuvien.test  / Admin@2026   (role ADMIN)
--   Bạn đọc       : docgia@thuvien.test / Docgia@2026  (role USER)
-- Chạy SAU 01-schema.sql. Chạy lại nhiều lần vẫn an toàn:
--   tài khoản đã có → đặt lại mật khẩu, xác nhận email, cập nhật quyền.
-- Muốn đổi email/mật khẩu: sửa ở cuối file VÀ sửa VITE_DEMO_* trong .env
-- =====================================================================

create or replace function pg_temp.upsert_demo_user(
  p_email text, p_password text, p_full_name text, p_role text
) returns void
language plpgsql
as $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(p_email);

  if v_id is null then
    v_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
      lower(p_email), extensions.crypt(p_password, extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', p_full_name),
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_id, v_id::text,
      jsonb_build_object('sub', v_id::text, 'email', lower(p_email), 'email_verified', true),
      'email', now(), now(), now()
    );
  else
    -- Đã có (vd. đăng ký trước đó nhưng chưa xác nhận) → sửa lại cho dùng được
    update auth.users
       set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                                || jsonb_build_object('full_name', p_full_name),
           updated_at = now()
     where id = v_id;
  end if;

  -- Trigger on_auth_user_created đã tạo profile; bảo đảm có và đúng quyền
  insert into public.profiles (id, email, full_name, role)
  values (v_id, lower(p_email), p_full_name, p_role)
  on conflict (id) do update
     set full_name = excluded.full_name,
         role      = excluded.role;
end;
$$;

select pg_temp.upsert_demo_user('admin@thuvien.test',  'Admin@2026',  'Quản trị viên', 'ADMIN');
select pg_temp.upsert_demo_user('docgia@thuvien.test', 'Docgia@2026', 'Bạn đọc mẫu',   'USER');

-- Kiểm tra kết quả: phải thấy 2 dòng, cột confirmed = true
select p.email, p.full_name, p.role, (u.email_confirmed_at is not null) as confirmed
from public.profiles p
join auth.users u on u.id = p.id
where p.email in ('admin@thuvien.test', 'docgia@thuvien.test')
order by p.role;
