import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { isAuthorizedAdmin } from "@/lib/auth-admin";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const dynamic = "force-dynamic";

// POST: Send a manual email via Resend
export async function POST(req: NextRequest) {
  if (!await isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "to, subject, and html fields are required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "LanggananYuk <noreply@langgananyuk.web.id>",
      to,
      subject,
      html
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
