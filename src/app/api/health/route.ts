import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const diagnostics: any = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set (OK)" : "Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (OK)" : "Missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set (OK)" : "Missing",
    },
    tables: {}
  };

  try {
    // 1. Test services table connection
    const { count: servicesCount, error: servicesError } = await supabaseAdmin
      .from("services")
      .select("*", { count: "exact", head: true });

    diagnostics.tables.services = servicesError 
      ? { status: "Error", message: servicesError.message } 
      : { status: "Connected", count: servicesCount };

    // 2. Test groups table connection
    const { count: groupsCount, error: groupsError } = await supabaseAdmin
      .from("groups")
      .select("*", { count: "exact", head: true });

    diagnostics.tables.groups = groupsError 
      ? { status: "Error", message: groupsError.message } 
      : { status: "Connected", count: groupsCount };

    // 3. Test transactions table connection
    const { count: transactionsCount, error: transactionsError } = await supabaseAdmin
      .from("transactions")
      .select("*", { count: "exact", head: true });

    diagnostics.tables.transactions = transactionsError 
      ? { status: "Error", message: transactionsError.message } 
      : { status: "Connected", count: transactionsCount };

    // Determine overall status
    const hasError = 
      servicesError || 
      groupsError || 
      transactionsError || 
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
      status: hasError ? "Unhealthy" : "Healthy",
      diagnostics
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "Error",
      message: err.message,
      diagnostics
    }, { status: 500 });
  }
}
