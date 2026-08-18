/**
 * Minimal Flutterwave Checkout helper.
 * Loads the official inline checkout script on demand (no npm package added).
 */

const SCRIPT_SRC = "https://checkout.flutterwave.com/v3.js";

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: Record<string, unknown>) => { close: () => void };
  }
}

let loading: Promise<void> | null = null;

export function loadFlutterwave(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.FlutterwaveCheckout) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("Failed to load the Flutterwave checkout script."));
    };
    document.head.appendChild(script);
  });

  return loading;
}

export type DonationPayload = {
  publicKey: string;
  name: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  title: string;
};

export type DonationResult = {
  status: string;
  reference: string;
};

export async function payWithFlutterwave(payload: DonationPayload): Promise<DonationResult | null> {
  await loadFlutterwave();
  const checkout = window.FlutterwaveCheckout;
  if (!checkout) throw new Error("Flutterwave checkout is unavailable.");

  const reference = `FIZ-${Date.now()}`;

  return new Promise<DonationResult | null>((resolve) => {
    let settled = false;
    const modal = checkout({
      public_key: payload.publicKey,
      tx_ref: reference,
      amount: payload.amount,
      currency: payload.currency,
      payment_options: "card,mobilemoneyrwanda,mobilemoneyghana,ussd,banktransfer",
      customer: {
        email: payload.email,
        name: payload.name,
        phone_number: payload.phone ?? "",
      },
      customizations: {
        title: payload.title,
        description: "Donation / Impano",
      },
      callback: (response: { status?: string; tx_ref?: string; transaction_id?: number }) => {
        settled = true;
        modal.close();
        resolve({
          status: response.status ?? "completed",
          reference: response.tx_ref ?? reference,
        });
      },
      onclose: () => {
        if (!settled) resolve(null);
      },
    });
  });
}
