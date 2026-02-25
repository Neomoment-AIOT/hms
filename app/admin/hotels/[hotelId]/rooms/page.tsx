"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaUndo, FaArrowLeft, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import ImageUploadModal from "../../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../../_lib/adminStorage";
import { type OdooHotel } from "../../../_lib/odooApi";

interface RoomPhoto {
  id: number;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  image: string;
}

const defaultRooms: RoomPhoto[] = [
  { id: 1, titleEn: "Deluxe Room", titleAr: "غرفة ديلوكس", subtitleEn: "Spacious room with modern amenities", subtitleAr: "غرفة واسعة مع وسائل الراحة الحديثة", image: "/Hotel_Room/deluxeroom.jpeg" },
  { id: 2, titleEn: "Family Room", titleAr: "غرفة عائلية", subtitleEn: "Perfect for families", subtitleAr: "مثالية للعائلات", image: "/Hotel_Room/familyroom.jpg" },
  { id: 3, titleEn: "Guest Room", titleAr: "غرفة ضيوف", subtitleEn: "Comfortable guest room", subtitleAr: "غرفة ضيوف مريحة", image: "/Hotel_Room/guestroom.jpg" },
  { id: 4, titleEn: "Luxury Room", titleAr: "غرفة فاخرة", subtitleEn: "Premium luxury experience", subtitleAr: "تجربة فاخرة متميزة", image: "/Hotel_Room/luxuryroom.jpg" },
  { id: 5, titleEn: "Dining", titleAr: "صالة الطعام", subtitleEn: "Fine dining experience", subtitleAr: "تجربة طعام راقية", image: "/Hotel_Room/dinings.jpeg" },
  { id: 6, titleEn: "Studio Suite", titleAr: "جناح ستوديو", subtitleEn: "Modern studio suite", subtitleAr: "جناح ستوديو حديث", image: "/Hotel_Room/studiosuite.jpg" },
];

export default function HotelRoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const storageKey = STORAGE_KEYS.hotelRooms(hotelId);

  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const [rooms, setRooms] = useState<RoomPhoto[]>(defaultRooms);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);
    setRooms(getAdminData(storageKey, defaultRooms));
  }, [hotelId, storageKey]);

  const handleSave = () => {
    setAdminData(storageKey, rooms);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(storageKey);
    setRooms(defaultRooms);
    setEditId(null);
  };

  const handleAdd = () => {
    const newRoom: RoomPhoto = {
      id: Date.now(),
      titleEn: "New Room Type",
      titleAr: "نوع غرفة جديد",
      subtitleEn: "Description...",
      subtitleAr: "الوصف...",
      image: "/Hotel_Room/guestroom.jpg",
    };
    setRooms((prev) => [...prev, newRoom]);
    setEditId(newRoom.id);
  };

  const handleDelete = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoom = (id: number, field: keyof RoomPhoto, value: string) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
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
            Room Photos — {hotel?.name || `#${hotelId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage room type photos for this hotel.
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

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            {/* Image */}
            <div className="relative h-44 cursor-pointer" onClick={() => setUploadId(room.id)}>
              <img src={room.image} alt={room.titleEn} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <span className="text-white text-xs bg-black/50 px-3 py-1 rounded">Replace Image</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              {editId === room.id ? (
                <div className="space-y-2">
                  <input type="text" value={room.titleEn} onChange={(e) => updateRoom(room.id, "titleEn", e.target.value)} placeholder="Room Type (EN)" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={room.titleAr} onChange={(e) => updateRoom(room.id, "titleAr", e.target.value)} placeholder="Room Type (AR)" dir="rtl" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={room.subtitleEn} onChange={(e) => updateRoom(room.id, "subtitleEn", e.target.value)} placeholder="Subtitle (EN)" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={room.subtitleAr} onChange={(e) => updateRoom(room.id, "subtitleAr", e.target.value)} placeholder="Subtitle (AR)" dir="rtl" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <button onClick={() => setEditId(null)} className="text-xs text-teal-600 hover:underline">Done</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{room.titleEn}</p>
                    <p className="text-xs text-gray-500">{room.subtitleEn}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditId(room.id)} className="p-1.5 text-gray-400 hover:text-teal-600"><FaEdit size={12} /></button>
                    <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-500"><FaTrash size={12} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Save Changes</button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>

      {uploadId !== null && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setUploadId(null)}
          onUpload={(base64) => {
            updateRoom(uploadId, "image", base64);
            setUploadId(null);
          }}
          currentImage={rooms.find((r) => r.id === uploadId)?.image}
          title="Replace Room Photo"
        />
      )}
    </div>
  );
}
