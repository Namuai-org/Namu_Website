import { Button } from "./Button";

/**
 * "Learn more" for a model.
 *
 * With no destination yet this renders the pill's shape without the control —
 * a button that goes nowhere is worse than none, and a styled span is neither
 * focusable nor announced as something to press. Give the model an `href` in
 * lib/models.ts and the real Button takes over.
 */
export function LearnMore({ href, label }: { href?: string; label: string }) {
  if (href) {
    return (
      <Button href={href} simple>
        {label}
      </Button>
    );
  }

  return (
    <span className="button button--simple">
      <span className="button__pill">{label}</span>
    </span>
  );
}
