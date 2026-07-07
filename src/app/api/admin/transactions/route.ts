import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Simple authorization check helper
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  // Secure check against admin password
  return token === "raihan9898";
}

// GET: Fetch all transactions from Supabase
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { data: transactions, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Update transaction status manually
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required" }, { status: 400 });
    }

    // 1. Get the current transaction record
    const { data: trx, error: fetchErr } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !trx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 2. Update the transaction status
    const { error: updateErr } = await supabaseAdmin
      .from("transactions")
      .update({ status })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 3. Matchmaking Logic: If setting status to SUCCESS, increment group slots
    if (status === "SUCCESS" && trx.status !== "SUCCESS" && trx.group_id) {
      // Get current group details
      const { data: group, error: groupFetchErr } = await supabaseAdmin
        .from("groups")
        .select("*")
        .eq("id", trx.group_id)
        .single();

      if (group && !groupFetchErr) {
        const newFilledSlots = group.filled_slots + 1;
        const newStatus = newFilledSlots >= group.max_slots ? "full" : "waiting";

        // Update group slots
        await supabaseAdmin
          .from("groups")
          .update({ 
            filled_slots: newFilledSlots,
            status: newStatus
          })
          .eq("id", trx.group_id);

        // If the group becomes full (e.g. 4/4), process automated account credentials delivery via WA
        if (newStatus === "full") {
          // Fetch an unused premium account credential
          const { data: credential, error: credErr } = await supabaseAdmin
            .from("account_credentials")
            .select("*")
            .eq("service_id", trx.service_id)
            .eq("is_used", false)
            .limit(1)
            .single();

          if (credential && !credErr) {
            // Mark credential as used
            await supabaseAdmin
              .from("account_credentials")
              .update({ is_used: true })
              .eq("id", credential.id);

            // Fetch all successful buyers in this group to notify them
            const { data: groupBuyers } = await supabaseAdmin
              .from("transactions")
              .select("whatsapp_number, buyer_name")
              .eq("group_id", trx.group_id)
              .eq("status", "SUCCESS");

            if (groupBuyers && groupBuyers.length > 0) {
              // Collect buyer contacts for Fonnte / WhatsApp Gateway trigger
              const numbers = groupBuyers.map(b => b.whatsapp_number);
              console.log(`[WA TRIGGER] Group ${trx.group_id} is full! Sending email: ${credential.email} to contacts:`, numbers);
              
              // In production, you would call Fonnte API here:
              // fetch('https://api.fonnte.com/send', { method: 'POST', headers: { Authorization: 'FONNTE_TOKEN' }, body: ... })
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove transaction record from log
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("transactions")
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
