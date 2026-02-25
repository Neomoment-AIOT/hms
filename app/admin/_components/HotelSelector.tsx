"use client";

import { useRouter } from "next/navigation";
import { type OdooHotel } from "../_lib/odooApi";

interface HotelSelectorProps {
  hotels: OdooHotel[];
  currentHotelId: string | number;
  basePath?: string; // e.g. "/admin/hotels" — appends /{id}
}

export default function HotelSelector({
  hotels,
  currentHotelId,
  basePath = "/admin/hotels",
}: HotelSelectorProps) {
  const router = useRouter();

  return (
    <select
      value={String(currentHotelId)}
      onChange={(e) => router.push(`${basePath}/${e.target.value}`)}
      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      {hotels.map((h) => (
        <option key={h.id} value={String(h.id)}>
          {h.name}
        </option>
      ))}
    </select>
  );
}
