import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const STRENGTH = [
  { label: 'Rất yếu', color: 'bg-red-500' },
  { label: 'Yếu', color: 'bg-red-400' },
  { label: 'Trung bình', color: 'bg-amber-400' },
  { label: 'Khá', color: 'bg-brand-500' },
  { label: 'Mạnh', color: 'bg-emerald-500' },
];

export default function RegisterPage() {
  useDocumentTitle('Đăng ký');
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmSentTo, setConfirmSentTo] = useState('');

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.fullName.trim().length < 2) er.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Email không hợp lệ.';
    if (form.password.length < 8) er.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) er.password = 'Mật khẩu cần có cả chữ và số.';
    if (form.confirmPassword !== form.password) er.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { needsConfirmation } = await signUp({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (needsConfirmation) {
        setConfirmSentTo(form.email.trim());
        toast.info('Vui lòng mở email để xác nhận tài khoản.', 'Kiểm tra hộp thư');
      } else {
        toast.success('Tài khoản đã được tạo.', 'Đăng ký thành công');
        navigate('/', { replace: true });
      }
    } catch (err) {
      toast.error(err.message, 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (confirmSentTo) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <MailCheck className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-navy-950">Xác nhận email của bạn</h1>
        <p className="mt-2 text-sm text-navy-500">
          Chúng tôi đã gửi liên kết xác nhận tới <span className="font-semibold text-navy-900">{confirmSentTo}</span>. Sau khi xác nhận, bạn có thể đăng nhập.
        </p>
        <Link to="/login" className="mt-6 inline-flex h-11 items-center rounded-xl bg-navy-900 px-5 text-sm font-medium text-white hover:bg-navy-800">
          Tới trang đăng nhập
        </Link>
      </div>
    );
  }

  const strength = passwordStrength(form.password);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy-950">Tạo tài khoản</h1>
      <p className="mt-2 text-sm text-navy-500">Đăng ký miễn phí để mượn sách trực tuyến.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="Họ và tên" autoComplete="name" placeholder="Nguyễn Văn A" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" type="email" autoComplete="email" placeholder="ban@email.com" value={form.email} onChange={set('email')} error={errors.email} />
        <div>
          <FormField label="Mật khẩu" type="password" autoComplete="new-password" placeholder="Ít nhất 8 ký tự, có chữ và số" value={form.password} onChange={set('password')} error={errors.password} />
          {form.password && (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? STRENGTH[strength].color : 'bg-navy-100'}`} />
                ))}
              </div>
              <span className="w-20 text-right text-xs text-navy-500">{STRENGTH[strength].label}</span>
            </div>
          )}
        </div>
        <FormField label="Xác nhận mật khẩu" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        <Button type="submit" size="lg" icon={UserPlus} loading={loading} className="w-full">
          Đăng ký
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
