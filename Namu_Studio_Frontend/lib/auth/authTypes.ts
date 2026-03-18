import type { AuthResponse, OAuthResponse, User } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: import("@/types").UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse["data"]>;
  signUp: (payload: SignupPayload) => Promise<AuthResponse["data"]>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "github" | "apple") => Promise<OAuthResponse["data"] | void>;
}
