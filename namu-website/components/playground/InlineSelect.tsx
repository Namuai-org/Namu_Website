"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "@/components/editorial/icons";
import styles from "./playground.module.css";

type Props<T extends string> = {
  /** Announced to assistive tech; the trigger only shows the value. */
  label: string;
  value: T;
  options: readonly T[];
  /** Display text for a value, when the value is an id rather than a label. */
  labelFor?: (value: T) => string;
  onChange: (value: T) => void;
};

/**
 * The compact select inside the composer's settings pill.
 *
 * The shared Dropdown is built to stand on its own and fills its container;
 * three of them inside one pill overflow it. This is the same idea at composer
 * scale: the trigger shows only the current value, and the panel floats above
 * the composer rather than pushing it around.
 */
export function InlineSelect<T extends string>({
  label,
  value,
  options,
  labelFor,
  onChange,
}: Props<T>) {
  const show = (v: T) => labelFor?.(v) ?? v;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

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
    <div ref={rootRef} className={styles.inlineSelect}>
      <button
        type="button"
        className={styles.inlineTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${show(value)}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.inlineValue}>{show(value)}</span>
        <ChevronDown
          className={`${styles.inlineChevron} ${open ? styles.inlineChevronUp : ""}`}
        />
      </button>

      {open && (
        <div id={id} role="listbox" aria-label={label} className={styles.inlinePanel}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className={`${styles.inlineOption} ${
                option === value ? styles.inlineOptionActive : ""
              }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {show(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
