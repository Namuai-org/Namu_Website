"use client";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthContextValue, DeleteAccountResult, SignupPayload } from "@/lib/auth/authTypes";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import type { UserProfile } from "@/types";

const AuthContext = createContext<AuthContextValue | null>(null);

function clearNamuLocalStorage(): void {
  window.localStorage.removeItem("namu_theme");
  window.localStorage.removeItem("namu_language");
  window.localStorage.removeItem("namu_sidebar_expanded");
  window.localStorage.removeItem("namu_prefs_notify_complete");
}

function mapProfile(profile: Profile): UserProfile {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name ?? profile.email.split("@")[0] ?? "Namu User",
    avatarUrl: profile.avatar_url ?? undefined,
    theme: profile.theme,
    language: profile.language,
    onboardingComplete: profile.onboarding_complete
  };
}

async function getProfile(session: Session): Promise<UserProfile | null> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return existingProfile ? mapProfile(existingProfile as Profile) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const syncSession = async (session: Session | null): Promise<void> => {
      if (!mounted) return;
      if (!session) {
        setUser(null);
        setInitialized(true);
        return;
      }

      const profile = await getProfile(session);
      if (!mounted) return;
      setUser(profile);
      setInitialized(true);
    };

    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      await syncSession(session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      await syncSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      initialized,
      signIn: async (email, password) => {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          return data;
        } finally {
          setLoading(false);
        }
      },
      signUp: async ({ fullName, email, password }: SignupPayload) => {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName }
            }
          });
          if (error) throw error;
          return data;
        } finally {
          setLoading(false);
        }
      },
      signInWithProvider: async (provider) => {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });
          if (error) throw error;
          return data;
        } finally {
          setLoading(false);
        }
      },
      forgotPassword: async (email) => {
        setLoading(true);
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
          });
          if (error) throw error;
        } finally {
          setLoading(false);
        }
      },
      signOut: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          clearNamuLocalStorage();
          setUser(null);
          router.replace("/login");
          router.refresh();
          window.location.assign("/login");
        } finally {
          setLoading(false);
        }
      },
      signOutEverywhere: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.auth.signOut({ scope: "global" });
          if (error) throw error;
          clearNamuLocalStorage();
          setUser(null);
          router.replace("/login");
          router.refresh();
          window.location.assign("/login");
        } finally {
          setLoading(false);
        }
      },
      deleteAccount: async (): Promise<DeleteAccountResult> => {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        if (!session) {
          return { ok: false, error: "no_session" };
        }
        const res = await fetch(`${window.location.origin}/api/account/delete`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (res.status === 503 && body.code === "not_configured") {
          return { ok: false, error: body.error ?? "not_configured", code: "not_configured" };
        }
        if (!res.ok) {
          return { ok: false, error: body.error ?? "delete_failed", code: body.code };
        }
        clearNamuLocalStorage();
        setUser(null);
        router.replace("/login");
        router.refresh();
        window.location.assign("/login");
        return { ok: true };
      }
    }),
    [initialized, loading, router, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
