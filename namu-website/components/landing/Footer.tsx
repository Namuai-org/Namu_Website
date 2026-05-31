"use client";

import Link from "next/link";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";

/* ─── Social icons ─── */
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <path d="M8 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v-3.6c0-1.5.9-2.6 2.5-2.6s2.5 1.1 2.5 2.6V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.988l4.26 5.632 4.746-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13.5 8.5H15V6h-1.5C11.567 6 10 7.567 10 9.5V11H8.5v2.5H10V18h2.5v-4.5H14L14.5 11H12.5V9.5c0-.552.448-1 1-1z" fill="currentColor" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

/* ─── Column data ─── */
const COLUMNS = [
  {
    label: "Company",
    items: [
      { label: "About",    href: "/"                          },
      { label: "FAQ",      href: "/#faq"                      },
      { label: "Investor", href: "#"                          },
      { label: "Contact",  href: "mailto:contact@namuai.org"  },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Blog",              href: "/blog" },
      { label: "Namu Playground",            href: "/playground", external: true },
      { label: "Documentation",     href: "#"     },
      { label: "Downloads",   href: "#",    external: true },
      { label: "Research",          href: "#"     },
      { label: "Models",        href: "#"     },
    ],
  },
  {
    label: "API Platform",
    items: [
      { label: "Platform Overview", href: "#" },
      { label: "API Login",         href: "#", external: true },
      { label: "Pricing",           href: "#" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Help Center",         href: "#",                            external: true  },
      { label: "support@namuai.org",  href: "mailto:support@namuai.org"                    },
      { label: "WhatsApp",            href: "https://wa.me/"                               },
    ],
  },
  {
    label: "Products",
    items: [
      { label: "Namu Studio",    href: "#" },
      { label: "Muryar Manoma",  href: "#" },
      { label: "KudiSauti",      href: "#" },
      { label: "Muryar Ilimi",   href: "#" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="footer">

      {/* Logo */}
      <div className="footer-logo-row">
        <Link href="/" className="footer-brand" aria-label="Namu">
          <NamuLogoMark variant="onLight" height={28} />
          <span className="footer-wordmark">
            <span className="footer-wordmark-amu">amu</span>
          </span>
        </Link>
      </div>

      {/* 5-column grid */}
      <div className="footer-columns">
        {COLUMNS.map((col) => (
          <div key={col.label} className="footer-col">
            <p className="footer-col-label">{col.label}</p>
            <div className="footer-col-links">
              {col.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer-col-link"
                  {...("external" in item && item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {item.label}
                  {"external" in item && item.external && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="footer-external-icon">
                      <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* REX-style divider with dots */}
      <div className="footer-rule">
        <span className="footer-rule-dot" aria-hidden="true" />
        <span className="footer-rule-line" aria-hidden="true" />
        <span className="footer-rule-dot" aria-hidden="true" />
      </div>

      {/* Bottom bar: copyright | socials | legal */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 Namu AI · Built in Niger and the United States.
        </p>

        <div className="footer-socials">
          <a href="https://instagram.com/namuai" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Instagram">
            <IconInstagram />
          </a>
          <a href="https://facebook.com/namuai" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Facebook">
            <IconFacebook />
          </a>
          <a href="https://linkedin.com/company/namuai" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <IconLinkedIn />
          </a>
          <a href="https://github.com/namuai" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
            <IconGitHub />
          </a>
          <a href="https://x.com/namuai" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="X">
            <IconX />
          </a>
        </div>

        <div className="footer-legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </div>

    </footer>
  );
}
