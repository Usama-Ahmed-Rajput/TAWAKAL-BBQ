'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  onClick,
  className = '',
  id,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer overflow-hidden group select-none focus:outline-none focus:ring-2 focus:ring-[#C83B22] focus:ring-offset-2 focus:ring-offset-[#11100E]';

  const sizeStyles = {
    sm: 'px-5 py-2 text-xs tracking-wider min-h-[40px]',
    md: 'px-6 py-3 text-sm tracking-wider min-h-[48px]',
    lg: 'px-8 py-4 text-base tracking-wider min-h-[54px]',
  };

  const variantStyles = {
    primary:
      'bg-[#C83B22] text-[#F4EBDD] hover:bg-[#D94A2D] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(200,59,34,0.35)] hover:shadow-[0_6px_25px_rgba(217,74,45,0.5)] border border-[#C83B22]',
    secondary:
      'bg-[#1A1815] text-[#F4EBDD] hover:bg-[#24211D] hover:border-[#F4EBDD]/60 border border-[#F4EBDD]/25 shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:-translate-y-0.5',
    outline:
      'bg-transparent text-[#F4EBDD] border border-[#F4EBDD]/30 hover:border-[#C83B22] hover:text-[#C83B22] hover:bg-[#C83B22]/10',
    ghost:
      'bg-transparent text-[#B8B0A5] hover:text-[#F4EBDD] hover:bg-[#1A1815]',
  };

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        id={id}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      id={id}
      type={type}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {content}
    </motion.button>
  );
};
