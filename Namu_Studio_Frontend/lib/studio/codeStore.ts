"use client";

import { create } from "zustand";

interface CodeStoreState {
  activeFileId: string;
  mobileTab: "editor" | "preview";
  setActiveFileId: (id: string) => void;
  setMobileTab: (tab: "editor" | "preview") => void;
}

export const useCodeStore = create<CodeStoreState>((set) => ({
  activeFileId: "html",
  mobileTab: "editor",
  setActiveFileId: (id) => set({ activeFileId: id }),
  setMobileTab: (tab) => set({ mobileTab: tab })
}));
