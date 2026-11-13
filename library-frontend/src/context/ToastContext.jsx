import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { motionTokens } from '../components/motion/tokens';

const ToastContext = createContext(null);

const TONES = {
  success: { icon: CheckCircle2, ring: 'border-emerald-200', iconClass: 'text-emerald-600' },
  error: { icon: XCircle, ring: 'border-red-200', iconClass: 'text-red-600' },
  info: { icon: Info, ring: 'border-brand-200', iconClass: 'text-brand-600' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, message, title) => {
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-3), { id, type, message, title }]);
      setTimeout(() => dismiss(id), type === 'error' ? 6000 : 4000);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (message, title = 'Thành công') => push('success', message, title),
      error: (message, title = 'Có lỗi xảy ra') => push('error', message, title),
      info: (message, title = 'Thông báo') => push('info', message, title),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const tone = TONES[t.type];
            const Icon = tone.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: motionTokens.toast }}
                exit={{ opacity: 0, scale: 0.96, transition: motionTokens.dismiss }}
                role={t.type === 'error' ? 'alert' : 'status'}
                className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-white p-4 shadow-lift ${tone.ring}`}
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${tone.iconClass}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-950">{t.title}</p>
                  <p className="mt-0.5 text-sm text-navy-600">{t.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="-m-1 rounded-md p-1 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-700"
                  aria-label="Đóng thông báo"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast phải được dùng bên trong <ToastProvider>');
  return ctx;
}
