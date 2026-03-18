"use client";

import { useOnboardingContext } from "@/lib/onboarding/onboardingContext";

export function useOnboarding() {
  return useOnboardingContext();
}
