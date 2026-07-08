import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/fonnte";
import { isAuthorizedAdmin } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

// POST: Send a manual WhatsApp message via Fonnte
export async function POST(req: NextRequest) {
  if (!await isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { target, message } = body;

    if (!target || !message) {
      return NextResponse.json({ error: "Target (WhatsApp Number) and Message are required" }, { status: 400 });
    }

    const success = await sendWhatsApp(target, message);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to send WhatsApp message via Fonnte. Check token configuration." }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
