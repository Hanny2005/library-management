import { FlaskConical } from 'lucide-react';
import { USE_MOCK } from '../../services/config';

/** Nhắc rõ khi app đang dùng dữ liệu xem trước, để không nhầm với dữ liệu thật */
export default function PreviewBanner() {
  if (!USE_MOCK) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-brand-600 px-4 py-1.5 text-center text-xs font-medium text-white">
      <FlaskConical className="size-3.5 shrink-0" aria-hidden />
      Đây là bài mẫu không áp dụng cho thương mại
    </div>
  );
}
