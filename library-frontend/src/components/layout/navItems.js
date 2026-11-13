import { BookCopy, BookMarked, ClipboardList, Home, LayoutDashboard, Library, Tags, Users } from 'lucide-react';

export const MAIN_NAV = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/books', label: 'Kho sách', icon: Library },
  { to: '/my-borrowings', label: 'Sách tôi mượn', icon: BookMarked, auth: true },
];

export const ADMIN_NAV = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/admin/books', label: 'Quản lý sách', icon: BookCopy },
  { to: '/admin/categories', label: 'Thể loại', icon: Tags },
  { to: '/admin/borrowings', label: 'Phiếu mượn', icon: ClipboardList },
  { to: '/admin/users', label: 'Người dùng', icon: Users },
];
