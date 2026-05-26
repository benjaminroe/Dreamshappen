export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "AED";

// Amounts are stored as integer minor units (fils for AED, 1 AED = 100 fils).
export function formatMoney(minorUnits: number, currency: string = CURRENCY): string {
  const major = minorUnits / 100;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(major);
}
