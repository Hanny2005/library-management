import { motion } from 'motion/react';
import { motionTokens } from '../motion/tokens';

/** Tabs với nền tab đang chọn trượt sang tab mới (spring.selection) */
export default function Tabs({ tabs, value, onChange, layoutId = 'tabs-highlight' }) {
  return (
    <div role="tablist" className="scrollbar-thin inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-navy-100/70 p-1">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              active ? 'text-navy-950' : 'text-navy-500 hover:text-navy-800'
            }`}
          >
            {active && <motion.span layoutId={layoutId} transition={motionTokens.selection} className="absolute inset-0 rounded-lg bg-white shadow-sm" />}
            <span className="relative">{t.label}</span>
            {t.count != null && (
              <span className={`relative rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-navy-900 text-white' : 'bg-navy-200/70 text-navy-600'}`}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
