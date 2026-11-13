import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import SidebarNav from '../components/layout/SidebarNav';
import MobileSidebar from '../components/layout/MobileSidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import PreviewBanner from '../components/layout/PreviewBanner';
import PageTransition from '../components/motion/PageTransition';

/** Bố cục chính: sidebar cố định (desktop) + topbar + nội dung + footer */
export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav />
      </aside>
      <MobileSidebar open={menuOpen} onClose={closeMenu} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <PreviewBanner />
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>{outlet}</PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}
