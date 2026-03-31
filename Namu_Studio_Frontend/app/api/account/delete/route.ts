import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/types";

export async function POST(request: Request): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon) {
    return NextResponse.json({ error: "Server misconfigured", code: "misconfigured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);

  const verify = createClient<Database>(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const {
    data: { user },
    error: userErr
  } = await verify.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!service) {
    return NextResponse.json(
      {
        error: "Account deletion requires server configuration (SUPABASE_SERVICE_ROLE_KEY).",
        code: "not_configured"
      },
      { status: 503 }
    );
  }

  const admin = createClient<Database>(url, service, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  await admin.from("profiles").delete().eq("id", user.id);

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
