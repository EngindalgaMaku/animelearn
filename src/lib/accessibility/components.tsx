"use client";

import React from "react";

// Accessibility components placeholder

export function SkipLinks() {
  return null;
}

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export function LiveRegion({
  announcement,
  priority = "polite"
}: {
  announcement?: string;
  priority?: "polite" | "assertive"
}) {
  return announcement ? (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  ) : null;
}

export function FocusTrap({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    isLoading?: boolean;
    loadingText?: string;
  }
>(function AccessibleButton({
  children,
  variant = "primary",
  isLoading,
  loadingText,
  className = "",
  ...props
}, ref) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
  };
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (loadingText || "Loading...") : children}
    </button>
  );
});

export function AccessibleField({
  children,
  label,
  name,
  type,
  required,
  error,
  description
}: {
  children?: React.ReactNode;
  label?: string;
  name?: string;
  type?: string;
  required?: boolean;
  error?: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function HighContrastToggle() {
  return <button>High Contrast</button>;
}

export function TextSizeControls() {
  return <div>Text Size Controls</div>;
}

export function KeyboardShortcutsHelp() {
  return <div>Keyboard Shortcuts</div>;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-semibold mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  showValue = true,
  className = "",
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const percentage = Math.round((value / max) * 100);
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}
