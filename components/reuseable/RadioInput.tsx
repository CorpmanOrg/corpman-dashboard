import React from "react";

interface RadioInputProps {
  name: string;
  value: string | number;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  touched?: boolean;
  error?: string;
  disabled?: boolean;
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  value,
  label,
  checked,
  onChange,
  touched,
  error,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="cursor-pointer h-5 w-5 appearance-none border-2 border-gray-400 rounded-full checked:bg-green-400 checked:border-gray-800 hover:border-gray-800 transition-all duration-200"
        />
        <span className="ml-2 text-sm text-black">{label}</span>
      </label>
      {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default RadioInput;
