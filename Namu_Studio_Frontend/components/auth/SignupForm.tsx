"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { getFriendlyAuthError } from "@/lib/auth/errorMessages";
import { useTranslation } from "@/lib/i18n/useTranslation";

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password) || /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  return Math.min(score, 4);
}

export function SignupForm(): JSX.Element {
  const { t, language } = useTranslation();
  const { signUp, loading } = useAuth();
  const { pushToast } = useStudio();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", terms: true });
  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const strengthColor = ["bg-border-light", "bg-status-error", "bg-status-warning", "bg-status-info", "bg-status-success"][strength] ?? "bg-border-light";
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] ?? "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");
    if (form.fullName.trim().length < 3) return setError(t("auth.nameShort"));
    if (!form.email.includes("@")) return setError(t("auth.invalidEmail"));
    if (form.password.length < 6) return setError(t("auth.passwordShort"));
    if (!form.terms) return setError(t("auth.termsRequired"));
    try {
      await signUp({ fullName: form.fullName, email: form.email, password: form.password });
      router.push("/workspace");
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
    <AuthCard className={error ? "animate-shake" : undefined}>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-text-dark">{t("auth.signupTitle")}</h1>
        <p className="mt-2 text-sm text-text-quiet">{t("auth.signupSubtitle")}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label={t("common.fullName")} value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
        <FormField label={t("common.email")} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <div>
          <FormField
            label={t("common.password")}
            type={showPassword ? "text" : "password"}
            value={form.password}
            error={error}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            rightSlot={
              <button type="button" className="text-text-quiet transition hover:text-brand-orange" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2, 3].map((segment) => (
              <div key={segment} className={`h-2 flex-1 rounded-full ${segment < strength ? strengthColor : "bg-border-light"}`} />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-text-quiet">{strengthLabel}</p>
        </div>
        <label className="flex items-start gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) => setForm((current) => ({ ...current, terms: event.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-border-light accent-[var(--orange)]"
          />
          <span>
            {t("auth.termsIntro")}
            <span className="text-brand-orange">{t("auth.terms")}</span>
            {t("auth.and")}
            <span className="text-brand-orange">{t("auth.privacy")}</span>
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full">
          {loading ? <Spinner className="h-[18px] w-[18px]" /> : null}
          {loading ? t("auth.creatingAccount") : t("common.createAccount")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-quiet">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="font-medium text-brand-orange">
          {t("common.signIn")}
        </Link>
      </p>
    </AuthCard>
  );
}
