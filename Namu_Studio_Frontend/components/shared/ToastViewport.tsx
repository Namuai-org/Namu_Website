"use client";

import { useEffect } from "react";

import { ProgressBar } from "@/components/shared/ProgressBar";
import { useStudio } from "@/hooks/useStudio";

export function ToastViewport(): JSX.Element {
  const { toasts, removeToast } = useStudio();

  useEffect(() => {
    const timers = toasts.map((toast) => window.setTimeout(() => removeToast(toast.id), 4000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [removeToast, toasts]);

  return (
    <div className="namu-workspace-cream fixed right-4 top-4 z-[1200] space-y-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="studio-toast-frame w-80 p-4" style={{ color: "var(--text-primary)" }}>
          <div className="font-sans text-sm font-semibold">{toast.title}</div>
          <div className="mt-1 font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            {toast.description}
          </div>
          <div className="mt-3">
            <ProgressBar value={100} />
          </div>
        </div>
      ))}
    </div>
  );
}
