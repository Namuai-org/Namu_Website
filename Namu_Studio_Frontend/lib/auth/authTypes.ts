import type { AuthResponse, OAuthResponse, User } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

export interface AuthContextValue {
  user: import("@/types").UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse["data"]>;
  signUp: (payload: SignupPayload) => Promise<AuthResponse["data"]>;
  signOut: () => Promise<void>;
  /** Ends all refresh tokens server-side (other devices). */
  signOutEverywhere: () => Promise<void>;
  /** Deletes the auth user when `SUPABASE_SERVICE_ROLE_KEY` is set (see API route). */
  deleteAccount: () => Promise<DeleteAccountResult>;
  forgotPassword: (email: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "github" | "apple") => Promise<OAuthResponse["data"] | void>;
}
