import { useState } from 'react';
import { BookOpen } from 'lucide-react';

// Màu nền dự phòng khi sách chưa có ảnh bìa hoặc ảnh lỗi
const PALETTES = [
  ['#142240', '#2563eb'],
  ['#1d2e52', '#60a5fa'],
  ['#2a3f6c', '#93c5fd'],
  ['#0c1730', '#3b82f6'],
];

export default function BookCover({ src, title, author, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const palette = PALETTES[(title?.length ?? 0) % PALETTES.length];

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col justify-between p-4 text-white ${className}`}
        style={{ background: `linear-gradient(150deg, ${palette[0]} 0%, ${palette[1]} 140%)` }}
        role="img"
        aria-label={`Bìa sách ${title}`}
      >
        <BookOpen className="size-5 opacity-70" aria-hidden />
        <div>
          <p className="line-clamp-3 font-display text-base leading-snug font-semibold">{title}</p>
          {author && <p className="mt-1 line-clamp-1 text-xs opacity-75">{author}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-navy-100 ${className}`}>
      <img
        src={src}
        alt={`Bìa sách ${title}`}
        loading="lazy"
        onLoad={(e) => {
          // Open Library trả ảnh 1x1 khi không có bìa → coi như lỗi
          if (e.currentTarget.naturalWidth < 10) setFailed(true);
          else setLoaded(true);
        }}
        onError={() => setFailed(true)}
        className={`size-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
