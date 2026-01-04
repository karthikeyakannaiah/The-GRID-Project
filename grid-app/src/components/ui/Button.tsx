import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles: Bold, uppercase, thick borders, sharp corners (rounded-none default config or explicit)
          'font-bold uppercase tracking-wider',
          'border-2 border-black',
          'px-6 py-3',
          'transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none',
          'shadow-[4px_4px_0px_0px_#000000]', // Hard shadow
          
          // Variants
          variant === 'primary' && 'bg-accent text-white hover:bg-opacity-90',
          variant === 'secondary' && 'bg-white text-ink hover:bg-gray-50',
          variant === 'danger' && 'bg-red-500 text-white hover:bg-opacity-90',
          
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
