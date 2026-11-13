import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { motionTokens, motionScale } from '../motion/tokens';

/**
 * Hộp thoại giữa màn hình.
 * - Vào: fade + scale từ 0.94 trên spring.dialog, luôn ở giữa.
 * - Ra (Esc, click nền, nút X): rời nhanh trên transition.dismiss.
 * - Khoá cuộn trang, giữ focus trong hộp thoại, trả focus khi đóng.
 */
export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current?.();
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => {
      const target = panelRef.current?.querySelector('[data-autofocus], input, textarea, select, button');
      target?.focus();
    }, 30);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-navy-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: motionTokens.enter }}
            exit={{ opacity: 0, transition: motionTokens.dismiss }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: motionScale.dialog }}
            animate={{ opacity: 1, scale: 1, transition: motionTokens.dialog }}
            exit={{ opacity: 0, scale: motionScale.dialog, transition: motionTokens.dismiss }}
            className={`relative flex max-h-[92vh] w-full ${width} flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-navy-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id={titleId} className="font-display text-lg font-semibold text-navy-950">
                  {title}
                </h2>
                {description && <p className="mt-0.5 text-sm text-navy-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-m-1.5 rounded-lg p-1.5 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-700"
                aria-label="Đóng"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-navy-100 bg-navy-50/50 px-5 py-3.5 sm:px-6">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
