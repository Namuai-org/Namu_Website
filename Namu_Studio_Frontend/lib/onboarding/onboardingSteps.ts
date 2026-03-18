import { Code2, MessageSquare, Send, Sparkles } from "lucide-react";

export const onboardingSteps = [
  { id: 1, icon: Sparkles, titleKey: "onboarding.welcomeTitle", bodyKey: "onboarding.welcomeBody", target: "dashboard" },
  { id: 2, icon: MessageSquare, titleKey: "onboarding.step2Title", bodyKey: "onboarding.step2Body", target: "mode-chat" },
  { id: 3, icon: Send, titleKey: "onboarding.step3Title", bodyKey: "onboarding.step3Body", target: "chat-input" },
  { id: 4, icon: Code2, titleKey: "onboarding.step4Title", bodyKey: "onboarding.step4Body", target: "mode-code" },
  { id: 5, icon: Sparkles, titleKey: "onboarding.completeTitle", bodyKey: "onboarding.completeBody", target: "complete" }
] as const;
