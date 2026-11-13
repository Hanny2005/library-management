import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../books/SearchBar';
import UserMenu from './UserMenu';
import Logo from '../ui/Logo';

export default function Topbar({ onOpenMenu }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');

  // Đồng bộ ô tìm kiếm với ?q= khi đang ở trang Kho sách
  useEffect(() => {
    setQuery(location.pathname === '/books' ? params.get('q') ?? '' : '');
  }, [location.pathname, params]);

  return (
    <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1 rounded-lg p-2 text-navy-700 hover:bg-navy-100 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="lg:hidden">
          <Logo compact />
        </div>

        <SearchBar
          className="max-w-xl flex-1"
          value={query}
          onChange={setQuery}
          onSubmit={(q) => navigate(q.trim() ? `/books?q=${encodeURIComponent(q.trim())}` : '/books')}
          placeholder="Tìm sách, tác giả..."
        />

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-100 sm:block">
                Đăng nhập
              </Link>
              <Link to="/register" className="rounded-xl bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
