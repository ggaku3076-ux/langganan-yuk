import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAuthorizedAdmin } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

// GET: Retrieve credentials
export async function GET(req: NextRequest) {
  if (!await isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");

  try {
    let query = supabaseAdmin
      .from("account_credentials")
      .select("*")
      .order("created_at", { ascending: false });

    if (serviceId) {
      query = query.eq("service_id", serviceId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, credentials: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add new credential
export async function POST(req: NextRequest) {
  if (!await isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { serviceId, email, password, profileNumber, profilePin } = body;

    if (!serviceId || !email || !password || !profileNumber) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("account_credentials")
      .insert({
        service_id: serviceId,
        email,
        password,
        profile_number: Number(profileNumber),
        profile_pin: profilePin || null,
        is_used: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, credential: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove credential by ID
export async function DELETE(req: NextRequest) {
  if (!await isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("account_credentials")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Credential deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
