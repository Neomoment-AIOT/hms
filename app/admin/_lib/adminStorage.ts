// ─── Storage Keys ───────────────────────────────────────────

export const STORAGE_KEYS = {
  // Global media (parent company / website-wide)
  GLOBAL_BANNER: "admin_global_banner",
  GLOBAL_BLOGS: "admin_global_blogs",
  GLOBAL_OFFERS: "admin_global_offers",
  GLOBAL_REVIEWS: "admin_global_reviews",
  PDF_LABELS: "admin_pdf_labels",

  // Odoo data cache
  ODOO_HOTELS: "admin_odoo_hotels",
  ODOO_PARENT: "admin_odoo_parent",
  DISABLED_HOTELS: "admin_disabled_hotels",

  // Per-hotel media (use with hotelId)
  hotelBanner: (id: number | string) => `admin_hotel_${id}_banner`,
  hotelGallery: (id: number | string) => `admin_hotel_${id}_gallery`,
  hotelRooms: (id: number | string) => `admin_hotel_${id}_rooms`,
  hotelReviews: (id: number | string) => `admin_hotel_${id}_reviews`,
  hotelPricing: (id: number | string) => `admin_hotel_${id}_pricing`,
} as const;

// ─── Generic Helpers ────────────────────────────────────────

export function getAdminData<T>(key: string, defaultData: T): T {
  if (typeof window === "undefined") return defaultData;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

export function setAdminData<T>(key: string, data: T): { ok: true } | { ok: false; error: string } {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
    return { ok: true };
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      const usedMB = getLocalStorageUsageMB();
      return {
        ok: false,
        error: `Storage quota exceeded (${usedMB}MB used). Reduce media file sizes, use URLs instead of uploads, or remove unused data.`,
      };
    }
    return { ok: false, error: "Failed to save data to storage." };
  }
}

export function removeAdminData(key: string): void {
  localStorage.removeItem(key);
}

// ─── Hotel Enable/Disable ───────────────────────────────────

export function getDisabledHotels(): Record<string, boolean> {
  return getAdminData<Record<string, boolean>>(STORAGE_KEYS.DISABLED_HOTELS, {});
}

export function setHotelDisabled(hotelId: number | string, disabled: boolean): void {
  const current = getDisabledHotels();
  if (disabled) {
    current[String(hotelId)] = true;
  } else {
    delete current[String(hotelId)];
  }
  setAdminData(STORAGE_KEYS.DISABLED_HOTELS, current);
}

export function isHotelDisabled(hotelId: number | string): boolean {
  const disabled = getDisabledHotels();
  return disabled[String(hotelId)] === true;
}

// ─── Storage Usage ──────────────────────────────────────────

export function getLocalStorageUsageMB(): number {
  if (typeof window === "undefined") return 0;
  let total = 0;
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += (localStorage[key].length + key.length) * 2; // UTF-16 = 2 bytes/char
    }
  }
  return parseFloat((total / (1024 * 1024)).toFixed(2));
}
