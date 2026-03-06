"use client";

import { FormEvent, useState } from "react";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactPage() {
  const [status, setStatus] = useState<string>("");
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(t("contact.sending"));

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(response.ok ? t("contact.success") : t("contact.error"));
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <>
      <NavBar />
      <section className="section" id="contact-page">
        <div className="container contact-wrap">
          <h1 className="title reveal reveal-up">{t("contact.title")}</h1>

          <div className="contact-cards">
            <article className="contact-card reveal reveal-up">
              <h3>{t("contact.card1")}</h3>
              <p>{t("contact.card1Body")}</p>
              <a href="mailto:partnerships@namu.ai">partnerships@namu.ai</a>
            </article>
            <article className="contact-card reveal reveal-up">
              <h3>{t("contact.card2")}</h3>
              <p>{t("contact.card2Body")}</p>
              <a href="mailto:invest@namu.ai">invest@namu.ai</a>
            </article>
            <article className="contact-card reveal reveal-up">
              <h3>{t("contact.card3")}</h3>
              <p>{t("contact.card3Body")}</p>
              <a href="mailto:press@namu.ai">press@namu.ai</a>
            </article>
          </div>

          <form className="contact-form reveal reveal-up" onSubmit={onSubmit}>
            <input name="name" placeholder={t("contact.name")} required />
            <input name="email" type="email" placeholder={t("contact.email")} required />
            <select name="subject" required defaultValue="">
              <option value="" disabled>
                {t("contact.subject")}
              </option>
              <option value="Partnership">{t("contact.subject.partnership")}</option>
              <option value="Investment">{t("contact.subject.investment")}</option>
              <option value="Press">{t("contact.subject.press")}</option>
            </select>
            <textarea name="message" placeholder={t("contact.message")} rows={6} required />
            <button type="submit" className="btn-primary">
              {t("contact.submit")}
            </button>
            {status ? <p className="form-status">{status}</p> : null}
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
