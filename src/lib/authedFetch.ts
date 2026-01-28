// src\lib\authedFetch.ts

//centralized auth
import { supabase } from "@/lib/supabaseClient";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function authedFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No token");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Request failed");
  return json as T;
}
