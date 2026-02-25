"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaUndo, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../../_lib/adminStorage";
import { type OdooHotel } from "../../../_lib/odooApi";

interface RoomPrice {
  id: number;
  roomTypeEn: string;
  roomTypeAr: string;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedType: string;
  breakfast: boolean;
}

const defaultPricing: RoomPrice[] = [
  { id: 1, roomTypeEn: "Standard Room", roomTypeAr: "غرفة عادية", pricePerNight: 500, currency: "SAR", maxGuests: 2, bedType: "Double", breakfast: false },
  { id: 2, roomTypeEn: "Deluxe Room", roomTypeAr: "غرفة ديلوكس", pricePerNight: 800, currency: "SAR", maxGuests: 2, bedType: "King", breakfast: true },
  { id: 3, roomTypeEn: "Family Room", roomTypeAr: "غرفة عائلية", pricePerNight: 1200, currency: "SAR", maxGuests: 4, bedType: "Twin + Double", breakfast: true },
  { id: 4, roomTypeEn: "Suite", roomTypeAr: "جناح", pricePerNight: 2000, currency: "SAR", maxGuests: 3, bedType: "King", breakfast: true },
];

export default function HotelPricingPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const storageKey = STORAGE_KEYS.hotelPricing(hotelId);

  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const [pricing, setPricing] = useState<RoomPrice[]>(defaultPricing);
  const [editId, setEditId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);
    setPricing(getAdminData(storageKey, defaultPricing));
  }, [hotelId, storageKey]);

  const handleSave = () => {
    setAdminData(storageKey, pricing);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(storageKey);
    setPricing(defaultPricing);
    setEditId(null);
  };

  const handleAdd = () => {
    const newRoom: RoomPrice = {
      id: Date.now(),
      roomTypeEn: "New Room Type",
      roomTypeAr: "نوع غرفة جديد",
      pricePerNight: 500,
      currency: hotel?.currency || "SAR",
      maxGuests: 2,
      bedType: "Double",
      breakfast: false,
    };
    setPricing((prev) => [...prev, newRoom]);
    setEditId(newRoom.id);
  };

  const handleDelete = (id: number) => {
    setPricing((prev) => prev.filter((r) => r.id !== id));
  };

  const updatePrice = (id: number, field: keyof RoomPrice, value: string | number | boolean) => {
    setPricing((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div>
      <Link
        href={`/admin/hotels/${hotelId}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-4"
      >
        <FaArrowLeft size={12} />
        Back to {hotel?.name || "Hotel"}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Pricing — {hotel?.name || `#${hotelId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure room rates and pricing for this hotel. Currency: {hotel?.currency || "SAR"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500">
            <FaUndo size={12} /> Reset
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            <FaPlus size={12} /> Add Room Type
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Room Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Arabic Name</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">Price/Night</th>
                <th className="text-center px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Guests</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden lg:table-cell">Bed Type</th>
                <th className="text-center px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Breakfast</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 last:border-0">
                  {editId === room.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input type="text" value={room.roomTypeEn} onChange={(e) => updatePrice(room.id, "roomTypeEn", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <input type="text" value={room.roomTypeAr} onChange={(e) => updatePrice(room.id, "roomTypeAr", e.target.value)} dir="rtl" className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-5 py-3">
                        <input type="number" value={room.pricePerNight} min={0} onChange={(e) => updatePrice(room.id, "pricePerNight", Number(e.target.value))} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-5 py-3 text-center hidden sm:table-cell">
                        <input type="number" value={room.maxGuests} min={1} max={10} onChange={(e) => updatePrice(room.id, "maxGuests", Number(e.target.value))} className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <input type="text" value={room.bedType} onChange={(e) => updatePrice(room.id, "bedType", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </td>
                      <td className="px-5 py-3 text-center hidden sm:table-cell">
                        <input type="checkbox" checked={room.breakfast} onChange={(e) => updatePrice(room.id, "breakfast", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setEditId(null)} className="text-xs text-teal-600 hover:underline">Done</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium text-gray-900">{room.roomTypeEn}</td>
                      <td className="px-5 py-3 text-gray-500 hidden md:table-cell" dir="rtl">{room.roomTypeAr}</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        {room.pricePerNight.toLocaleString()} <span className="text-gray-400 font-normal text-xs">{room.currency}</span>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-600 hidden sm:table-cell">{room.maxGuests}</td>
                      <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{room.bedType}</td>
                      <td className="px-5 py-3 text-center hidden sm:table-cell">
                        <span className={`inline-block w-5 h-5 rounded-full text-xs flex items-center justify-center ${room.breakfast ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {room.breakfast ? "✓" : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditId(room.id)} className="p-1.5 text-gray-400 hover:text-teal-600"><FaEdit size={12} /></button>
                          <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-500"><FaTrash size={12} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Save Changes</button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}
