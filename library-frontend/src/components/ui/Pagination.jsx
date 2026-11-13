import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motionTokens } from '../motion/tokens';

/** page bắt đầu từ 0 (giống Spring Data). Ô trang hiện tại có highlight trượt. */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const add = (p) => pages.push(p);
  const start = Math.max(0, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 0) add(0);
  if (start > 1) add('…l');
  for (let p = start; p <= end; p++) add(p);
  if (end < totalPages - 2) add('…r');
  if (end < totalPages - 1) add(totalPages - 1);

  const navBtn = 'grid size-10 place-items-center rounded-xl text-navy-600 transition-colors hover:bg-navy-100 disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Phân trang">
      <button type="button" className={navBtn} onClick={() => onChange(page - 1)} disabled={page === 0} aria-label="Trang trước">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="w-8 text-center text-navy-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`relative grid size-10 place-items-center rounded-xl text-sm font-medium transition-colors ${
              p === page ? 'text-white' : 'text-navy-700 hover:bg-navy-100'
            }`}
          >
            {p === page && (
              <motion.span layoutId="pagination-highlight" transition={motionTokens.selection} className="absolute inset-0 rounded-xl bg-navy-900" />
            )}
            <span className="relative">{p + 1}</span>
          </button>
        ),
      )}
      <button type="button" className={navBtn} onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} aria-label="Trang sau">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
