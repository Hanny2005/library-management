import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { BookOpenCheck, Clock3, Search } from 'lucide-react';
import Logo from '../components/ui/Logo';
import PageTransition from '../components/motion/PageTransition';
import PreviewBanner from '../components/layout/PreviewBanner';

const FEATURES = [
  { icon: Search, text: 'Tra cứu hàng nghìn đầu sách theo tên, tác giả, thể loại' },
  { icon: BookOpenCheck, text: 'Đăng ký mượn trực tuyến, nhận sách tại quầy' },
  { icon: Clock3, text: 'Theo dõi hạn trả và lịch sử mượn của bạn' },
];

export default function AuthLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <PreviewBanner />
      <div className="grid flex-1 lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col">
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <div className="absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-brand-900/30 to-transparent" aria-hidden />
          <div className="relative">
            <Logo light />
          </div>
          <div className="relative mt-auto max-w-md">
            <h1 className="font-display text-4xl leading-tight font-semibold">Mỗi cuốn sách là một cánh cửa mở ra thế giới.</h1>
            <ul className="mt-8 space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-navy-200">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10">
                    <Icon className="size-4 text-brand-300" aria-hidden />
                  </span>
                  <span className="pt-1.5 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
