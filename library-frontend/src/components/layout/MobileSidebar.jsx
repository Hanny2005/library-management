import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { motionTokens } from '../motion/tokens';
import SidebarNav from './SidebarNav';

/** Ngăn kéo điều hướng cho tablet/điện thoại: trượt từ cạnh trái, Esc hoặc chạm nền để đóng */
export default function MobileSidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-navy-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: motionTokens.sheet }}
            exit={{ opacity: 0, transition: motionTokens.drawerOut }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0, transition: motionTokens.sheet }}
            exit={{ x: '-100%', transition: motionTokens.drawerOut }}
            aria-label="Menu"
          >
            <SidebarNav highlightId="mobile-sidebar-active" onNavigate={onClose} />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-3 rounded-lg p-2 text-navy-300 hover:bg-white/10 hover:text-white"
              aria-label="Đóng menu"
            >
              <X className="size-5" />
            </button>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
