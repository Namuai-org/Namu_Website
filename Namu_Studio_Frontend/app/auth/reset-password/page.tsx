import { AuthLayoutFrame } from "@/components/auth/AuthLayoutFrame";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage(): JSX.Element {
  return (
    <AuthLayoutFrame>
      <ResetPasswordForm />
    </AuthLayoutFrame>
  );
}
