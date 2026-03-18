"use client";

import { Github } from "lucide-react";

import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";

export function SocialButton({
  label,
  provider,
  loading,
  onClick
}: {
  label: string;
  provider: "google" | "github";
  loading?: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      className="w-full justify-start gap-3 rounded-md"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : provider === "google" ? (
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-border-light text-[10px] text-text-body">
          G
        </span>
      ) : (
        <Github className="h-[18px] w-[18px] text-text-body" />
      )}
      <span>{label}</span>
    </Button>
  );
}
