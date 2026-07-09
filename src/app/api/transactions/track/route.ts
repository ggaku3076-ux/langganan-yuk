import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { services } from "@/data/services";

export const dynamic = "force-dynamic";

// Masking helper
function maskName(rawName: string) {
  if (!rawName) return "Kosong";
  const firstChar = rawName.charAt(0).toLowerCase();
  let masked = firstChar;
  for (let i = 1; i < rawName.length; i++) {
    if (rawName[i] === " ") {
      masked += " ";
    } else {
      masked += "x";
    }
  }
  return masked;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing invoice ID parameter" }, { status: 400 });
  }

  try {
    // 1. Fetch the target transaction
    const { data: transaction, error: trxErr } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", id.toUpperCase())
      .single();

    if (trxErr || !transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan. Periksa kembali Kode Invoice Anda." }, { status: 404 });
    }

    // 2. Fetch the group details and all transactions in it
    const { data: group, error: groupErr } = await supabaseAdmin
      .from("groups")
      .select("*, transactions(*)")
      .eq("id", transaction.group_id)
      .single();

    if (groupErr || !group) {
      return NextResponse.json({ error: "Grup patungan tidak ditemukan untuk transaksi ini." }, { status: 404 });
    }

    // 3. Find service metadata
    const service = services.find((s) => s.id === transaction.service_id);
    const serviceName = service ? service.name : transaction.service_id;
    const logoUrl = service ? service.logoUrl : "";

    // 4. Map the group slots
    const allTrxs = group.transactions || [];
    const successTrxs = allTrxs.filter((t: any) => t.status === "SUCCESS");
    
    // Sort transactions by created_at to keep order consistent
    allTrxs.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const isGroupFull = successTrxs.length >= group.max_slots;

    const slots = Array.from({ length: group.max_slots }, (_, i) => {
      const tx = allTrxs[i];
      if (tx) {
        // If it's the user's transaction, show raw name. Otherwise mask it.
        const isSelf = tx.id === transaction.id;
        const displayName = isSelf 
          ? tx.buyer_name 
          : (isGroupFull ? maskName(tx.buyer_name) : tx.buyer_name);

        return {
          id: tx.id,
          name: displayName,
          occupied: true,
          status: tx.status,
          isSelf
        };
      }
      return {
        id: null,
        name: "Kosong",
        occupied: false,
        status: null,
        isSelf: false
      };
    });

    // 5. If pending, fetch a new snap token from Midtrans
    let snapToken = "";
    let snapRedirectUrl = "";
    if (transaction.status === "PENDING") {
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
                order_id: transaction.id,
                gross_amount: transaction.price
              },
              customer_details: {
                first_name: transaction.buyer_name,
                phone: transaction.whatsapp_number
              }
            })
          });

          const midtransData = await midtransRes.json();
          if (midtransRes.ok) {
            snapToken = midtransData.token;
            snapRedirectUrl = midtransData.redirect_url;
          }
        } catch (err) {
          console.error("Error fetching token during track:", err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        buyerName: transaction.buyer_name,
        buyerEmail: transaction.buyer_email,
        whatsappNumber: transaction.whatsapp_number,
        serviceId: transaction.service_id,
        serviceName,
        logoUrl,
        optionLabel: transaction.option_label,
        price: transaction.price,
        status: transaction.status,
        createdAt: transaction.created_at,
        referenceId: transaction.reference_id
      },
      group: {
        id: group.id,
        name: `Grup ${serviceName} #${group.group_number}`,
        filled: successTrxs.length,
        total: group.max_slots,
        isFull: isGroupFull,
        status: group.status,
        slots
      },
      token: snapToken,
      redirectUrl: snapRedirectUrl
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
