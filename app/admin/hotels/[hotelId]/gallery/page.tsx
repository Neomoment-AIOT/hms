"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaUndo, FaTrash, FaArrowLeft } from "react-icons/fa";
import ImageUploadModal from "../../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../../_lib/adminStorage";
import { type OdooHotel } from "../../../_lib/odooApi";

export default function HotelGalleryPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const storageKey = STORAGE_KEYS.hotelGallery(hotelId);

  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);

    const defaultImages = found
      ? [found.image]
      : [`/hotel/hotel${(Number(hotelId) % 14) + 1}.jpeg`];
    setImages(getAdminData(storageKey, defaultImages));
  }, [hotelId, storageKey]);

  const handleSave = () => {
    setAdminData(storageKey, images);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(storageKey);
    setImages(hotel ? [hotel.image] : []);
  };

  const handleAddImage = (base64: string) => {
    if (replaceIndex !== null) {
      setImages((prev) =>
        prev.map((img, i) => (i === replaceIndex ? base64 : img))
      );
      setReplaceIndex(null);
    } else {
      setImages((prev) => [...prev, base64]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
            Photo Gallery — {hotel?.name || `#${hotelId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage gallery images for this hotel. {images.length} image(s).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
          >
            <FaUndo size={12} /> Reset
          </button>
          <button
            onClick={() => {
              setReplaceIndex(null);
              setUploadOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
          >
            <FaPlus size={12} /> Add Image
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <p className="text-gray-400 mb-4">No gallery images yet.</p>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
          >
            Add First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden group border border-gray-200"
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => {
                    setReplaceIndex(i);
                    setUploadOpen(true);
                  }}
                  className="bg-white text-gray-800 px-3 py-1.5 rounded text-xs font-medium hover:bg-teal-50 shadow"
                >
                  Replace
                </button>
                <button
                  onClick={() => handleDeleteImage(i)}
                  className="bg-white text-red-500 p-1.5 rounded hover:bg-red-50 shadow"
                >
                  <FaTrash size={12} />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          Save Changes
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>

      <ImageUploadModal
        isOpen={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setReplaceIndex(null);
        }}
        onUpload={handleAddImage}
        currentImage={replaceIndex !== null ? images[replaceIndex] : undefined}
        title={replaceIndex !== null ? "Replace Image" : "Add Gallery Image"}
      />
    </div>
  );
}
