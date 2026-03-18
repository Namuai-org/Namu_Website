"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Spinner } from "@/components/shared/Spinner";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage(): JSX.Element {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    window.setTimeout(() => router.push("/workspace"), 2000);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-surface-off px-6">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-text-dark">Set new password</h1>
        <p className="mt-2 text-sm text-text-quiet">Create a new password for your Namu account.</p>
        {success ? (
          <p className="mt-6 text-sm text-status-success">Password updated. Redirecting to workspace...</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
              />
              {error ? <p className="mt-2 text-xs text-status-error">{error}</p> : null}
            </div>
            <Button type="submit" className="w-full" size="lg">
              {loading ? <Spinner /> : null}
              {loading ? "Saving..." : "Set new password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
