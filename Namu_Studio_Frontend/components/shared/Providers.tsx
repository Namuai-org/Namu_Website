"use client";

import { AuthProvider } from "@/lib/auth/authContext";
import { OnboardingProvider } from "@/lib/onboarding/onboardingContext";
import { ChatProvider } from "@/lib/studio/chatContext";
import { SessionProvider } from "@/lib/studio/sessionContext";
import { ShellProvider } from "@/lib/studio/shellContext";
import { WorkspaceProvider } from "@/lib/studio/workspaceContext";

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <AuthProvider>
      <ShellProvider>
        <SessionProvider>
          <ChatProvider>
            <WorkspaceProvider>
              <OnboardingProvider>{children}</OnboardingProvider>
            </WorkspaceProvider>
          </ChatProvider>
        </SessionProvider>
      </ShellProvider>
    </AuthProvider>
  );
}
