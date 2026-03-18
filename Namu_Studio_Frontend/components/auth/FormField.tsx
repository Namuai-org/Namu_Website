"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Input } from "@/components/shared/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightSlot?: React.ReactNode;
}

export function FormField({ label, error, rightSlot, ...props }: FormFieldProps): JSX.Element {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text-body">{label}</span>
      <div className="relative">
        <Input error={Boolean(error)} className={rightSlot ? "pr-11" : ""} {...props} />
        {rightSlot ? <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div> : null}
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-xs text-status-error"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </label>
  );
}
