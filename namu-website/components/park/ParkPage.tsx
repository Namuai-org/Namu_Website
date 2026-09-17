"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";

const ParkExperience = dynamic(
  () => import("./ParkExperience").then((m) => m.ParkExperience),
  { ssr: false },
);

/** Whether this browser can actually draw the park. */
function canRender() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * The playground, as a park.
 *
 * The console is still here and still complete: `?view=classic` opens it, the
 * park's own top bar links to it, and a browser that cannot run WebGL is given
 * it without being told anything went wrong. The park is the way in, not the
 * only way in.
 */
export function ParkPage() {
  const [mode, setMode] = useState<"pending" | "park" | "classic">("pending");

  useEffect(() => {
    const classic = new URLSearchParams(window.location.search).get("view") === "classic";
    setMode(classic || !canRender() ? "classic" : "park");
  }, []);

  if (mode === "pending") return null;
  return mode === "park" ? <ParkExperience /> : <PlaygroundPage />;
}
