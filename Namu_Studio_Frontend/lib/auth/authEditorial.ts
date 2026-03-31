/** Dispatched when the user toggles sign-in ↔ sign-up in place so the brand typewriter can restart. */
export const AUTH_EDITORIAL_RESTART_EVENT = "namu-auth-editorial-restart";

export function requestAuthEditorialRestart(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EDITORIAL_RESTART_EVENT));
}
