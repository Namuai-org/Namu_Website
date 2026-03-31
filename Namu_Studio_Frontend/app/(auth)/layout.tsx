import { AuthLayoutFrame } from "@/components/auth/AuthLayoutFrame";

export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <AuthLayoutFrame>{children}</AuthLayoutFrame>;
}
