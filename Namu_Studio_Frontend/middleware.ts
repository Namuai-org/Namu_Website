import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/supabase/types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2]);
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set(name, "", options as Parameters<typeof res.cookies.set>[2]);
        }
      }
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname.startsWith("/forgot-password");

  const isWorkspaceRoute = req.nextUrl.pathname.startsWith("/workspace");

  if (!session && isWorkspaceRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/workspace/:path*", "/login", "/signup", "/forgot-password"]
};
