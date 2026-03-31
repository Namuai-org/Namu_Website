"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthFloatingField } from "@/components/auth/AuthFloatingField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { Spinner } from "@/components/shared/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { requestAuthEditorialRestart } from "@/lib/auth/authEditorial";
import { getFriendlyAuthError } from "@/lib/auth/errorMessages";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/lib/i18n/useTranslation";

const pageEase = [0.16, 1, 0.3, 1] as const;

function AppleGlyph(): JSX.Element {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 text-namu-cream" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.55-1.31 3.09-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleGlyph(): JSX.Element {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.25 1.6-1.7 4.7-5.5 4.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.7 3.9 14.6 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.25 0 8.7-3.7 8.7-8.7 0-.6-.06-1.17-.17-1.73H12z"
      />
      <path fill="#4285F4" d="M21.8 12.23c0-.82-.07-1.6-.2-2.35H12v4.45h5.5c-.24 1.28-.96 2.37-2.05 3.1v2.55h3.32c1.94-1.79 3.03-4.42 3.03-7.75z" />
      <path fill="#FBBC05" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.32-2.55c-.9.6-2.05.96-3.3.96-2.54 0-4.7-1.72-5.46-4.02H3.1v2.64C4.75 19.95 8.13 22 12 22z" />
      <path fill="#34A853" d="M6.54 13.97c-.2-.6-.32-1.24-.32-1.97s.12-1.37.32-1.97V7.39H3.1C2.4 8.75 2 10.33 2 12s.4 3.25 1.1 4.61l3.44-2.64z" />
    </svg>
  );
}

function emptyErrors(): Record<"email" | "password" | "fullName" | "terms", string> {
  return { email: "", password: "", fullName: "", terms: "" };
}

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password) || /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  return Math.min(score, 4);
}

const strengthBar = ["bg-namu-elevated", "bg-namu-error/80", "bg-namu-orange/55", "bg-namu-orange", "bg-namu-cream/35"] as const;

export function AuthenticationForms({ defaultMode }: { defaultMode: "signin" | "signup" }): JSX.Element {
  const { t, language } = useTranslation();
  const { signIn, signUp, signInWithProvider, loading } = useAuth();
  const { pushToast } = useStudio();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const [signInForm, setSignInForm] = useState({ email: "", password: "", remember: true });
  const [signUpForm, setSignUpForm] = useState({ fullName: "", email: "", password: "", terms: true });

  const strength = useMemo(() => getStrength(signUpForm.password), [signUpForm.password]);
  const strengthLabel = useMemo(() => {
    if (strength === 0) return "";
    const keys = ["", "passwordStrengthWeak", "passwordStrengthFair", "passwordStrengthGood", "passwordStrengthStrong"] as const;
    return t(`auth.${keys[strength]}`);
  }, [strength, t]);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const triggerShake = useCallback(() => {
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }, []);

  const clearErrors = useCallback(() => setErrors(emptyErrors()), []);

  const handleProviderSignIn = async (provider: "apple" | "google" | "github"): Promise<void> => {
    try {
      await signInWithProvider(provider);
    } catch (caughtError) {
      const message = getFriendlyAuthError(caughtError instanceof Error ? caughtError.message : undefined, language);
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
  };

  const onSignIn = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    clearErrors();
    if (!signInForm.email.includes("@")) {
      setErrors((e) => ({ ...e, email: t("auth.invalidEmail") }));
      triggerShake();
      return;
    }
    if (signInForm.password.length < 6) {
      setErrors((e) => ({ ...e, password: t("auth.passwordShort") }));
      triggerShake();
      return;
    }
    try {
      await signIn(signInForm.email, signInForm.password);
      router.push("/workspace");
    } catch (caughtError) {
      const message = getFriendlyAuthError(caughtError instanceof Error ? caughtError.message : undefined, language);
      setErrors((e) => ({ ...e, password: message }));
      triggerShake();
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
  };

  const onSignUp = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    clearErrors();
    if (signUpForm.fullName.trim().length < 3) {
      setErrors((e) => ({ ...e, fullName: t("auth.nameShort") }));
      triggerShake();
      return;
    }
    if (!signUpForm.email.includes("@")) {
      setErrors((e) => ({ ...e, email: t("auth.invalidEmail") }));
      triggerShake();
      return;
    }
    if (signUpForm.password.length < 6) {
      setErrors((e) => ({ ...e, password: t("auth.passwordShort") }));
      triggerShake();
      return;
    }
    if (!signUpForm.terms) {
      setErrors((e) => ({ ...e, terms: t("auth.termsRequired") }));
      triggerShake();
      return;
    }
    try {
      await signUp({ fullName: signUpForm.fullName, email: signUpForm.email, password: signUpForm.password });
      router.push("/workspace");
    } catch (caughtError) {
      const message = getFriendlyAuthError(caughtError instanceof Error ? caughtError.message : undefined, language);
      setErrors((e) => ({ ...e, password: message }));
      triggerShake();
      pushToast({ title: t("common.somethingWrong"), description: message, type: "error" });
    }
  };

  const switchMode = (next: "signin" | "signup"): void => {
    clearErrors();
    setMode(next);
    requestAuthEditorialRestart();
  };

  const oauthButtonClass =
    "flex h-12 w-full items-center gap-3 rounded-[10px] border border-white/[0.14] bg-namu-void/55 px-4 font-website text-[15px] text-namu-cream/[0.78] backdrop-blur-sm transition-[border-color,background-color,color,box-shadow] duration-[180ms] ease-out hover:border-namu-orange/45 hover:bg-namu-void/75 hover:text-namu-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)] disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <Link
        href="/"
        className="mb-8 flex w-fit shrink-0 outline-none transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)] lg:hidden"
      >
        <Image
          src="/brand/namu-navbar-logo-code.svg"
          alt="Namu"
          width={210}
          height={48}
          priority
          className="h-9 w-auto"
        />
      </Link>

      <LayoutGroup>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: pageEase }}
            className="mb-9 text-center lg:text-left"
          >
            <h1 className="font-website-display text-2xl font-bold tracking-tight text-namu-cream">
              {mode === "signin" ? t("auth.loginTitle") : t("auth.signupTitle")}
            </h1>
            <p className="mt-2 font-website text-[14px] leading-relaxed text-namu-cream/[0.45]">
              {mode === "signin" ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.form
          layout
          className={cn("flex flex-col gap-5", shake && "auth-form-shake")}
          onSubmit={mode === "signin" ? onSignIn : onSignUp}
          transition={{ layout: { duration: 0.28, ease: pageEase } }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {mode === "signup" ? (
              <motion.div
                key="signup-name"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: pageEase }}
              >
                <AuthFloatingField
                  label={t("common.fullName")}
                  name="fullName"
                  autoComplete="name"
                  value={signUpForm.fullName}
                  error={errors.fullName}
                  inputHint={t("auth.fieldHintFullName")}
                  onChange={(event) => setSignUpForm((c) => ({ ...c, fullName: event.target.value }))}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div layout>
            <AuthFloatingField
              label={t("common.email")}
              name="email"
              type="email"
              autoComplete={mode === "signin" ? "email" : "email"}
              value={mode === "signin" ? signInForm.email : signUpForm.email}
              error={errors.email}
              inputHint={t("auth.fieldHintEmail")}
              onChange={(event) =>
                mode === "signin"
                  ? setSignInForm((c) => ({ ...c, email: event.target.value }))
                  : setSignUpForm((c) => ({ ...c, email: event.target.value }))
              }
            />
          </motion.div>

          <motion.div layout>
            <AuthFloatingField
              label={t("common.password")}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={mode === "signin" ? signInForm.password : signUpForm.password}
              error={errors.password}
              inputHint={mode === "signin" ? t("auth.fieldHintPassword") : t("auth.fieldHintPasswordNew")}
              onChange={(event) =>
                mode === "signin"
                  ? setSignInForm((c) => ({ ...c, password: event.target.value }))
                  : setSignUpForm((c) => ({ ...c, password: event.target.value }))
              }
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
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {mode === "signup" ? (
              <motion.div
                key="signup-strength"
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.26, ease: pageEase }}
                className="overflow-hidden"
              >
                <div className="flex gap-1.5 pt-0.5">
                  {[0, 1, 2, 3].map((segment) => (
                    <div
                      key={segment}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-[180ms] ease-out",
                        segment < strength ? strengthBar[strength] : "bg-namu-elevated"
                      )}
                    />
                  ))}
                </div>
                {strength > 0 ? <p className="mt-1.5 font-website text-[11px] text-namu-cream/[0.35]">{strengthLabel}</p> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {mode === "signin" ? (
            <motion.div layout className="flex items-center justify-between gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2.5 font-website text-[13px] text-namu-cream/[0.55]">
                <input
                  type="checkbox"
                  checked={signInForm.remember}
                  onChange={(event) => setSignInForm((c) => ({ ...c, remember: event.target.checked }))}
                  className="auth-checkbox"
                />
                {t("common.rememberMe")}
              </label>
              <Link
                href="/forgot-password"
                className="shrink-0 font-website text-[13px] text-namu-orange transition-colors duration-150 ease-out hover:text-namu-cream focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)]"
              >
                {t("common.forgotPassword")}
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="pt-1">
              <label className="flex cursor-pointer items-start gap-2.5 font-website text-[13px] leading-relaxed text-namu-cream/[0.55]">
                <input
                  type="checkbox"
                  checked={signUpForm.terms}
                  onChange={(event) => setSignUpForm((c) => ({ ...c, terms: event.target.checked }))}
                  className="auth-checkbox mt-0.5"
                />
                <span>
                  {t("auth.termsIntro")}
                  <span className="text-namu-orange">{t("auth.terms")}</span>
                  {t("auth.and")}
                  <span className="text-namu-orange">{t("auth.privacy")}</span>
                </span>
              </label>
              <AnimatePresence initial={false}>
                {errors.terms ? (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
                    className="mt-2 font-website text-[13px] text-namu-error"
                    role="alert"
                  >
                    {errors.terms}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}

          <AuthPrimaryButton loading={loading}>{mode === "signin" ? t("common.signIn") : t("common.createAccount")}</AuthPrimaryButton>
        </motion.form>

        <motion.div layout className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.12]" />
          <span className="shrink-0 font-website text-[11px] uppercase tracking-[0.12em] text-namu-cream/[0.22]">{t("common.or")}</span>
          <div className="h-px flex-1 bg-white/[0.12]" />
        </motion.div>

        <motion.div layout className="flex flex-col gap-2">
          <button type="button" className={oauthButtonClass} disabled={loading} onClick={() => void handleProviderSignIn("apple")}>
            {loading ? <Spinner className="h-[18px] w-[18px] text-namu-cream/50" /> : <AppleGlyph />}
            <span>{t("common.apple")}</span>
          </button>
          <button type="button" className={oauthButtonClass} disabled={loading} onClick={() => void handleProviderSignIn("google")}>
            {loading ? <Spinner className="h-[18px] w-[18px] text-namu-cream/50" /> : <GoogleGlyph />}
            <span>{t("common.google")}</span>
          </button>
          <button type="button" className={oauthButtonClass} disabled={loading} onClick={() => void handleProviderSignIn("github")}>
            {loading ? (
              <Spinner className="h-[18px] w-[18px] text-namu-cream/50" />
            ) : (
              <svg className="h-[18px] w-[18px] text-namu-cream" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>{t("common.github")}</span>
          </button>
        </motion.div>

        <p className="mt-10 text-center font-website text-sm text-namu-cream/[0.42]">
          {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
          <button
            type="button"
            className="font-semibold text-namu-orange transition-colors duration-150 ease-out hover:text-namu-cream focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,18,26,0.88)]"
            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? t("common.signUp") : t("common.signIn")}
          </button>
        </p>
      </LayoutGroup>
    </div>
  );
}
