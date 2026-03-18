"use client";

import { supabase } from "@/lib/supabase/client";

export async function createCodeProject(sessionId: string, userId: string, name = "namu-project") {
  return supabase
    .from("code_projects")
    .insert({ session_id: sessionId, user_id: userId, name })
    .select("*")
    .single();
}

export async function getSessionProject(sessionId: string) {
  return supabase
    .from("code_projects")
    .select("*, code_files(*)")
    .eq("session_id", sessionId)
    .single();
}

export async function upsertCodeFile(
  projectId: string,
  userId: string,
  filename: string,
  language: string,
  content: string
) {
  return supabase
    .from("code_files")
    .upsert(
      {
        project_id: projectId,
        user_id: userId,
        filename,
        language,
        content
      },
      { onConflict: "project_id,filename" }
    )
    .select("*")
    .single();
}

export async function getProjectFiles(projectId: string) {
  return supabase
    .from("code_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
}
