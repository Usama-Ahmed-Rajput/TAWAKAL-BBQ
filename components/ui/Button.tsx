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
    'relative inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-300 rounded-none cursor-pointer overflow-hidden group select-none';

  const sizeStyles = {
    sm: 'px-5 py-2 text-xs tracking-widest min-h-[40px]',
    md: 'px-7 py-3 text-sm tracking-widest min-h-[48px]',
    lg: 'px-9 py-4 text-base tracking-widest min-h-[56px]',
  };

  const variantStyles = {
    primary:
      'bg-[#FF6A00] text-[#070707] hover:bg-[#FF9D32] shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_30px_rgba(255,157,50,0.6)] border border-[#FF6A00]',
    secondary:
      'bg-[#191919] text-[#F5F1EA] hover:bg-[#252525] hover:text-[#FF6A00] border border-[#FF6A00]/30 hover:border-[#FF6A00]/80 shadow-[0_0_15px_rgba(0,0,0,0.5)]',
    outline:
      'bg-transparent text-[#F5F1EA] border border-[#F5F1EA]/30 hover:border-[#FF6A00] hover:text-[#FF6A00]',
    ghost:
      'bg-transparent text-[#A7A7A7] hover:text-[#F5F1EA] hover:bg-[#191919]/50',
  };

  const content = (
    <>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      <span className="relative z-10 flex items-center gap-2">{content_children(children)}</span>
    </>
  );

  function content_children(c: React.ReactNode) {
    return c;
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        id={id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {content}
    </motion.button>
  );
};
