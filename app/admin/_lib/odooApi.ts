// ─── Types ──────────────────────────────────────────────────

export interface OdooHotel {
  id: number;
  name: string;
  displayName: string;
  arabicName: string;
  image: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  currency: string;
  parentId: number | null;
  isParent: boolean;
  childIds: number[];
  price: number;
  rating: number;
  reviews: number;
  rooms: number;
  propertyView: string;
  guestRating: string;
  roomTypes: string[];
}

export interface OdooApiResponse {
  source: string;
  parentCompany: OdooHotel | null;
  hotels: OdooHotel[];
  error?: string;
}

// ─── API Client ─────────────────────────────────────────────

export async function fetchHotelsFromOdoo(): Promise<OdooApiResponse> {
  try {
    const res = await fetch("/api/admin/odoo/hotels");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: OdooApiResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch hotels from Odoo:", err);
    return { source: "error", parentCompany: null, hotels: [], error: String(err) };
  }
}
