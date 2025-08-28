import React from 'react';
import { cn } from '@/utils/cn';

const GestalisCard = React.forwardRef(({ 
  children, 
  variant = 'default',
  className, 
  ...props 
}, ref) => {
  const baseClasses = 'rounded-xl border transition-all duration-200 animate-fade-in';
  
  const variants = {
    default: 'bg-white border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border-gray-200 shadow-md hover:shadow-lg',
    primary: 'bg-gestalis-primary text-white border-gestalis-primary shadow-gestalis-primary',
    secondary: 'bg-gestalis-secondary text-white border-gestalis-secondary shadow-gestalis-secondary',
    accent: 'bg-gestalis-accent text-white border-gestalis-accent',
    neutral: 'bg-gestalis-neutral border-gray-300',
    outline: 'bg-transparent border-gestalis-primary text-gestalis-primary',
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const GestalisCardHeader = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

const GestalisCardTitle = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

const GestalisCardDescription = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
});

const GestalisCardContent = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

const GestalisCardFooter = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

GestalisCard.displayName = 'GestalisCard';
GestalisCardHeader.displayName = 'GestalisCardHeader';
GestalisCardTitle.displayName = 'GestalisCardTitle';
GestalisCardDescription.displayName = 'GestalisCardDescription';
GestalisCardContent.displayName = 'GestalisCardContent';
GestalisCardFooter.displayName = 'GestalisCardFooter';

export { 
  GestalisCard, 
  GestalisCardHeader, 
  GestalisCardTitle, 
  GestalisCardDescription, 
  GestalisCardContent, 
  GestalisCardFooter 
}; 