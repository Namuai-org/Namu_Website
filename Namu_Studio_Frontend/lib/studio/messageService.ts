"use client";

import { supabase } from "@/lib/supabase/client";

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: "user" | "assistant",
  content: string
) {
  return supabase
    .from("messages")
    .insert({ session_id: sessionId, user_id: userId, role, content })
    .select("*")
    .single();
}

export async function getSessionMessages(sessionId: string) {
  return supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
}

export async function deleteMessage(messageId: string) {
  return supabase.from("messages").delete().eq("id", messageId);
}
