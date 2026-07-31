"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "./icons";
import styles from "./dropdown.module.css";

export type DropdownOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** Shown on the closed trigger when nothing is chosen. */
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
};

/**
 * The panel opens over the trigger rather than below it: it is absolutely
 * positioned at top 0 and repeats the trigger row as an invisible spacer, so
 * the options line up directly beneath the button while the whole surface
 * reads as one sheet that grew downward.
 */
export function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${open ? styles.open : ""}`}
      data-open={open}
    >
      <div className={styles.triggerClip}>
        <button
          type="button"
          className={styles.trigger}
          id={`${id}-trigger`}
          aria-controls={`${id}-panel`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{current ? current.label : label}</span>
          <ChevronDown className={styles.chevron} />
        </button>
      </div>

      <div
        className={styles.panel}
        id={`${id}-panel`}
        role="radiogroup"
        aria-labelledby={`${id}-trigger`}
        hidden={!open}
      >
        {/* Invisible copy of the trigger, so the list starts below the button. */}
        <div className={styles.ghost} aria-hidden="true">
          <span>{current ? current.label : label}</span>
          <ChevronDown className={`${styles.chevron} ${styles.chevronUp}`} />
        </div>

        <div className={styles.options}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={opt.value === value}
              className={`${styles.option} ${
                opt.value === value ? styles.optionActive : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
