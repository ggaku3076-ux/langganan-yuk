import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";
import { services, formatRupiah } from "@/data/services";
import { sendWhatsApp } from "@/lib/fonnte";

export const dynamic = "force-dynamic";

// GET /api/payment/webhook: Simple health check / ping verification
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Webhook endpoint is active and listening." }, { status: 200 });
}

// POST /api/payment/webhook: Midtrans Webhook Notification
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ message: "Empty body ping received" }, { status: 200 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.warn("Received non-JSON POST request, treating as validation ping.");
      return NextResponse.json({ message: "Validation request received successfully" }, { status: 200 });
    }

    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      gross_amount,
      status_code
    } = body;

    if (!order_id || !signature_key || !gross_amount || !status_code) {
      return NextResponse.json({ message: "Ping / Validation request received successfully" }, { status: 200 });
    }

    // 1. Verify Midtrans Signature Key
    // signature_key = sha512(order_id + statusCode + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    if (!serverKey) {
      console.warn("MIDTRANS_SERVER_KEY is not defined, skipping signature verification for development.");
    } else {
      const computedSignature = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + serverKey)
        .digest("hex");

      if (computedSignature !== signature_key) {
        console.error(`Invalid signature computed. Expected: ${computedSignature}, Received: ${signature_key}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    // 2. Fetch the corresponding transaction in Supabase
    const { data: trx, error: fetchErr } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", order_id)
      .single();

    if (fetchErr || !trx) {
      console.error(`Transaction with ID ${order_id} not found in database:`, fetchErr);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 3. Process status according to Midtrans specs
    let targetStatus: "SUCCESS" | "EXPIRED" | "PENDING" = "PENDING";
    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "challenge") {
        targetStatus = "PENDING";
      } else {
        targetStatus = "SUCCESS";
      }
    } else if (
      transaction_status === "deny" ||
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      targetStatus = "EXPIRED";
    }

    // If status is identical, return early
    if (trx.status === targetStatus) {
      return NextResponse.json({ success: true });
    }

    // 4. Update the transaction status in the database
    const { error: updateErr } = await supabaseAdmin
      .from("transactions")
      .update({ status: targetStatus })
      .eq("id", order_id);

    if (updateErr) {
      console.error(`Error updating transaction status to ${targetStatus}:`, updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 5. Matchmaking and WA triggers
    if (targetStatus === "SUCCESS") {
      const svcName = services.find(s => s.id === trx.service_id)?.name || trx.service_id;
      
      // Notify the buyer via Fonnte WA
      const successMessage = `Halo ${trx.buyer_name},\n\nPembayaran Invoice *${trx.id}* untuk patungan *${svcName}* Anda telah SUKSES diverifikasi! 🎉\n\n*Detail Transaksi:*\n- Layanan: ${svcName} (${trx.option_label})\n- Grup: ${trx.group_id || "Menunggu Antrean"}\n- Total: ${formatRupiah(Number(trx.price))}\n\nMohon tunggu sejenak. Jika grup patungan sudah penuh (4/4), kredensial akun premium akan otomatis dikirimkan ke nomor ini.\n\nTerima kasih,\nLanggananYuk Support`;
      
      sendWhatsApp(trx.whatsapp_number, successMessage).catch((err) =>
        console.error("Error sending payment success WA:", err)
      );

      if (trx.group_id) {
        // Increment group slots
        const { data: group, error: groupFetchErr } = await supabaseAdmin
          .from("groups")
          .select("*")
          .eq("id", trx.group_id)
          .single();

        if (group && !groupFetchErr) {
          const newFilledSlots = group.filled_slots + 1;
          const newStatus = newFilledSlots >= group.max_slots ? "full" : "waiting";

          await supabaseAdmin
            .from("groups")
            .update({
              filled_slots: newFilledSlots,
              status: newStatus
            })
            .eq("id", trx.group_id);

          // Broadcast credentials if full
          if (newStatus === "full") {
            const { data: credential } = await supabaseAdmin
              .from("account_credentials")
              .select("*")
              .eq("service_id", trx.service_id)
              .eq("is_used", false)
              .limit(1)
              .maybeSingle();

            if (credential) {
              await supabaseAdmin
                .from("account_credentials")
                .update({ is_used: true })
                .eq("id", credential.id);

              const { data: groupBuyers } = await supabaseAdmin
                .from("transactions")
                .select("buyer_name, whatsapp_number")
                .eq("group_id", trx.group_id)
                .eq("status", "SUCCESS");

              if (groupBuyers && groupBuyers.length > 0) {
                for (const buyer of groupBuyers) {
                  const credMessage = `Halo ${buyer.buyer_name},\n\nKabar baik! Grup patungan *${svcName}* Anda telah penuh (4/4). 🚀\n\nBerikut adalah kredensial akun premium Anda:\n\n*Detail Akun:*\n- Email: \`${credential.email}\`\n- Password: \`${credential.password}\`\n- Profil: Profil ${credential.profile_number || "Bebas"}\n- PIN Profil: \`${credential.pin || "Tanpa PIN"}\`\n\n*Syarat & Ketentuan:*\n1. Dilarang mengubah email/password.\n2. Dilarang login di lebih dari 1 perangkat bersamaan.\n3. Gunakan hanya profil yang telah ditentukan.\n\nSelamat menikmati!\nLanggananYuk Support`;
                  
                  sendWhatsApp(buyer.whatsapp_number, credMessage).catch((err) =>
                    console.error("Error broadcasting credentials WA:", err)
                  );
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
