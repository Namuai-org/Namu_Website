import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "default" | "accent" | "invert";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  /** Drop the detached arrow tile and render a plain pill. */
  simple?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
};

const VARIANT_CLASS: Record<Variant, string> = {
  default: "",
  accent: "button--accent",
  invert: "button--invert",
};

export function Button({
  children,
  href,
  onClick,
  variant = "default",
  simple = false,
  className = "",
  type = "button",
  disabled,
  ...rest
}: Props) {
  const cls = [
    "button",
    VARIANT_CLASS[variant],
    simple ? "button--simple" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="button__pill">{children}</span>
      {!simple && (
        <span className="button__tile" aria-hidden="true">
          <ArrowRight />
        </span>
      )}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          {...rest}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      disabled={disabled}
      {...rest}
    >
      {inner}
    </button>
  );
}
