"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaUndo, FaEdit, FaTrash, FaCheck, FaHotel } from "react-icons/fa";
import ImageUploadModal from "../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../_lib/adminStorage";
import { type OdooHotel } from "../../_lib/odooApi";

interface FeaturedHotel {
  id: number;
  odooId: number | null; // links to Odoo branch, null if manually added
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  order: number;
}

const defaultFeatured: FeaturedHotel[] = [
  { id: 1, odooId: 36, nameEn: "Kudi Tower", nameAr: "كدي تاور", price: 250, imageUrl: "/hotel/hotel1.jpg", order: 1 },
  { id: 2, odooId: 41, nameEn: "Al-Rifaa Al-Sad", nameAr: "فندق الرفاع السد", price: 290, imageUrl: "/hotel/hotel2.jpeg", order: 2 },
  { id: 3, odooId: 34, nameEn: "Kanaf", nameAr: "فندق كرم الرفاع", price: 190, imageUrl: "/hotel/hotel3.jpeg", order: 3 },
  { id: 4, odooId: 40, nameEn: "Barkat Al-Rifaa", nameAr: "فندق بركة الرفاع", price: 224, imageUrl: "/hotel/hotel4.jpeg", order: 4 },
  { id: 5, odooId: 37, nameEn: "Nasmat Al-Khair", nameAr: "فندق نسمات الخير", price: 184, imageUrl: "/hotel/hotel5.jpeg", order: 5 },
  { id: 6, odooId: 49, nameEn: "Al-Fajr Al-Badee", nameAr: "الفجر البديع", price: 204, imageUrl: "/hotel/hotel6.jpeg", order: 6 },
  { id: 7, odooId: 48, nameEn: "Al-Rifaa Rea Bakhsh", nameAr: "فندق الرفاع ريع بخش", price: 180, imageUrl: "/hotel/hotel7.jpeg", order: 7 },
  { id: 8, odooId: 29, nameEn: "Rawabi Al-Salam", nameAr: "فندق روابي السلام", price: 154, imageUrl: "/hotel/hotel8.jpeg", order: 8 },
];

export default function OffersManagementPage() {
  const [featured, setFeatured] = useState<FeaturedHotel[]>(defaultFeatured);
  const [odooHotels, setOdooHotels] = useState<OdooHotel[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setFeatured(getAdminData(STORAGE_KEYS.GLOBAL_OFFERS, defaultFeatured));
    setOdooHotels(getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []));
  }, []);

  const handleSave = () => {
    setAdminData(STORAGE_KEYS.GLOBAL_OFFERS, featured);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(STORAGE_KEYS.GLOBAL_OFFERS);
    setFeatured(defaultFeatured);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setFeatured((prev) => prev.filter((o) => o.id !== id));
  };

  // Add a hotel from Odoo picker
  const handleAddFromOdoo = (hotel: OdooHotel) => {
    const existing = featured.find((f) => f.odooId === hotel.id);
    if (existing) return; // already added

    const newItem: FeaturedHotel = {
      id: Date.now(),
      odooId: hotel.id,
      nameEn: hotel.name,
      nameAr: hotel.arabicName || hotel.name,
      price: 0,
      imageUrl: hotel.image || "/hotel/hotel1.jpg",
      order: featured.length + 1,
    };
    setFeatured((prev) => [...prev, newItem]);
    setShowPicker(false);
    setEditId(newItem.id);
  };

  // Add a custom (non-Odoo) hotel
  const handleAddManual = () => {
    const newItem: FeaturedHotel = {
      id: Date.now(),
      odooId: null,
      nameEn: "New Hotel",
      nameAr: "فندق جديد",
      price: 100,
      imageUrl: "/hotel/hotel1.jpg",
      order: featured.length + 1,
    };
    setFeatured((prev) => [...prev, newItem]);
    setEditId(newItem.id);
  };

  const updateItem = (id: number, field: keyof FeaturedHotel, value: string | number | null) => {
    setFeatured((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  // Hotels not yet featured
  const availableHotels = odooHotels.filter(
    (h) => !featured.some((f) => f.odooId === h.id)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Hotels Selected For You
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure which hotels appear in the &quot;Hotels selected for you&quot; homepage section.
            {featured.length} hotel(s) currently featured.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500">
            <FaUndo size={12} /> Reset
          </button>
          <button onClick={handleAddManual} className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
            <FaPlus size={12} /> Add Manual
          </button>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
          >
            <FaHotel size={12} /> Add from Odoo
          </button>
        </div>
      </div>

      {/* Odoo Hotel Picker */}
      {showPicker && (
        <div className="bg-white rounded-xl border border-teal-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Select a hotel branch from Odoo
            </h3>
            <button onClick={() => setShowPicker(false)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
          </div>
          {availableHotels.length === 0 ? (
            <p className="text-sm text-gray-400">
              {odooHotels.length === 0
                ? "No Odoo hotels loaded. Go to Hotels page and click \"Sync from Odoo\" first."
                : "All Odoo branches are already featured."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {availableHotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => handleAddFromOdoo(hotel)}
                  className="text-left bg-gray-50 rounded-lg border border-gray-200 p-3 hover:border-teal-400 hover:bg-teal-50 transition-colors"
                >
                  <div className="w-full h-20 rounded overflow-hidden mb-2">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{hotel.name}</p>
                  <p className="text-xs text-gray-500 truncate">{hotel.city || hotel.location}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Hotels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {featured
          .sort((a, b) => a.order - b.order)
          .map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            {/* Order badge */}
            <div className="relative">
              <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              {item.odooId && (
                <div className="absolute top-2 right-2 z-10 bg-teal-600/80 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <FaHotel size={8} /> Odoo #{item.odooId}
                </div>
              )}

              {/* Image */}
              <div className="relative h-44 cursor-pointer" onClick={() => setUploadId(item.id)}>
                <img src={item.imageUrl} alt={item.nameEn} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white text-xs bg-black/50 px-3 py-1 rounded">Replace Image</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              {editId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.nameEn}
                    onChange={(e) => updateItem(item.id, "nameEn", e.target.value)}
                    placeholder="Hotel Name (EN)"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={item.nameAr}
                    onChange={(e) => updateItem(item.id, "nameAr", e.target.value)}
                    placeholder="Hotel Name (AR)"
                    dir="rtl"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.price}
                      min={0}
                      onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                      placeholder="Price/Night"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      value={item.order}
                      min={1}
                      onChange={(e) => updateItem(item.id, "order", Number(e.target.value))}
                      placeholder="Order"
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button onClick={() => setEditId(null)} className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                    <FaCheck size={10} /> Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.nameEn}</p>
                    <p className="text-xs text-gray-400 truncate" dir="rtl">{item.nameAr}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.price > 0 ? `SAR ${item.price} / night` : "Price not set"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => setEditId(item.id)} className="p-1.5 text-gray-400 hover:text-teal-600">
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {featured.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <FaHotel size={32} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 mb-2">No featured hotels yet.</p>
          <p className="text-sm text-gray-400">
            Click &quot;Add from Odoo&quot; to select hotel branches, or &quot;Add Manual&quot; to create custom entries.
          </p>
        </div>
      )}

      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-blue-700">
          <strong>Preview:</strong> These hotels will appear in the &quot;Hotels selected for you&quot; section on the homepage.
          Each card shows the hotel image, name (EN/AR), rating status, and price per night in SAR.
          Drag order is controlled by the &quot;Order&quot; field.
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
          Save All Changes
        </button>
        {saved && <span className="text-sm text-green-600">Saved successfully!</span>}
      </div>

      {uploadId !== null && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setUploadId(null)}
          onUpload={(base64) => {
            updateItem(uploadId, "imageUrl", base64);
            setUploadId(null);
          }}
          currentImage={featured.find((o) => o.id === uploadId)?.imageUrl}
          title="Replace Hotel Image"
        />
      )}
    </div>
  );
}
