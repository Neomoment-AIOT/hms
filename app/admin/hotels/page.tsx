"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSync, FaImage, FaBed, FaStar, FaMapMarkerAlt, FaPhone, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { fetchHotelsFromOdoo, type OdooHotel } from "../_lib/odooApi";
import { getAdminData, setAdminData, STORAGE_KEYS, getDisabledHotels, setHotelDisabled } from "../_lib/adminStorage";

export default function HotelsListPage() {
  const [hotels, setHotels] = useState<OdooHotel[]>([]);
  const [parentCompany, setParentCompany] = useState<OdooHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("loading");
  const [error, setError] = useState<string | null>(null);
  const [disabledMap, setDisabledMap] = useState<Record<string, boolean>>({});

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotelsFromOdoo();
      setHotels(data.hotels);
      setParentCompany(data.parentCompany);
      setAdminData(STORAGE_KEYS.ODOO_HOTELS, data.hotels);
      if (data.parentCompany) {
        setAdminData(STORAGE_KEYS.ODOO_PARENT, data.parentCompany);
      }
      setSource(data.source);
      if (data.error) setError(data.error);
    } catch {
      const cached = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
      const cachedParent = getAdminData<OdooHotel | null>(STORAGE_KEYS.ODOO_PARENT, null);
      setHotels(cached);
      setParentCompany(cachedParent);
      setSource("cached");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHotels();
    setDisabledMap(getDisabledHotels());
  }, []);

  const toggleHotel = (hotelId: number, e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    const currentlyDisabled = disabledMap[String(hotelId)] === true;
    setHotelDisabled(hotelId, !currentlyDisabled);
    setDisabledMap((prev) => {
      const next = { ...prev };
      if (currentlyDisabled) {
        delete next[String(hotelId)];
      } else {
        next[String(hotelId)] = true;
      }
      return next;
    });
  };

  const disabledCount = Object.keys(disabledMap).length;
  const enabledCount = hotels.length - disabledCount;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hotel Branches</h1>
          <p className="text-sm text-gray-500 mt-1">
            {source === "odoo" ? (
              <span className="text-teal-600">Connected to Odoo — {enabledCount} enabled, {disabledCount} disabled</span>
            ) : source === "cached" ? (
              <span className="text-amber-600">Showing cached data</span>
            ) : source === "error" ? (
              <span className="text-red-500">Error: {error}</span>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
        <button
          onClick={loadHotels}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
        >
          <FaSync size={12} className={loading ? "animate-spin" : ""} />
          Sync from Odoo
        </button>
      </div>

      {/* Parent Company Card */}
      {parentCompany && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Parent Company
          </h2>
          <Link
            href="/admin/parent"
            className="block bg-gradient-to-r from-[#052E39] to-[#1F8593] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <img
                  src={parentCompany.image}
                  alt={parentCompany.name}
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white">{parentCompany.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-white/70 text-sm">
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={11} />
                    {parentCompany.location}
                  </span>
                  {parentCompany.phone && (
                    <span className="flex items-center gap-1.5">
                      <FaPhone size={11} />
                      {parentCompany.phone}
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-xs mt-1">
                  {parentCompany.childIds.length} hotel branches
                </p>
              </div>
              <div className="shrink-0 text-white/50 text-sm font-medium">
                Manage Global Settings &rarr;
              </div>
            </div>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading hotels from Odoo...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No hotel branches found. Check your Odoo connection.
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Hotel Branches ({hotels.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hotels.map((hotel) => {
              const isDisabled = disabledMap[String(hotel.id)] === true;
              return (
                <Link
                  key={hotel.id}
                  href={`/admin/hotels/${hotel.id}`}
                  className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all group relative ${
                    isDisabled
                      ? "border-red-200 opacity-60"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {/* Disabled overlay */}
                  {isDisabled && (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Disabled
                    </div>
                  )}

                  <div className={`relative h-36 overflow-hidden ${isDisabled ? "grayscale" : ""}`}>
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-semibold text-sm truncate">
                        {hotel.name}
                      </p>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <FaMapMarkerAlt size={10} className="text-gray-400" />
                      {hotel.city || hotel.location}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FaImage size={10} /> Media
                        </span>
                        <span className="flex items-center gap-1">
                          <FaStar size={10} /> Reviews
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBed size={10} /> Rooms
                        </span>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={(e) => toggleHotel(hotel.id, e)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          isDisabled
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                        title={isDisabled ? "Click to enable this hotel on the website" : "Click to disable this hotel from the website"}
                      >
                        {isDisabled ? (
                          <><FaToggleOff size={14} /> Off</>
                        ) : (
                          <><FaToggleOn size={14} /> On</>
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
