import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { motionTokens, motionScale } from '../motion/tokens';
import BookCover from './BookCover';
import { AvailabilityBadge } from '../ui/StatusBadge';

const MotionLink = motion.create(Link);

/**
 * Card sách:
 * - Hover (chỉ chuột/touchpad): card nâng 4px, đổ bóng sâu hơn, viền đậm hơn,
 *   ảnh bìa zoom nhẹ bên trong khung bo góc.
 * - Nhấn: scale 0.985 trên spring.press (phản hồi cho cả bàn phím lẫn chạm).
 */
export default function BookCard({ book }) {
  return (
    <MotionLink
      to={`/books/${book.id}`}
      whileTap={{ scale: motionScale.pressSurface }}
      transition={motionTokens.press}
      className="group card flex flex-col p-3 transition-[translate,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift"
    >
      <div className="overflow-hidden rounded-xl">
        <BookCover
          src={book.coverUrl}
          title={book.title}
          author={book.author}
          className="aspect-[2/3] w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <span className="text-[11px] font-semibold tracking-wide text-brand-600 uppercase">{book.categoryName}</span>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold text-navy-950">{book.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-navy-500">{book.author}</p>
        <div className="mt-auto pt-3">
          <AvailabilityBadge available={book.availableQuantity} total={book.quantity} />
        </div>
      </div>
    </MotionLink>
  );
}
