import { AuthBrandAside } from "@/components/auth/AuthBrandAside";

export function AuthLayoutFrame({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="auth-shell relative min-h-screen overflow-hidden font-website text-namu-cream">
      <div className="auth-art-canvas" aria-hidden />
      <div className="auth-art-veil pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="auth-grain" aria-hidden />
      <div className="relative z-[2] flex min-h-screen w-full">
        <div className="auth-device-frame auth-unified-shell auth-full-viewport w-full flex-1">
          <aside className="relative hidden min-h-0 min-w-0 flex-1 flex-col justify-center lg:flex">
            <AuthBrandAside />
          </aside>

          <div className="auth-frame-divider" aria-hidden />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
            <div className="flex w-full max-w-[min(480px,100%)] flex-1 flex-col justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
