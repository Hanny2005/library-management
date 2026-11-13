/**
 * Motion tokens — lấy từ Animate UI (@animate-ui/react/utils/motion).
 * Mỗi vai trò chuyển động có đúng một giá trị, dùng chung toàn app.
 * Giá trị dự phòng chỉ dùng nếu phiên bản package không có token đó.
 */
import * as AnimateUI from '@animate-ui/react/utils/motion';

const s = AnimateUI.spring ?? {};
const t = AnimateUI.transition ?? {};
const sc = AnimateUI.scale ?? {};

export const motionTokens = {
  // Phản hồi khi nhấn nút / card
  press: s.press ?? { type: 'spring', stiffness: 520, damping: 32, mass: 0.6 },
  // Thanh highlight trượt giữa các mục sidebar, chip, trang
  highlight: s.highlight ?? { type: 'spring', stiffness: 420, damping: 36 },
  selection: s.selection ?? { type: 'spring', stiffness: 460, damping: 36 },
  // Hộp thoại vào giữa màn hình
  dialog: s.dialog ?? { type: 'spring', stiffness: 380, damping: 30 },
  // Hộp thoại / sheet bị đóng: rời đi nhanh
  dismiss: t.dismiss ?? { duration: 0.16, ease: [0.4, 0, 1, 1] },
  // Sidebar di động trượt vào / ra
  sheet: t.sheet ?? { duration: 0.34, ease: [0.32, 0.72, 0, 1] },
  drawerOut: t.drawerOut ?? { duration: 0.2, ease: [0.4, 0, 1, 1] },
  // Thông báo (toast)
  toast: s.toast ?? { type: 'spring', stiffness: 400, damping: 32 },
  // Nội dung trang xuất hiện: ease-out ngắn
  enter: t.menu ?? { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  // Mở/thu gọn khối nội dung
  disclosure: t.disclosure ?? { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
};

export const motionScale = {
  press: 0.97,
  pressSurface: 0.985,
  dialog: sc.dialog ?? 0.94,
};
