import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-gray-400 flex items-center pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
              prefix ? 'pl-10' : 'pl-3.5',
              suffix ? 'pr-10' : 'pr-3.5',
              'py-2.5',
              className,
            )}
            {...rest}
          />
          {suffix && (
            <div className="absolute right-3 text-gray-400 flex items-center pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
