import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Thư viện Tri Thức` : 'Thư viện Tri Thức';
  }, [title]);
}
