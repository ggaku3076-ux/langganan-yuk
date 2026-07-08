import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "placeholder";

const tempSupabase = createClient(supabaseUrl, supabaseAnonKey);

export async function isAuthorizedAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  if (!token) return false;

  try {
    // Verify user session token using Supabase Auth
    const { data: { user }, error } = await tempSupabase.auth.getUser(token);
    if (error || !user || !user.email) {
      return false;
    }
    
    // Check if the user is the whitelisted admin email
    const allowedAdminEmail = (process.env.ADMIN_EMAIL || "rehanalay9@gmail.com").toLowerCase();
    return user.email.toLowerCase() === allowedAdminEmail;
  } catch (err) {
    console.error("Admin authorization check error:", err);
    return false;
  }
}
