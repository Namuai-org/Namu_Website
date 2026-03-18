"use client";

import { useAuthContext } from "@/lib/auth/authContext";

export function useAuth() {
  return useAuthContext();
}
