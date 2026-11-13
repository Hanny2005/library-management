import { supabase } from './supabaseClient';
import { USE_MOCK, SUPABASE_CONFIGURED } from './config';
import { mockAuth } from './mockStore';
import apiClient from './apiClient';
import { mapUser } from './mappers';

/** Chế độ xác thực: Supabase thật nếu đã cấu hình .env, nếu không thì tài khoản demo */
export const AUTH_MODE = SUPABASE_CONFIGURED ? 'supabase' : 'demo';

const DEMO_KEY = 'library.demoUserId';

function translateAuthError(error) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email hoặc mật khẩu không đúng.';
  if (msg.includes('email not confirmed')) return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.';
  if (msg.includes('already registered') || msg.includes('already been registered')) return 'Email này đã được đăng ký.';
  if (msg.includes('password should be')) return 'Mật khẩu chưa đủ mạnh (tối thiểu 6 ký tự).';
  if (msg.includes('rate limit')) return 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.';
  return error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

/** Đọc họ tên + quyền của chính mình từ bảng profiles (RLS chỉ cho đọc dòng của mình) */
async function readOwnProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapUser(data);
}

/**
 * Lấy hồ sơ (họ tên + quyền).
 * - Khi backend sẵn sàng (VITE_USE_MOCK=false): GET /api/me — quyền do backend quyết định.
 * - Trước đó: đọc từ bảng profiles qua Supabase; lỗi thì mặc định USER.
 * Lưu ý: quyền ở frontend chỉ để hiển thị giao diện; backend luôn kiểm tra lại.
 */
async function loadProfile(sbUser) {
  const fallback = {
    id: sbUser.id,
    email: sbUser.email,
    fullName: sbUser.user_metadata?.full_name || sbUser.email,
    role: 'USER',
  };
  if (!USE_MOCK) {
    try {
      const { data } = await apiClient.get('/me');
      return { ...fallback, ...mapUser(data) };
    } catch {
      /* backend chưa chạy → thử đọc profiles */
    }
  }
  const own = await readOwnProfile(sbUser.id);
  return own ? { ...fallback, ...own, fullName: own.fullName || fallback.fullName } : fallback;
}

export const authService = {
  async getCurrentUser() {
    if (AUTH_MODE === 'demo') {
      const id = localStorage.getItem(DEMO_KEY);
      return id ? mockAuth.getUser(id) : null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session?.user ? loadProfile(data.session.user) : null;
  },

  onChange(callback) {
    if (AUTH_MODE === 'demo') return () => {};
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      callback(session?.user ? await loadProfile(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  },

  async signIn(email, password) {
    if (AUTH_MODE === 'demo') {
      const user = await mockAuth.signIn(email, password);
      localStorage.setItem(DEMO_KEY, user.id);
      return user;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(translateAuthError(error));
    return loadProfile(data.user);
  },

  /** Trả về { user, needsConfirmation } */
  async signUp({ fullName, email, password }) {
    if (AUTH_MODE === 'demo') {
      const user = await mockAuth.signUp({ fullName, email });
      localStorage.setItem(DEMO_KEY, user.id);
      return { user, needsConfirmation: false };
    }
    // full_name được lưu vào raw_user_meta_data; trigger database (Giai đoạn 3)
    // sẽ tự tạo bản ghi trong bảng profiles từ thông tin này.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    if (error) throw new Error(translateAuthError(error));
    if (!data.session) return { user: null, needsConfirmation: true };
    return { user: await loadProfile(data.user), needsConfirmation: false };
  },

  async signOut() {
    if (AUTH_MODE === 'demo') {
      localStorage.removeItem(DEMO_KEY);
      return;
    }
    await supabase.auth.signOut();
  },
};
