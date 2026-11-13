import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/format';

export default function FormField({ label, error, hint, as = 'input', type = 'text', className, children, ...props }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    className: cn('input', error && 'input-error', as === 'textarea' && 'h-auto min-h-28 py-2.5', isPassword && 'pr-11'),
    ...props,
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {as === 'textarea' ? (
          <textarea {...common} />
        ) : as === 'select' ? (
          <select {...common}>{children}</select>
        ) : (
          <input type={isPassword && show ? 'text' : type} {...common} />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-navy-400 hover:text-navy-700"
            aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
