import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";
import { services, formatRupiah } from "@/data/services";
import { sendWhatsApp } from "@/lib/fonnte";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

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
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
        if (isProduction) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        } else {
          console.warn("Signature mismatch in Sandbox mode. Allowing request to pass for testing.");
        }
      }
    }

    // 2. Fetch the corresponding transaction in Supabase
    const { data: trx, error: fetchErr } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", order_id)
      .single();

    if (fetchErr || !trx) {
      console.warn(`Transaction with ID ${order_id} not found in database:`, fetchErr);
      const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
      if (!isProduction) {
        return NextResponse.json({ message: "Sandbox test request received, skipping DB update" }, { status: 200 });
      }
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
                .select("buyer_name, whatsapp_number, buyer_email")
                .eq("group_id", trx.group_id)
                .eq("status", "SUCCESS");

              if (groupBuyers && groupBuyers.length > 0) {
                for (const buyer of groupBuyers) {
                  if (buyer.buyer_email) {
                    resend.emails.send({
                      from: "LanggananYuk <noreply@langgananyuk.web.id>",
                      to: buyer.buyer_email,
                      subject: `Kredensial Akun Premium ${svcName} Anda! 🎉`,
                      html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 20px;">
                          <h2 style="color: #991b1b; margin-top: 0;">Halo ${buyer.buyer_name},</h2>
                          <p>Kabar baik! Grup patungan <strong>${svcName}</strong> Anda telah penuh (4/4) dan sudah aktif. 🚀</p>
                          <div style="background-color: #fef2f2; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #fee2e2;">
                            <h3 style="margin-top: 0; color: #991b1b; font-size: 16px;">Detail Akun Premium Anda:</h3>
                            <ul style="list-style: none; padding-left: 0; margin-bottom: 0; line-height: 1.6;">
                              <li><strong>Email Akun:</strong> <code style="background-color: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${credential.email}</code></li>
                              <li><strong>Password:</strong> <code style="background-color: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${credential.password}</code></li>
                              <li><strong>Profil:</strong> Profil ${credential.profile_number || "Bebas"}</li>
                              <li><strong>PIN Profil:</strong> <code style="background-color: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${credential.profile_pin || "Tanpa PIN"}</code></li>
                            </ul>
                          </div>
                          <h4 style="color: #991b1b; margin-bottom: 5px;">Syarat & Ketentuan:</h4>
                          <ol style="margin-top: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Dilarang mengubah email/password akun.</li>
                            <li>Dilarang login di lebih dari 1 perangkat secara bersamaan.</li>
                            <li>Gunakan hanya profil yang telah ditentukan untuk Anda.</li>
                          </ol>
                          <p>Selamat menikmati layanan Anda!</p>
                          <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 20px 0;" />
                          <p style="font-size: 11px; color: #991b1b; text-align: center; margin-bottom: 0;">Email ini dikirim otomatis oleh LanggananYuk Support.</p>
                        </div>
                      `
                    }).catch((err) => console.error("Error sending credentials email:", err));
                  }
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
