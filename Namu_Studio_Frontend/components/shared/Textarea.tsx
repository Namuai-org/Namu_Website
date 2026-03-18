"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-bg-elevated px-3.5 py-3 text-sm text-text-primary outline-none transition-all duration-base ease-spring placeholder:text-border focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10",
        error && "border-status-error focus:border-status-error focus:ring-status-error/10",
        className
      )}
      {...props}
    />
  );
});
