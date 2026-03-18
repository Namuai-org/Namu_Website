export type Language = "en" | "ha";

export type AppMode = "chat" | "create" | "code" | "voice";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  theme?: "namu" | "gece" | "daji" | "sahara" | "dare";
  language?: "en" | "ha";
  onboardingComplete?: boolean;
}

export interface SessionPreview {
  id: string;
  mode: AppMode;
  title: string;
  preview: string;
  timeAgo: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  streaming?: boolean;
}

export interface CodeFile {
  id: string;
  name: string;
  language: "html" | "css" | "javascript";
  content: string;
}

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
}

export interface OnboardingState {
  complete: boolean;
  currentStep: number;
}

export interface AuthFormState {
  email: string;
  password: string;
  remember?: boolean;
}
