import React from 'react';

// Composant principal GestalisCard
export const GestalisCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className || ''}`}
    {...props}
  />
));
GestalisCard.displayName = 'GestalisCard';

// Composant GestalisCardHeader
export const GestalisCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 border-b border-gray-100 ${className || ''}`}
    {...props}
  />
));
GestalisCardHeader.displayName = 'GestalisCardHeader';

// Composant GestalisCardTitle
export const GestalisCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className || ''}`}
    {...props}
  />
));
GestalisCardTitle.displayName = 'GestalisCardTitle';

// Composant GestalisCardDescription
export const GestalisCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-600 ${className || ''}`}
    {...props}
  />
));
GestalisCardDescription.displayName = 'GestalisCardDescription';

// Composant GestalisCardContent
export const GestalisCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className || ''}`}
    {...props}
  />
));
GestalisCardContent.displayName = 'GestalisCardContent';

// Composant GestalisCardFooter
export const GestalisCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 ${className || ''}`}
    {...props}
  />
));
GestalisCardFooter.displayName = 'GestalisCardFooter'; 