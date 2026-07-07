import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// GET: Fetch active groups for a service
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const slots = parseInt(searchParams.get("slots") || "4");

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // 1. Fetch active groups for this service (both waiting and full status)
    let { data: groups, error } = await supabaseAdmin
      .from("groups")
      .select("*")
      .eq("service_id", serviceId)
      .eq("max_slots", slots)
      .in("status", ["waiting", "full"])
      .order("group_number", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. If no active waiting group exists, automatically prepare a new group
    if (!groups || groups.length === 0 || !groups.some(g => g.status === "waiting")) {
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

      // Insert the new group into the database
      const { data: newGroup, error: insertErr } = await supabaseAdmin
        .from("groups")
        .insert({
          id: newGroupId,
          service_id: serviceId,
          group_number: nextGroupNumber,
          max_slots: slots,
          filled_slots: 0,
          status: "waiting"
        })
        .select()
        .single();

      if (insertErr) {
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }

      if (!groups) {
        groups = [newGroup];
      } else {
        groups = [...groups, newGroup];
      }
    }

    // 3. Fetch all active transactions (SUCCESS & PENDING) for these groups
    const groupIds = groups.map(g => g.id);
    const { data: transactions } = await supabaseAdmin
      .from("transactions")
      .select("buyer_name, status, timestamp, group_id")
      .in("group_id", groupIds)
      .in("status", ["SUCCESS", "PENDING"])
      .order("timestamp", { ascending: true });

    // 4. Map transactions to their respective groups
    const groupsWithTrx = groups.map(g => {
      const groupTrxs = transactions ? transactions.filter(t => t.group_id === g.id) : [];
      return {
        ...g,
        transactions: groupTrxs
      };
    });

    return NextResponse.json({ groups: groupsWithTrx });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
