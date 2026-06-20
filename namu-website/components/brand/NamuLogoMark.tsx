type NamuLogoMarkProps = {
  variant?: "onDark" | "onLight";
  height?: number;
  className?: string;
};

const ICON = {
  onDark:  "/brand/namu%20branding/svg/logo/namu-logo-transparent-light.svg",
  onLight: "/brand/namu%20branding/svg/logo/namu-logo-transparent-dark.svg",
} as const;

export function NamuLogoMark({
  variant = "onDark",
  height = 28,
  className = "",
}: NamuLogoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON[variant]}
      alt=""
      aria-hidden
      className={className}
      style={{ height, width: "auto", display: "block", flexShrink: 0 }}
    />
  );
}
