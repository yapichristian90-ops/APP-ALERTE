import type { MobileMoneyProvider } from "@/types";
import { supabase } from "./supabase";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Non connecté.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export interface PaymentSession {
  paymentId: string;
  checkoutUrl: string | null;
  provider: MobileMoneyProvider;
  amount: number;
}

export async function initiatePremiumPayment(provider: MobileMoneyProvider): Promise<PaymentSession> {
  const { data, error } = await supabase.functions.invoke("initiate-payment", {
    body: { provider },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as PaymentSession;
}

export async function fetchMyPayments() {
  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
