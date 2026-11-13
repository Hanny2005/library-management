import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BookMarked, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motionTokens } from '../motion/tokens';

/** Menu tài khoản ở góc phải topbar — mọc ra từ nút bấm (origin trên-phải) */
export default function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const initial = (user.fullName || user.email || '?').charAt(0).toUpperCase();
  const itemClass = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-navy-100/70"
      >
        <span className="grid size-8 place-items-center rounded-full bg-navy-900 text-sm font-semibold text-white">{initial}</span>
        <span className="hidden max-w-32 truncate text-sm font-medium text-navy-800 sm:block">{user.fullName || user.email}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={motionTokens.press} className="text-navy-400">
          <ChevronDown className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: motionTokens.enter }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] } }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 z-40 mt-2 w-60 rounded-xl border border-navy-100 bg-white p-1.5 shadow-lift"
          >
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-navy-950">{user.fullName}</p>
              <p className="truncate text-xs text-navy-500">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-navy-100" />
            <Link role="menuitem" to="/my-borrowings" className={itemClass} onClick={() => setOpen(false)}>
              <BookMarked className="size-4" /> Sách tôi mượn
            </Link>
            {isAdmin && (
              <Link role="menuitem" to="/admin" className={itemClass} onClick={() => setOpen(false)}>
                <LayoutDashboard className="size-4" /> Trang quản trị
              </Link>
            )}
            <div className="my-1 h-px bg-navy-100" />
            <button
              role="menuitem"
              type="button"
              className={`${itemClass} text-red-600 hover:bg-red-50 hover:text-red-700`}
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              <LogOut className="size-4" /> Đăng xuất
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
