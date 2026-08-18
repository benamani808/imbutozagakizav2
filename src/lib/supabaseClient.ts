import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Member, Message, Prayer, Subscriber, Donation } from "./site-content";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves a new member registration to Supabase if configured.
 */
export async function syncMemberToSupabase(member: Member): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("members").insert([
      {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        location: member.location,
        interest: member.interest,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase member insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase member sync error:", err);
    return false;
  }
}

/**
 * Saves a contact message to Supabase if configured.
 */
export async function syncMessageToSupabase(message: Message): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("messages").insert([
      {
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase message insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase message sync error:", err);
    return false;
  }
}

/**
 * Saves a prayer request to Supabase if configured.
 */
export async function syncPrayerToSupabase(prayer: Prayer): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("prayers").insert([
      {
        id: prayer.id,
        name: prayer.name,
        email: prayer.email,
        request: prayer.request,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase prayer insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase prayer sync error:", err);
    return false;
  }
}

/**
 * Saves a newsletter subscriber to Supabase if configured.
 */
export async function syncSubscriberToSupabase(subscriber: Subscriber): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("newsletter").insert([
      {
        id: subscriber.id,
        email: subscriber.email,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase newsletter insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase newsletter sync error:", err);
    return false;
  }
}

/**
 * Saves a donation record to Supabase if configured.
 */
export async function syncDonationToSupabase(donation: Donation): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("donations").insert([
      {
        id: donation.id,
        name: donation.name,
        email: donation.email,
        amount: donation.amount,
        currency: donation.currency,
        reference: donation.reference,
        status: donation.status,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase donation insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase donation sync error:", err);
    return false;
  }
}
