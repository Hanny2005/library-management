import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy-950 text-navy-300">
      <div className="grid gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            Thư viện số Tri Thức — tra cứu, đăng ký mượn và theo dõi sách mọi lúc, mọi nơi. Mở cửa cho tất cả bạn đọc.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Liên hệ</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden /> Thông tin địa chỉ thư viện</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden /> Số điện thoại thư viện</li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden /> Email liên hệ</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Giờ mở cửa</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden /> Thứ 2 – Thứ 6: 7:30 – 20:00</li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden /> Thứ 7 – CN: 8:00 – 17:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-xs text-navy-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Thư viện Tri Thức. Mọi quyền được bảo lưu.
      </div>
    </footer>
  );
}
