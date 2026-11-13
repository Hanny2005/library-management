import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import { motionScale, motionTokens } from '../motion/tokens';

const ROLE_STYLE = {
  ADMIN: { icon: ShieldCheck, iconClass: 'bg-navy-900 text-white', hint: 'Toàn quyền: quản lý sách, thể loại, phiếu mượn, người dùng' },
  USER: { icon: UserRound, iconClass: 'bg-brand-50 text-brand-600', hint: 'Tìm sách, gửi yêu cầu mượn, xem lịch sử' },
};

/**
 * Nút "Dùng tài khoản mẫu" — bấm để mở 2 thẻ tài khoản; bấm thẻ để đăng nhập ngay.
 * onPick(account) trả Promise; thẻ đang đăng nhập hiện spinner.
 */
export default function DemoAccounts({ accounts, onPick, disabled }) {
  const [open, setOpen] = useState(false);
  const [busyEmail, setBusyEmail] = useState('');

  if (!accounts.length) return null;

  const pick = async (acc) => {
    setBusyEmail(acc.email);
    try {
      await onPick(acc);
    } finally {
      setBusyEmail('');
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3 text-xs text-navy-400" aria-hidden>
        <span className="h-px flex-1 bg-navy-200" />
        hoặc
        <span className="h-px flex-1 bg-navy-200" />
      </div>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="demo-accounts"
        whileTap={{ scale: motionScale.press }}
        transition={motionTokens.press}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white text-sm font-semibold text-navy-900 transition-colors hover:border-navy-300 hover:bg-navy-50"
      >
        Dùng tài khoản mẫu
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={motionTokens.press} className="text-navy-400">
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="demo-accounts"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: motionTokens.disclosure }}
            exit={{ height: 0, opacity: 0, transition: motionTokens.dismiss }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pt-3">
              {accounts.map((acc) => {
                const style = ROLE_STYLE[acc.role] ?? ROLE_STYLE.USER;
                const Icon = style.icon;
                const busy = busyEmail === acc.email;
                return (
                  <li key={acc.email}>
                    <motion.button
                      type="button"
                      onClick={() => pick(acc)}
                      disabled={disabled || Boolean(busyEmail)}
                      whileTap={{ scale: motionScale.pressSurface }}
                      transition={motionTokens.press}
                      className="flex w-full items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/40 disabled:cursor-wait disabled:opacity-70"
                    >
                      <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${style.iconClass}`}>
                        {busy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Icon className="size-5" aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy-950">{acc.label}</span>
                        <span className="block truncate text-xs text-navy-500">{acc.email}</span>
                        <span className="block truncate text-xs text-navy-400">{style.hint}</span>
                      </span>
                      <span className="hidden shrink-0 rounded-md bg-navy-50 px-2 py-1 font-mono text-[11px] text-navy-600 sm:block">
                        {acc.password}
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
