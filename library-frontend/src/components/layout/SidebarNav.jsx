import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motionTokens } from '../motion/tokens';
import { ADMIN_NAV, MAIN_NAV } from './navItems';
import Logo from '../ui/Logo';

function NavItem({ item, highlightId, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'text-white' : 'text-navy-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span layoutId={highlightId} transition={motionTokens.highlight} className="absolute inset-0 rounded-xl bg-brand-600 shadow-lg shadow-brand-900/40" />
          )}
          <Icon className="relative size-[18px]" aria-hidden />
          <span className="relative">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

/** Nội dung sidebar — dùng chung cho bản desktop và ngăn kéo di động */
export default function SidebarNav({ highlightId = 'sidebar-active', onNavigate }) {
  const { isAuthenticated, isAdmin, user, signOut } = useAuth();

  return (
    <div className="flex h-full flex-col bg-navy-950 text-white">
      <div className="px-5 pt-6 pb-5">
        <Logo light />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4" aria-label="Điều hướng chính">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-navy-500 uppercase">Khám phá</p>
          {MAIN_NAV.filter((i) => !i.auth || isAuthenticated).map((item) => (
            <NavItem key={item.to} item={item} highlightId={highlightId} onNavigate={onNavigate} />
          ))}
        </div>

        {isAdmin && (
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 px-3 pb-1 text-[11px] font-semibold tracking-wider text-navy-500 uppercase">
              <ShieldCheck className="size-3.5" aria-hidden /> Quản trị
            </p>
            {ADMIN_NAV.map((item) => (
              <NavItem key={item.to} item={item} highlightId={highlightId} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold">
              {(user.fullName || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.fullName || 'Bạn đọc'}</p>
              <p className="truncate text-xs text-navy-400">{isAdmin ? 'Quản trị viên' : 'Bạn đọc'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigate?.();
                signOut();
              }}
              className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/15"
          >
            <LogIn className="size-4" aria-hidden /> Đăng nhập
          </NavLink>
        )}
      </div>
    </div>
  );
}
