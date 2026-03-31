"use client";

import { cn } from "@/lib/cn";
import { Spinner } from "@/components/shared/Spinner";

interface AuthPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function AuthPrimaryButton({
  className,
  children,
  loading,
  disabled,
  type = "submit",
  ...props
}: AuthPrimaryButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        "relative flex h-12 w-full items-center justify-center overflow-hidden rounded-[10px] bg-namu-orange font-website text-[15px] font-bold tracking-[0.01em] text-namu-black shadow-none transition-[filter,box-shadow,transform] duration-[150ms] ease-out",
        "hover:brightness-[1.06] hover:shadow-[0_8px_28px_rgba(218,119,86,0.28)]",
        "active:scale-[0.98] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.9)]",
        (disabled || loading) && "pointer-events-none opacity-70",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="h-[18px] w-[18px] text-namu-black" />
          <span className="sr-only">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
