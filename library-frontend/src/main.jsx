import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* reducedMotion="user": tôn trọng cài đặt "giảm chuyển động" của hệ điều hành —
        bỏ trượt/scale, chỉ giữ fade */}
    <MotionConfig reducedMotion="user">
      {/* basename = đường dẫn gốc ("/" trên máy, "/library-management" trên GitHub Pages) */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
