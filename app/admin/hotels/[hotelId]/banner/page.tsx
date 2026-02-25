"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaImage, FaUndo, FaArrowLeft } from "react-icons/fa";
import ImageUploadModal from "../../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../../_lib/adminStorage";
import { type OdooHotel } from "../../../_lib/odooApi";

interface HotelBannerData {
  imageUrl: string;
  titleEn: string;
  titleAr: string;
}

export default function HotelBannerPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const storageKey = STORAGE_KEYS.hotelBanner(hotelId);

  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const defaultBanner: HotelBannerData = {
    imageUrl: hotel?.image || "/banner.jpg",
    titleEn: hotel?.name || "",
    titleAr: hotel?.arabicName || "",
  };

  const [banner, setBanner] = useState<HotelBannerData>(defaultBanner);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);

    const def: HotelBannerData = {
      imageUrl: found?.image || "/banner.jpg",
      titleEn: found?.name || "",
      titleAr: found?.arabicName || "",
    };
    setBanner(getAdminData(storageKey, def));
  }, [hotelId, storageKey]);

  const handleSave = () => {
    setAdminData(storageKey, banner);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(storageKey);
    setBanner({
      imageUrl: hotel?.image || "/banner.jpg",
      titleEn: hotel?.name || "",
      titleAr: hotel?.arabicName || "",
    });
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
            Hotel Banner — {hotel?.name || `#${hotelId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the hero banner for this hotel.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
        >
          <FaUndo size={12} /> Reset
        </button>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="relative h-64">
          <img
            src={banner.imageUrl}
            alt="Hotel Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={() => setUploadOpen(true)}
              className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-white shadow"
            >
              <FaImage size={14} /> Replace Image
            </button>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={banner.titleEn}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, titleEn: e.target.value }))
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={banner.titleAr}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, titleAr: e.target.value }))
              }
              dir="rtl"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
          >
            Save Changes
          </button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>

      <ImageUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(base64) =>
          setBanner((prev) => ({ ...prev, imageUrl: base64 }))
        }
        currentImage={banner.imageUrl}
        title="Replace Hotel Banner"
      />
    </div>
  );
}
