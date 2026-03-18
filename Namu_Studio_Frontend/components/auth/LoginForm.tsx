"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { SocialButton } from "@/components/auth/SocialButton";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { getFriendlyAuthError } from "@/lib/auth/errorMessages";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function LoginForm(): JSX.Element {
  const { t, language } = useTranslation();
  const { signIn, signInWithProvider, loading } = useAuth();
  const { pushToast } = useStudio();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const handleProviderSignIn = async (provider: "google" | "github"): Promise<void> => {
    try {
      await signInWithProvider(provider);
    } catch (caughtError) {
      const message = getFriendlyAuthError(
        caughtError instanceof Error ? caughtError.message : undefined,
        language
      );
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError(t("auth.invalidEmail"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.passwordShort"));
      return;
    }
    try {
      await signIn(form.email, form.password);
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
        <h1 className="text-[28px] font-bold text-text-dark">{t("auth.loginTitle")}</h1>
        <p className="mt-2 text-sm text-text-quiet">{t("auth.loginSubtitle")}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label={t("common.email")}
          placeholder="your@email.com"
          value={form.email}
          error={error.includes("email") ? error : ""}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <FormField
          label={t("common.password")}
          type={showPassword ? "text" : "password"}
          value={form.password}
          error={error && !error.includes("email") ? error : ""}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          rightSlot={
            <button type="button" className="text-text-quiet transition hover:text-brand-orange" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-body">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))}
              className="h-4 w-4 rounded border-border-light accent-[var(--orange)]"
            />
            {t("common.rememberMe")}
          </label>
          <Link href="/forgot-password" className="text-brand-orange transition hover:underline">
            {t("common.forgotPassword")}
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full">
          {loading ? <Spinner className="h-[18px] w-[18px]" /> : null}
          {loading ? t("auth.signingIn") : t("common.signIn")}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-text-muted">
        <div className="h-px flex-1 bg-border-light" />
        <span>{t("common.or")}</span>
        <div className="h-px flex-1 bg-border-light" />
      </div>
      <div className="space-y-2">
        <SocialButton label={t("common.google")} provider="google" loading={loading} onClick={() => void handleProviderSignIn("google")} />
        <SocialButton label={t("common.github")} provider="github" loading={loading} onClick={() => void handleProviderSignIn("github")} />
      </div>
      <p className="mt-6 text-center text-sm text-text-quiet">
        {t("auth.noAccount")}{" "}
        <Link href="/signup" className="font-medium text-brand-orange">
          {t("common.signUp")}
        </Link>
      </p>
    </AuthCard>
  );
}
