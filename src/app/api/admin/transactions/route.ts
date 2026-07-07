import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendWhatsApp } from "@/lib/fonnte";
import { services, formatRupiah } from "@/data/services";

export const dynamic = "force-dynamic";

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

    const formatted = (transactions || []).map((t: any) => ({
      id: t.id,
      name: t.buyer_name,
      whatsapp: t.whatsapp_number,
      serviceId: t.service_id,
      optionLabel: t.option_label,
      price: Number(t.price),
      status: t.status,
      timestamp: t.timestamp ? new Date(t.timestamp).toISOString().replace('T', ' ').substring(0, 16) : "",
      groupId: t.group_id,
      referenceId: t.reference_id || ""
    }));

    return NextResponse.json({ transactions: formatted });
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
    if (status === "SUCCESS" && trx.status !== "SUCCESS") {
      const svcName = services.find(s => s.id === trx.service_id)?.name || trx.service_id;
      
      // Immediately notify the buyer that payment is SUCCESS
      const successMessage = `Halo ${trx.buyer_name},\n\nPembayaran Invoice *${trx.id}* untuk patungan *${svcName}* Anda telah SUKSES diverifikasi! 🎉\n\n*Detail Transaksi:*\n- Layanan: ${svcName} (${trx.option_label})\n- Grup: ${trx.group_id || "Menunggu Antrean"}\n- Total: ${formatRupiah(Number(trx.price))}\n\nMohon tunggu sejenak. Jika grup patungan sudah penuh (4/4), kredensial akun premium akan otomatis dikirimkan ke nomor ini.\n\nTerima kasih,\nLanggananYuk Support`;
      
      sendWhatsApp(trx.whatsapp_number, successMessage).catch((err) =>
        console.error("Error sending payment success WA:", err)
      );

      if (trx.group_id) {
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
                // Send credentials to all buyers in this group
                groupBuyers.forEach((buyer, idx) => {
                  const profileInfo = credential.profile_number
                    ? `Profil ${credential.profile_number}`
                    : `Profil ${idx + 1}`;
                  const pinInfo = credential.pin_code
                    ? `\n- PIN Profil: ${credential.pin_code}`
                    : "";

                  const credMessage = `Halo ${buyer.buyer_name},\n\nGrup patungan *${trx.group_id}* untuk *${svcName}* Anda kini telah PENUH (4/4)! 🎉\n\nBerikut kredensial akun premium Anda:\n- Email: ${credential.email}\n- Password: ${credential.password}\n- Opsi/Slot: ${profileInfo}${pinInfo}\n\nHarap dilarang mengubah password/kredensial agar masa garansi Anda tetap aktif.\n\nSelamat menikmati!\nLanggananYuk Support`;

                  sendWhatsApp(buyer.whatsapp_number, credMessage).catch((err) =>
                    console.error(`Error sending credentials WA to ${buyer.buyer_name}:`, err)
                  );
                });
              }
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
