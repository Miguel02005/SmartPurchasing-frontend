import React from 'react';

interface FormButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  type = 'button',
  disabled = false,
  onClick
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
      }`}
    >
      {children}
    </button>
  );
};

export default FormButton;