"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

import { AuthFloatingField } from "@/components/auth/AuthFloatingField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { supabase } from "@/lib/supabase/client";

const pageEase = [0.16, 1, 0.3, 1] as const;

export function ResetPasswordForm(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("auth.passwordShort"));
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    window.setTimeout(() => router.push("/workspace"), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-2 rounded-lg font-website text-[13px] text-namu-cream/[0.45] transition-colors duration-150 ease-out hover:text-namu-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        {t("common.backToSignIn")}
      </Link>

      <AnimatePresence mode="wait" initial={false}>
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: pageEase }}
            className="text-center"
          >
            <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-namu-orange/25 bg-namu-orange/10 text-namu-orange">
              <Check className="h-7 w-7" strokeWidth={2.25} />
            </div>
            <h1 className="font-website-display text-2xl font-bold tracking-tight text-namu-cream">{t("auth.resetPasswordSuccessTitle")}</h1>
            <p className="mt-3 font-website text-[14px] leading-relaxed text-namu-cream/[0.45]">{t("auth.resetPasswordSuccessBody")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: pageEase }}
          >
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-namu-elevated bg-namu-void text-namu-orange">
              <KeyRound className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h1 className="font-website-display text-2xl font-bold tracking-tight text-namu-cream">{t("auth.resetPasswordTitle")}</h1>
            <p className="mt-2 font-website text-[14px] leading-relaxed text-namu-cream/[0.42]">{t("auth.resetPasswordSubtitle")}</p>

            <form className="mt-8 space-y-4" onSubmit={submit}>
              <AuthFloatingField
                label={t("auth.resetPasswordFieldLabel")}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                error={error}
                inputHint={t("auth.fieldHintPasswordNew")}
                onChange={(event) => setPassword(event.target.value)}
                rightSlot={
                  <button
                    type="button"
                    className="rounded-md p-1 text-namu-cream/[0.38] transition-colors duration-150 ease-out hover:text-namu-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)]"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <AuthPrimaryButton type="submit" loading={loading}>
                {t("auth.resetPasswordSubmit")}
              </AuthPrimaryButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
