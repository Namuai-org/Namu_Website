"use client";

import { supabase } from "@/lib/supabase/client";
import type { Session } from "@/lib/supabase/types";

export async function createSession(userId: string, mode: Session["mode"], title?: string) {
  return supabase
    .from("sessions")
    .insert({ user_id: userId, mode, title: title || "Sabon Zama" })
    .select("*")
    .single();
}

export async function getUserSessions(userId: string) {
  return supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("updated_at", { ascending: false })
    .limit(50);
}

export async function updateSessionTitle(sessionId: string, title: string) {
  return supabase.from("sessions").update({ title }).eq("id", sessionId);
}

export async function touchSession(sessionId: string) {
  return supabase
    .from("sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}

export async function deleteSession(sessionId: string) {
  return supabase.from("sessions").delete().eq("id", sessionId);
}

export function generateSessionTitle(content: string): string {
  const clean = content.trim();
  if (clean.length <= 40) return clean;
  const cut = clean.slice(0, 40);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 20 ? cut.slice(0, lastSpace) : cut}...`;
}
