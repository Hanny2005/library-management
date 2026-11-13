import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { motionTokens } from '../components/motion/tokens';
import DemoAccounts from '../components/ui/DemoAccounts';
import { DEMO_ACCOUNTS } from '../services/config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  useDocumentTitle('Đăng nhập');
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
    setFormError('');
  };

  const validate = () => {
    const er = {};
    if (!form.email.trim()) er.email = 'Vui lòng nhập email.';
    else if (!EMAIL_RE.test(form.email.trim())) er.email = 'Email không hợp lệ.';
    if (!form.password) er.password = 'Vui lòng nhập mật khẩu.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const doLogin = async (email, password, demo = false) => {
    setLoading(true);
    setFormError('');
    try {
      const user = await signIn(email, password);
      toast.success(`Chào mừng ${user.fullName || 'bạn'} quay lại!`, 'Đăng nhập thành công');
      // Về trang người dùng định vào trước đó, mặc định là trang chủ
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      const msg = err.message || 'Đăng nhập thất bại.';
      setFormError(
        demo && /không đúng/.test(msg)
          ? `${msg} Tài khoản mẫu ${email} có thể chưa được tạo trên Supabase — hãy đăng ký nó một lần (xem README).`
          : msg,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await doLogin(form.email, form.password);
  };

  const handlePickDemo = async (acc) => {
    setForm({ email: acc.email, password: acc.password });
    setErrors({});
    await doLogin(acc.email, acc.password, true);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy-950">Đăng nhập</h1>
      <p className="mt-2 text-sm text-navy-500">Chào mừng bạn trở lại thư viện.</p>

      <AnimatePresence initial={false}>
        {formError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: motionTokens.disclosure }}
            exit={{ opacity: 0, height: 0, transition: motionTokens.dismiss }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {formError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="Email" type="email" autoComplete="email" placeholder="ban@email.com" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField label="Mật khẩu" type="password" autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" size="lg" icon={LogIn} loading={loading} className="w-full">
          Đăng nhập
        </Button>
      </form>

      <DemoAccounts accounts={DEMO_ACCOUNTS} onPick={handlePickDemo} disabled={loading} />

      <p className="mt-6 text-center text-sm text-navy-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
