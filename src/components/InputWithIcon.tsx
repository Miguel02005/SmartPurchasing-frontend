import React from 'react';
import { IconType } from 'react-icons/lib';

interface InputWithIconProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  // Icon to show on the left inside the input (as background or adjacent)
  // We'll render the icon as an absolute positioned element inside the input container
  // For simplicity, we'll use an inline SVG or lucide icon passed as children? Actually we'll accept a ReactNode for leftIcon and rightIcon.
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // For password toggle, we need a clickable icon that toggles visibility
  isPassword?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  leftIcon,
  rightIcon,
  isPassword = false,
  showPassword = false,
  toggleShowPassword,
}) => {
  const actualType = isPassword && !showPassword ? 'password' : 'text';

  return (
    <div className="space-y-1">
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={label.toLowerCase().replace(/\s/g, '-')}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWithIcon;