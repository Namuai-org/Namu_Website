"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthTypewriterHeadline } from "@/components/auth/AuthTypewriterHeadline";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function AuthBrandAside(): JSX.Element {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-8 px-8 py-10 sm:gap-10 sm:px-12 sm:py-12 lg:px-14 lg:py-14">
      <Link
        href="/"
        className="relative z-[2] w-fit shrink-0 justify-self-start outline-none transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-namu-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <Image
          src="/brand/namu-navbar-logo-code.svg"
          alt="Namu"
          width={210}
          height={48}
          priority
          className="h-9 w-auto sm:h-10"
        />
      </Link>

      <div className="relative z-[2] flex min-h-0 flex-col justify-center gap-7 -translate-y-6 sm:-translate-y-8 lg:-translate-y-10">
        <AuthTypewriterHeadline
          key={pathname}
          line1={t("auth.editorialLine1")}
          line2={t("auth.editorialLine2")}
        />
        <p className="max-w-md font-website text-[14px] font-normal leading-relaxed text-namu-cream/[0.52]">{t("auth.brandTagline")}</p>
      </div>

      <p className="relative z-[2] shrink-0 justify-self-start font-website text-[12px] text-namu-cream/[0.28]">{t("auth.copyright")}</p>
    </div>
  );
}
