import { motion } from 'motion/react';
import { motionTokens } from '../motion/tokens';

/** Bộ lọc thể loại: chip đang chọn có nền navy trượt từ chip cũ sang chip mới */
export default function CategoryChips({ categories, value, onChange, layoutId = 'category-chip' }) {
  const options = [{ id: '', name: 'Tất cả' }, ...categories];
  return (
    <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="radiogroup" aria-label="Lọc theo thể loại">
      {options.map((c) => {
        const active = String(value ?? '') === String(c.id);
        return (
          <button
            key={c.id || 'all'}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.id)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? 'text-white' : 'bg-white text-navy-600 ring-1 ring-navy-200 ring-inset hover:bg-navy-50 hover:text-navy-900'
            }`}
          >
            {active && <motion.span layoutId={layoutId} transition={motionTokens.selection} className="absolute inset-0 rounded-full bg-navy-900" />}
            <span className="relative">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
