import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_CONFIGURED } from './config';

/**
 * Supabase client cho frontend.
 * Chỉ dùng publishable (anon) key — key này được thiết kế để công khai,
 * quyền truy cập được bảo vệ bởi RLS và backend kiểm tra JWT.
 * Nếu chưa cấu hình .env, client = null và ứng dụng chạy chế độ xem trước.
 */
export const supabase = SUPABASE_CONFIGURED
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
