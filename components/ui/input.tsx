import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  touched?: boolean;
  error?: string;
  appendIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      touched,
      error,
      value,
      appendIcon,
      containerClassName = "",
      inputClassName = "",
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", containerClassName)}>
        {label && (
          <label htmlFor={props.name} className="text-sm block font-medium mb-1">
            {label}
          </label>
        )}

        <div className="relative bg-white rounded-[5px] flex items-center">
          <input
            ref={ref}
            type={type}
            value={value}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              inputClassName,
              className
            )}
            {...props}
          />
          {appendIcon && <div className="absolute right-3">{appendIcon}</div>}
        </div>

        {touched && error && <span className="text-xs mt-1 text-red-500 block">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
