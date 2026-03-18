"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full max-w-[380px]", className)}
    >
      {children}
    </motion.div>
  );
}
