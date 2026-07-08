import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendWhatsApp } from "@/lib/fonnte";
import { services, formatRupiah } from "@/data/services";

export const dynamic = "force-dynamic";

// Helper to generate a random uppercase alphanumeric string
function generateRandomId(prefix: string, length: number) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

// POST: Create checkout order and store pending transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, whatsapp, email, serviceId, optionLabel, price, groupId } = body;

    if (!name || !whatsapp || !email || !serviceId || !optionLabel || !price || !groupId) {
      return NextResponse.json({ error: "Missing required checkout parameters" }, { status: 400 });
    }

    // 1. Double check if the group exists and is not full yet
    const { data: group, error: groupErr } = await supabaseAdmin
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (groupErr || !group) {
      return NextResponse.json({ error: "Grup patungan tidak ditemukan" }, { status: 404 });
    }

    if (group.status === "full") {
      return NextResponse.json({ error: "Grup ini sudah penuh, silakan refresh halaman untuk masuk ke grup berikutnya" }, { status: 400 });
    }

    // 2. Generate Transaction IDs
    const transactionId = generateRandomId("TRX", 6);
    const referenceId = generateRandomId("PAY", 8);

    // 3. Create the transaction record in Supabase with PENDING status
    const { error: insertErr } = await supabaseAdmin
      .from("transactions")
      .insert({
        id: transactionId,
        group_id: groupId,
        buyer_name: name,
        whatsapp_number: whatsapp,
        buyer_email: email,
        service_id: serviceId,
        option_label: optionLabel,
        price: price,
        status: "PENDING",
        reference_id: referenceId
      });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 550 });
    }

    // Midtrans Snap API call
    let snapToken = "";
    let snapRedirectUrl = "";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    if (serverKey) {
      const midtransUrl = isProduction
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions";

      const authHeader = Buffer.from(`${serverKey}:`).toString("base64");
      
      try {
        const midtransRes = await fetch(midtransUrl, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Basic ${authHeader}`
          },
          body: JSON.stringify({
            transaction_details: {
              order_id: transactionId,
              gross_amount: price
            },
            customer_details: {
              first_name: name,
              phone: whatsapp
            }
          })
        });

        const midtransData = await midtransRes.json();
        if (midtransRes.ok) {
          snapToken = midtransData.token;
          snapRedirectUrl = midtransData.redirect_url;
        } else {
          console.error("Midtrans Snap API Error:", midtransData);
        }
      } catch (err) {
        console.error("Error connecting to Midtrans API:", err);
      }
    }

    // 4. Return the generated transaction, redirect URL and token
    return NextResponse.json({
      success: true,
      transaction: {
        id: transactionId,
        referenceId: referenceId,
        price: price,
        name: name,
        whatsapp: whatsapp,
        groupId: groupId,
        serviceId: serviceId
      },
      redirectUrl: snapRedirectUrl,
      token: snapToken,
      // Using a placeholder QRIS string for scanning simulator fallback
      qrisUrl: "00020101021226590016ID.CO.QRIS.WWW0215ID10202111192830303000-qris-payload-simulation-langgananyuk"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
