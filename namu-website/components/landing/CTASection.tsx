"use client";

import { FormEvent, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function CTASection() {
  useScrollReveal("#waitlist .reveal");
  const { t } = useTranslation();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Homepage waitlist",
        email,
        subject: "Waitlist",
        message: "Homepage waitlist signup",
      }),
    });

    if (response.ok) {
      setStatus(t("cta.success"));
      event.currentTarget.reset();
    } else {
      setStatus(t("cta.error"));
    }

    setIsSubmitting(false);
  };

  return (
    <section className="section cta-dark waitlist-section" id="waitlist">
      <div className="waitlist-background" aria-hidden="true">
        <div className="waitlist-aura waitlist-aura-1" />
        <div className="waitlist-aura waitlist-aura-2" />
        <div className="waitlist-orbit waitlist-orbit-1" />
        <div className="waitlist-orbit waitlist-orbit-2" />
        <span className="waitlist-chip waitlist-chip-1">{t("cta.bg1")}</span>
        <span className="waitlist-chip waitlist-chip-2">{t("cta.bg2")}</span>
        <span className="waitlist-chip waitlist-chip-3">{t("cta.bg3")}</span>
        <span className="waitlist-chip waitlist-chip-4">{t("cta.bg4")}</span>
        <span className="waitlist-chip waitlist-chip-5">{t("cta.bg5")}</span>
      </div>

      <div className="container waitlist-shell">
        <span className="waitlist-label reveal reveal-fade">{t("cta.label")}</span>
        <h2 className="title waitlist-title reveal reveal-up">{t("cta.title")}</h2>
        <p className="intro waitlist-body reveal reveal-up">{t("cta.body")}</p>
        <form className="waitlist-form reveal reveal-up" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder={t("cta.placeholder")}
            aria-label={t("cta.inputLabel")}
            required
          />
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t("cta.sending") : t("cta.primary")}
          </button>
        </form>
        {status ? <p className="waitlist-status">{status}</p> : null}
        <p className="waitlist-note reveal reveal-fade">{t("cta.note")}</p>
      </div>
    </section>
  );
}
