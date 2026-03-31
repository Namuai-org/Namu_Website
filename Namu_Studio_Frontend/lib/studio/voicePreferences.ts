const DEVICE_KEY = "namu_mic_device_id";
const HOLD_KEY = "namu_hold_to_record";

export function getPreferredMicId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DEVICE_KEY);
}

export function setPreferredMicId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (!id) window.localStorage.removeItem(DEVICE_KEY);
  else window.localStorage.setItem(DEVICE_KEY, id);
}

export function getHoldToRecord(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(HOLD_KEY) === "1";
}

export function setHoldToRecord(value: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOLD_KEY, value ? "1" : "0");
}
