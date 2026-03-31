"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { useState } from "react";

import { AuthFloatingField } from "@/components/auth/AuthFloatingField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { getFriendlyAuthError } from "@/lib/auth/errorMessages";
import { useTranslation } from "@/lib/i18n/useTranslation";

const pageEase = [0.16, 1, 0.3, 1] as const;

export function ForgotPasswordForm(): JSX.Element {
  const { t, language } = useTranslation();
  const { forgotPassword, loading } = useAuth();
  const { pushToast } = useStudio();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (caughtError) {
      const message = getFriendlyAuthError(caughtError instanceof Error ? caughtError.message : undefined, language);
      setError(message);
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
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
            <h1 className="font-website-display text-2xl font-bold tracking-tight text-namu-cream">{t("auth.resetSuccessTitle")}</h1>
            <p className="mt-3 font-website text-[14px] leading-relaxed text-namu-cream/[0.45]">{t("auth.resetSuccessBody", { email })}</p>
            <Link
              href="/login"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-[10px] bg-namu-orange font-website text-[15px] font-bold tracking-[0.01em] text-namu-black transition-[filter,box-shadow,transform] duration-[150ms] ease-out hover:brightness-[1.06] hover:shadow-[0_8px_28px_rgba(218,119,86,0.28)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)]"
            >
              {t("common.backToSignIn")}
            </Link>
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
              <Mail className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h1 className="font-website-display text-2xl font-bold tracking-tight text-namu-cream">{t("auth.forgotTitle")}</h1>
            <p className="mt-2 font-website text-[14px] leading-relaxed text-namu-cream/[0.42]">{t("auth.forgotSubtitle")}</p>

            <form className="mt-8 space-y-4" onSubmit={submit}>
              <AuthFloatingField
              label={t("common.email")}
              type="email"
              autoComplete="email"
              value={email}
              error={error}
              inputHint={t("auth.fieldHintEmail")}
              onChange={(event) => setEmail(event.target.value)}
            />
              <AuthPrimaryButton type="submit" loading={loading}>
                {t("auth.sendResetLink")}
              </AuthPrimaryButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
