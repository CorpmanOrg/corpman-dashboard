import * as React from "react";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  appendIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  formik?: FormikProps<any>;
  name: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      appendIcon,
      containerClassName = "",
      inputClassName = "",
      className,
      type = "text",
      formik,
      name,
      ...props
    },
    ref
  ) => {
    const value = formik ? formik.values[name] : props.value;
    const error = formik ? formik.touched[name] && formik.errors[name] : undefined;

    return (
      <div className={cn("relative", containerClassName)}>
        {label && (
          <label htmlFor={name} className="text-sm block font-medium mb-1">
            {label}
          </label>
        )}

        <div className="relative bg-white rounded-[5px] flex items-center">
          <input
            ref={ref}
            type={type}
            name={name}
            value={value}
            onChange={formik ? formik.handleChange : props.onChange}
            onBlur={formik ? formik.handleBlur : props.onBlur}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              inputClassName,
              className
            )}
            {...props}
          />
          {appendIcon && <div className="absolute right-3">{appendIcon}</div>}
        </div>

        {formik && error && typeof formik.errors[name] === "string" && (
          <span className="text-xs mt-1 text-red-500 block">{formik.errors[name]}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
