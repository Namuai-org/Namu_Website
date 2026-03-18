import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,var(--navy)_0%,var(--navy-mid)_60%,#1a2a3a_100%)] p-10 text-white md:flex md:flex-col">
        <Logo light />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="max-w-[460px]">
            <h1 className="text-balance text-hero font-bold leading-[1.2]">AI cikin harsharka.</h1>
            <p className="mt-4 text-lg font-light italic text-white/45">AI in your language.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["💬 Tattaunawa da AI a Hausa", "💻 Gina abubuwa da Hausa", "🎤 Yi magana, AI ya ji"].map((pill) => (
                <div key={pill} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-white/25">© 2026 Namu. Duk haƙƙoƙi.</p>
      </aside>
      <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10">{children}</main>
    </div>
  );
}
