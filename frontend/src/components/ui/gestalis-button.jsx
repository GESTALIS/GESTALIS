import React from 'react';
import { cn } from '@/utils/cn';

const GestalisButton = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gestalis-primary text-white hover:bg-gestalis-primary-light focus:ring-gestalis-primary shadow-gestalis-primary',
    secondary: 'bg-gestalis-secondary text-white hover:bg-gestalis-secondary-light focus:ring-gestalis-secondary shadow-gestalis-secondary',
    accent: 'bg-gestalis-accent text-white hover:bg-gestalis-accent-light focus:ring-gestalis-accent',
    tertiary: 'bg-gestalis-tertiary text-white hover:bg-gestalis-tertiary/90 focus:ring-gestalis-tertiary',
    outline: 'border-2 border-gestalis-primary text-gestalis-primary hover:bg-gestalis-primary hover:text-white focus:ring-gestalis-primary',
    ghost: 'text-gestalis-primary hover:bg-gestalis-primary/10 focus:ring-gestalis-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

GestalisButton.displayName = 'GestalisButton';

export { GestalisButton }; 