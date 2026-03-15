import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'textarea' | 'email';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  hint?: string;
  showCharCount?: boolean;
  className?: string;
}

/**
 * Reusable form field component with built-in validation display
 * Supports text inputs and textareas with consistent styling
 */
export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  function FormField(
    {
      label,
      name,
      value,
      onChange,
      error,
      type = 'text',
      placeholder,
      required = false,
      disabled = false,
      maxLength,
      rows = 4,
      hint,
      showCharCount = false,
      className,
    },
    ref
  ) {
    const hasError = !!error;
    const inputId = `field-${name}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const baseInputClasses = clsx(
      'w-full px-4 py-2 border rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent',
      'transition-colors',
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300',
      disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
      type === 'textarea' && 'resize-none',
      className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            disabled={disabled}
            className={baseInputClasses}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className={baseInputClasses}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          />
        )}

        {/* Error/Hint/Character Count Row */}
        <div className="flex justify-between items-start min-h-[20px]">
          <div className="flex-1">
            {hasError ? (
              <p id={errorId} className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : hint ? (
              <span id={hintId} className="text-xs text-gray-400">
                {hint}
              </span>
            ) : null}
          </div>

          {showCharCount && maxLength && (
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
