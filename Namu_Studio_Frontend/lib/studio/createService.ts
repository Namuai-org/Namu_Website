"use client";

import { supabase } from "@/lib/supabase/client";

export async function saveCreateOutput(
  sessionId: string,
  userId: string,
  prompt: string,
  output: string,
  options: {
    template?: string;
    tone: string;
    length: string;
  }
) {
  const wordCount = output.trim().split(/\s+/).filter(Boolean).length;

  return supabase
    .from("create_outputs")
    .insert({
      session_id: sessionId,
      user_id: userId,
      prompt,
      output,
      template: options.template || null,
      tone: options.tone,
      length: options.length,
      word_count: wordCount
    })
    .select("*")
    .single();
}

export async function getSessionOutputs(sessionId: string) {
  return supabase
    .from("create_outputs")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });
}
