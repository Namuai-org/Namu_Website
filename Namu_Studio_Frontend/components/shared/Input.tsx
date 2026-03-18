"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-[var(--input-bg)] px-3.5 text-sm text-[var(--input-text)] outline-none transition-all duration-base ease-spring placeholder:text-[var(--input-placeholder)] focus:border-[var(--input-focus-border)] focus:ring-4 focus:ring-[var(--input-focus-shadow)]",
        error && "border-status-error focus:border-status-error focus:ring-status-error/10",
        className
      )}
      {...props}
    />
  );
});
