"use client";

const CHIPS = [
  { label: "Hausa",    cls: "try-chip-1" },
  { label: "Rubutu",   cls: "try-chip-2" },
  { label: "Ilimi",    cls: "try-chip-3" },
  { label: "Tambaya",  cls: "try-chip-4" },
  { label: "Fahimta",  cls: "try-chip-5" },
  { label: "Kirkirar", cls: "try-chip-6" },
  { label: "Gina",     cls: "try-chip-7" },
  { label: "Tsarawa",  cls: "try-chip-8" },
];

export function CTASection() {
  return (
    <section id="waitlist" className="try-section">

      {/* Floating word chips */}
      <div className="try-chips" aria-hidden="true">
        {CHIPS.map(c => (
          <span key={c.label} className={`try-chip ${c.cls}`}>{c.label}</span>
        ))}
      </div>

      {/* Main content */}
      <div className="try-content">
        <h2 className="try-title">Try out our Hausa Models today</h2>
        <p className="try-sub">No sign-up or login required</p>
        <a href="#" className="try-btn">Try</a>
      </div>

    </section>
  );
}
