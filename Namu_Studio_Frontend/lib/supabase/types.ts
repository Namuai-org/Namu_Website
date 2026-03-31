export type ThemeName = "namu" | "gece" | "daji" | "sahara" | "dare";
export type Language = "en" | "ha" | "fr";
export type StudioMode = "chat" | "create" | "code" | "voice";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  theme: ThemeName;
  language: Language;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  title: string;
  mode: StudioMode;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  session_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type CreateOutput = {
  id: string;
  session_id: string;
  user_id: string;
  prompt: string;
  output: string;
  template: string | null;
  tone: string;
  length: string;
  word_count: number | null;
  created_at: string;
};

export type CodeProject = {
  id: string;
  session_id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CodeFileRecord = {
  id: string;
  project_id: string;
  user_id: string;
  filename: string;
  language: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      sessions: {
        Row: Session;
        Insert: Pick<Session, "user_id" | "title" | "mode"> & Partial<Pick<Session, "is_archived">>;
        Update: Partial<Pick<Session, "title" | "updated_at" | "is_archived">>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: never;
        Relationships: [];
      };
      create_outputs: {
        Row: CreateOutput;
        Insert: Omit<CreateOutput, "id" | "created_at">;
        Update: never;
        Relationships: [];
      };
      code_projects: {
        Row: CodeProject;
        Insert: Omit<CodeProject, "id" | "created_at" | "updated_at">;
        Update: Partial<Pick<CodeProject, "name" | "updated_at">>;
        Relationships: [];
      };
      code_files: {
        Row: CodeFileRecord;
        Insert: Omit<CodeFileRecord, "id" | "created_at" | "updated_at" | "is_active"> & Partial<Pick<CodeFileRecord, "is_active">>;
        Update: Partial<Pick<CodeFileRecord, "content" | "is_active" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
