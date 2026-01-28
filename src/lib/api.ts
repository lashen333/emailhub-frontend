// src\lib\api.ts
import { supabase } from "./supabaseClient";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiGetMe() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return null; // 👈 do NOT throw
  }

  const res = await fetch(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Unauthorized");
  }

  return res.json();
}
