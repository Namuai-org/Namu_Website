"use client";

import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { useState } from "react";

import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { getFriendlyAuthError } from "@/lib/auth/errorMessages";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ForgotPasswordForm(): JSX.Element {
  const { t, language } = useTranslation();
  const { forgotPassword, loading } = useAuth();
  const { pushToast } = useStudio();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (caughtError) {
      const message = getFriendlyAuthError(
        caughtError instanceof Error ? caughtError.message : undefined,
        language
      );
      setError(message);
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
  };

  return (
    <div className="w-[min(400px,calc(100%-48px))] rounded-2xl bg-white px-10 py-12 shadow-lg">
      <Link href="/login" className="mb-6 inline-flex rounded-full p-2 text-text-quiet transition hover:text-brand-orange">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      {success ? (
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-status-success/10 text-status-success">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">{t("auth.resetSuccessTitle")}</h1>
          <p className="mt-2 text-sm text-text-quiet">{t("auth.resetSuccessBody", { email })}</p>
          <Button asChild variant="secondary" size="lg" className="mt-6 w-full">
            <Link href="/login">{t("common.backToSignIn")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-brand-pale text-brand-orange">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">{t("auth.forgotTitle")}</h1>
          <p className="mt-2 text-sm text-text-quiet">{t("auth.forgotSubtitle")}</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            <FormField label={t("common.email")} value={email} error={error} onChange={(event) => setEmail(event.target.value)} />
            <Button type="submit" size="lg" className="w-full">
              {loading ? <Spinner /> : null}
              {loading ? t("common.loading") : t("auth.sendResetLink")}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
