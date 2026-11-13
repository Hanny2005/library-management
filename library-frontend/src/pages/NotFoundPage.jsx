import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { EmptyState } from '../components/ui/StateViews';

export default function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang');
  return (
    <div className="card">
      <EmptyState
        icon={Compass}
        title="Không tìm thấy trang"
        description="Trang bạn tìm không tồn tại hoặc đã được di chuyển."
        action={
          <Link to="/" className="inline-flex h-10 items-center rounded-xl bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800">
            Về trang chủ
          </Link>
        }
      />
    </div>
  );
}
