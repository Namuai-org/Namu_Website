"use client";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useId, useState } from "react";

import { cn } from "@/lib/cn";

const fieldEase = [0.33, 1, 0.68, 1] as const;

/** Default sample email for forms (matches i18n `auth.fieldHintEmail`). */
export const AUTH_SAMPLE_EMAIL = "namuai@gmail.com";

export interface AuthFloatingFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "placeholder"> {
  label: string;
  error?: string;
  rightSlot?: React.ReactNode;
  className?: string;
  /**
   * Static sample text when the field is empty (shown as a muted native placeholder).
   * Label stays fixed above so it never overlaps the hint or typed value.
   */
  inputHint?: string;
  /** Fallback if `inputHint` is not set. */
  placeholder?: string;
}

export const AuthFloatingField = forwardRef<HTMLInputElement, AuthFloatingFieldProps>(function AuthFloatingField(
  { label, error, rightSlot, className, id: idProp, placeholder, inputHint, value, onFocus, onBlur, ...props },
  ref
) {
  const uid = useId();
  const id = idProp ?? `auth-field-${uid}`;
  const [focused, setFocused] = useState(false);

  const hintText = inputHint ?? placeholder;
  const showPlaceholder = Boolean(hintText);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[12px] border bg-namu-void/90 transition-[border-color,box-shadow] duration-200 ease-out",
          "border-white/[0.12]",
          focused && !error && "border-namu-orange/80 shadow-[0_0_0_3px_rgba(218,119,86,0.18)]",
          error && "border-namu-error shadow-[0_0_0_3px_rgba(224,82,82,0.12)]",
          error && focused && "border-namu-error"
        )}
      >
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-[10px] z-[2] font-website text-[12px] font-medium tracking-wide text-namu-cream/[0.5]"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={id}
          {...(value !== undefined ? { value } : {})}
          placeholder={showPlaceholder ? hintText : undefined}
          className={cn(
            "relative z-[1] min-h-[52px] w-full border-0 bg-transparent pb-3 pl-4 pr-4 pt-[26px] font-website text-[15px] text-namu-cream outline-none transition-colors duration-200 ease-out",
            "placeholder:text-namu-cream/[0.28] placeholder:transition-opacity placeholder:duration-200",
            "focus:ring-0 focus:ring-offset-0",
            rightSlot && "pr-12",
            !showPlaceholder && "placeholder:text-transparent"
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightSlot ? (
          <div className="absolute inset-y-0 right-3 z-[3] flex items-center text-namu-cream/[0.38]">{rightSlot}</div>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: fieldEase }}
            className="mt-1.5 font-website text-[13px] text-namu-error"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
});
