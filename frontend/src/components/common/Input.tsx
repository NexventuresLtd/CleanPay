import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = false, className, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "px-3 py-2 border rounded-lg transition-colors duration-200",
            "text-text-primary bg-bg-base",
            "placeholder:text-text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:bg-bg-muted disabled:cursor-not-allowed disabled:text-text-disabled",
            error ? "border-danger focus:ring-danger" : "border-border-base",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
