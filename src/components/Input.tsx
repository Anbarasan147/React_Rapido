import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefixText?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  prefixText,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center gap-3 bg-[#16161B] border rounded-2xl px-4 py-3.5 transition-all duration-200
          ${error ? 'border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/20' : 'border-[#24242B] focus-within:border-[#FFE600] focus-within:ring-2 focus-within:ring-amber-500/20'}
        `}
      >
        {icon && <div className="text-[#8E8E93] flex-shrink-0">{icon}</div>}
        {prefixText && (
          <span className="text-white font-medium pr-2 border-r border-[#24242B]">
            {prefixText}
          </span>
        )}
        <input
          id={id}
          className={`bg-transparent text-white text-base w-full focus:outline-none placeholder-[#545458] ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 font-medium pl-1">{error}</span>}
    </div>
  );
};
export default Input;
