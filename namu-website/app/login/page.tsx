"use client";

import { HeroEntrance } from "@/components/landing/HeroEntrance";

export default function LoginPage() {
  return (
    <main className="login-page">
      <HeroEntrance className="login-page-inner">
        <h1 className="login-page-title">Shiga Namu</h1>
        <p className="login-page-lede">Wannan shafin login ne na Namu AI-Studio.</p>
        <a href="/" className="btn-outline login-page-btn">
          Koma shafin gida
        </a>
      </HeroEntrance>
    </main>
  );
}
