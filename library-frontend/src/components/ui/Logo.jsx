import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export default function Logo({ light = false, compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Thư viện Tri Thức — Trang chủ">
      <img src={logo} alt="" className="size-9 rounded-lg" />
      {!compact && (
        <span className="leading-tight">
          <span className={`block font-display text-lg font-bold ${light ? 'text-white' : 'text-navy-950'}`}>Tri Thức</span>
          <span className={`block text-[11px] font-medium tracking-wide uppercase ${light ? 'text-navy-300' : 'text-navy-400'}`}>
            Thư viện số
          </span>
        </span>
      )}
    </Link>
  );
}
