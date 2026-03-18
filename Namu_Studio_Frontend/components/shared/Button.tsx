"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md transition-all duration-base ease-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary: "bg-brand-orange text-white hover:bg-brand-hover hover:-translate-y-0.5 hover:shadow-orange",
        secondary: "border border-border bg-bg-input text-text-secondary hover:bg-bg-active",
        ghost: "text-text-muted hover:bg-bg-active hover:text-brand-orange",
        dark: "border border-border bg-bg-panel text-text-secondary hover:border-border-bright hover:bg-bg-elevated hover:text-text-primary",
        outlineOrange: "border border-brand-orange/30 bg-transparent text-brand-orange hover:bg-brand-orange/10"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-[46px] px-5 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps): JSX.Element {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
