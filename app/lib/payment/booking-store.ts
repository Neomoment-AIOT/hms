/**
 * booking-store.ts
 *
 * Simple in-memory store that holds booking data between:
 *   1. Payment initiation  (GuestDetailsPage saves data)
 *   2. Webhook arrival     (webhook retrieves data to confirm booking in Odoo)
 *
 * Keyed by orderRef  →  "HMS-{hotelId}-{timestamp}"
 *
 * NOTE: This is process-memory only — it survives page refreshes but NOT
 * a Next.js server restart. For production, replace with Redis or a DB table.
 * That's fine for now since the webhook fires within seconds of payment.
 *
 * Auto-expires entries after 2 hours to prevent memory leaks.
 */

export type BookingSession = {
  orderRef:        string;          // "HMS-17-1779689473504"
  hotelId:         number;
  roomTypeId:      number;
  checkIn:         string;          // "YYYY-MM-DD"
  checkOut:        string;
  roomCount:       number;
  adults:          number;
  children:        number;
  pax:             number;
  guestFirstName:  string;
  guestLastName:   string;
  guestEmail:      string;
  guestMobile:     string;
  guestCountry:    string;   // nationality — maps to adult_details[0].nationality in Odoo
  amount:          number;          // SAR
  meals:           { id: number; description: string; unit_price: number }[];
  mealPatternId:   number | null;
  additionalNotes: string;
  specialRequest:  string;
  savedAt:         number;          // Date.now()
};

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Pin the store to `globalThis` so it survives Next.js hot-reloads in dev mode.
 * In production (single load), this behaves identically to a plain module-level Map.
 *
 * Without this, Next.js re-compiles the module between requests and re-initialises
 * the Map — causing webhook lookups to fail immediately after session save.
 */
const g = globalThis as typeof globalThis & {
  __hmsBookingStore?: Map<string, BookingSession>;
};
if (!g.__hmsBookingStore) {
  g.__hmsBookingStore = new Map<string, BookingSession>();
}
const store = g.__hmsBookingStore;

export function saveBookingSession(session: BookingSession): void {
  // Prune expired entries on every write
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now - val.savedAt > TTL_MS) store.delete(key);
  }
  store.set(session.orderRef, { ...session, savedAt: now });
}

export function getBookingSession(orderRef: string): BookingSession | null {
  const entry = store.get(orderRef);
  if (!entry) return null;
  if (Date.now() - entry.savedAt > TTL_MS) {
    store.delete(orderRef);
    return null;
  }
  return entry;
}

export function deleteBookingSession(orderRef: string): void {
  store.delete(orderRef);
}
