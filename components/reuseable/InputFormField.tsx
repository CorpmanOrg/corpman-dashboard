import React, { InputHTMLAttributes, ReactNode } from "react";
import { InputFormFieldProps } from "@/types/types";

const InputFormField: React.FC<InputFormFieldProps> = ({
  type = "text",
  touched,
  error,
  label,
  value,
  disabled,
  appendIcon,
  maxLength,
  containerClassName = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label htmlFor="name" className="text-sm block font-medium">
          {label}
        </label>
      )}
      <div></div>
    </div>
  );
};

export default InputFormField;
