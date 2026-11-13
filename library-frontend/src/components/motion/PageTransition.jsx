import { motion } from 'motion/react';
import { motionTokens } from './tokens';

/**
 * Bọc nội dung mỗi trang: fade + trượt lên 8px khi vào, chỉ fade khi rời.
 * Khi người dùng bật "giảm chuyển động" ở hệ điều hành, MotionConfig
 * reducedMotion="user" (trong main.jsx) bỏ phần trượt, chỉ giữ fade.
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: motionTokens.enter }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      {children}
    </motion.div>
  );
}
