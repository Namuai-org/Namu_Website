"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Lets descendants (SplitText in particular) know they sit inside a
 * ScrollObject that has already entered the viewport, so they can reveal in
 * step with it instead of running their own observer.
 */
const InViewContext = createContext(false);

export const useParentInView = () => useContext(InViewContext);

type Props = {
  children: ReactNode;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Shrinks the viewport rect — a positive value delays the trigger. */
  rootMargin?: string;
  /** Reveal every time it re-enters rather than only once. */
  repeat?: boolean;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
};

export function ScrollObject({
  children,
  threshold = 0,
  rootMargin = "0px 0px -12% 0px",
  repeat = false,
  as: Tag = "div",
  className = "",
  style,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount reveals immediately rather than
    // waiting for a scroll that may never come.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, repeat]);

  return (
    <InViewContext.Provider value={inView}>
      <Tag
        ref={ref}
        id={id}
        className={`scroll-object ${inView ? "in-view" : ""} ${className}`.trim()}
        style={style}
      >
        {children}
      </Tag>
    </InViewContext.Provider>
  );
}
