import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  return token === "raihan9898";
}

// GET: Fetch all groups with their service info and transaction members
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { data: groups, error } = await supabaseAdmin
      .from("groups")
      .select(`
        *,
        services (
          name,
          logo_url
        ),
        transactions (
          id,
          buyer_name,
          whatsapp_number,
          status,
          price,
          timestamp,
          option_label
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ groups });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a group from the database
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("groups")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create a new group manually
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { serviceId, maxSlots } = body;

    if (!serviceId || !maxSlots) {
      return NextResponse.json({ error: "Service ID and Max Slots are required" }, { status: 400 });
    }

    // Find the last group number for this service
    const { data: lastGroup } = await supabaseAdmin
      .from("groups")
      .select("group_number")
      .eq("service_id", serviceId)
      .order("group_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextGroupNumber = lastGroup ? lastGroup.group_number + 1 : 1;
    const newGroupId = `${serviceId}-group-${nextGroupNumber}`;

    // Insert group
    const { data: newGroup, error } = await supabaseAdmin
      .from("groups")
      .insert({
        id: newGroupId,
        service_id: serviceId,
        group_number: nextGroupNumber,
        max_slots: maxSlots,
        filled_slots: 0,
        status: "waiting"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, group: newGroup });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
