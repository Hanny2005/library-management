// Đọc cấu hình từ file .env (Vite chỉ đưa ra frontend các biến bắt đầu bằng VITE_)
const env = import.meta.env;

export const USE_MOCK = String(env.VITE_USE_MOCK ?? 'true').toLowerCase() === 'true';
export const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/**
 * Tài khoản mẫu hiển thị ở trang Đăng nhập (nút "Dùng tài khoản mẫu").
 * - Chưa cấu hình Supabase: dùng tài khoản xem trước có sẵn trong mockStore.
 * - Đã cấu hình Supabase: đọc từ .env (VITE_DEMO_*). Các tài khoản này phải
 *   được TẠO TRƯỚC trên Supabase (đăng ký trên web) — xem README.
 * - Đặt VITE_SHOW_DEMO_ACCOUNTS=false để ẩn (khi đưa web lên chạy thật).
 * Lưu ý: giá trị trong .env có VITE_ sẽ nằm trong mã JS gửi xuống trình duyệt,
 * nên CHỈ dùng cho tài khoản thử nghiệm, không dùng mật khẩu thật.
 */
const SHOW_DEMO = String(env.VITE_SHOW_DEMO_ACCOUNTS ?? 'true').toLowerCase() !== 'false';

const fromEnv = [
  { role: 'ADMIN', label: 'Quản trị viên', email: env.VITE_DEMO_ADMIN_EMAIL, password: env.VITE_DEMO_ADMIN_PASSWORD },
  { role: 'USER', label: 'Bạn đọc', email: env.VITE_DEMO_USER_EMAIL, password: env.VITE_DEMO_USER_PASSWORD },
].filter((a) => a.email && a.password);

const preview = [
  { role: 'ADMIN', label: 'Quản trị viên', email: 'admin@demo.local', password: 'demo123' },
  { role: 'USER', label: 'Bạn đọc', email: 'user@demo.local', password: 'demo123' },
];

export const DEMO_ACCOUNTS = !SHOW_DEMO ? [] : SUPABASE_CONFIGURED ? fromEnv : preview;
