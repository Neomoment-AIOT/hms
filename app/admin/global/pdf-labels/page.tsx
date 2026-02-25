"use client";

import { useState, useEffect } from "react";
import { FaUndo } from "react-icons/fa";
import {
  getAdminData,
  setAdminData,
  STORAGE_KEYS,
} from "../../_lib/adminStorage";
import {
  DEFAULT_LABELS_EN,
  DEFAULT_LABELS_AR,
  LABEL_KEYS,
  type PDFLabels,
} from "@/app/utils/pdfLabels";

/* ────────── Types ────────── */

interface StoredLabels {
  en: Partial<PDFLabels>;
  ar: Partial<PDFLabels>;
}

const defaultStored: StoredLabels = { en: {}, ar: {} };

/* ────────── Friendly display names for each key ────────── */

const FIELD_NAMES: Record<keyof PDFLabels, string> = {
  confirmed: "Confirmed",
  bookingConfirmed: "Booking Confirmed Message",
  bookingDetails: "Booking Details (section)",
  bookingConfirmationNo: "Booking Confirmation No.",
  guestName: "Guest Name",
  email: "Email",
  stayDetails: "Stay Details (section)",
  checkIn: "Check-in",
  checkOut: "Check-out",
  checkInTime: "Check-in Time",
  checkOutTime: "Check-out Time",
  roomDetails: "Room Details (section)",
  roomType: "Room Type",
  noOfRooms: "No. of Rooms",
  hotelRating: "Hotel Rating",
  mealServices: "Meal Services (section)",
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  notSelected: "Not Selected",
  priceBreakdown: "Price Breakdown (section)",
  room: "Room",
  totalAmount: "Total Amount",
  paymentStatus: "Payment Status",
  paid: "Paid",
  importantInfo: "Important Information (section)",
  note1: "Note 1",
  note2: "Note 2",
  note3: "Note 3",
  note4: "Note 4",
  phone: "Phone",
  generatedOn: "Generated On",
  currency: "Currency Symbol",
};

/* ────────── Component ────────── */

export default function PDFLabelsPage() {
  const [labelsEn, setLabelsEn] = useState<PDFLabels>({ ...DEFAULT_LABELS_EN });
  const [labelsAr, setLabelsAr] = useState<PDFLabels>({ ...DEFAULT_LABELS_AR });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const stored = getAdminData<StoredLabels>(
      STORAGE_KEYS.PDF_LABELS,
      defaultStored
    );
    setLabelsEn({ ...DEFAULT_LABELS_EN, ...stored.en });
    setLabelsAr({ ...DEFAULT_LABELS_AR, ...stored.ar });
  }, []);

  const handleSave = () => {
    // Only store values that differ from defaults (keeps storage small)
    const enOverrides: Partial<PDFLabels> = {};
    const arOverrides: Partial<PDFLabels> = {};

    for (const key of LABEL_KEYS) {
      if (labelsEn[key] !== DEFAULT_LABELS_EN[key]) enOverrides[key] = labelsEn[key];
      if (labelsAr[key] !== DEFAULT_LABELS_AR[key]) arOverrides[key] = labelsAr[key];
    }

    const result = setAdminData(STORAGE_KEYS.PDF_LABELS, {
      en: enOverrides,
      ar: arOverrides,
    });

    if ("ok" in result && result.ok) {
      setSaved(true);
      setSaveError("");
      setTimeout(() => setSaved(false), 2500);
    } else if ("error" in result) {
      setSaveError(result.error);
    }
  };

  const handleReset = () => {
    setLabelsEn({ ...DEFAULT_LABELS_EN });
    setLabelsAr({ ...DEFAULT_LABELS_AR });
    setAdminData(STORAGE_KEYS.PDF_LABELS, defaultStored);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            PDF Labels / Translations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Customize the English and Arabic labels used in the booking
            confirmation PDF. Changes apply immediately on next PDF download.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FaUndo size={12} /> Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1F8593] text-white rounded-lg hover:bg-[#17707c] transition-colors"
          >
            Save Labels
          </button>
        </div>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Labels saved successfully.
        </div>
      )}
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[200px_1fr_1fr] bg-gray-50 border-b px-4 py-3 text-sm font-semibold text-gray-600">
          <div>Field</div>
          <div>English</div>
          <div>Arabic (العربية)</div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {LABEL_KEYS.map((key) => (
            <div
              key={key}
              className="grid grid-cols-[200px_1fr_1fr] gap-3 px-4 py-3 items-start hover:bg-gray-50/50"
            >
              <div className="text-sm font-medium text-gray-700 pt-2">
                {FIELD_NAMES[key]}
              </div>

              {/* English */}
              <div>
                {key.startsWith("note") ||
                key === "bookingConfirmed" ? (
                  <textarea
                    value={labelsEn[key]}
                    onChange={(e) =>
                      setLabelsEn((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-16"
                  />
                ) : (
                  <input
                    value={labelsEn[key]}
                    onChange={(e) =>
                      setLabelsEn((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                )}
              </div>

              {/* Arabic */}
              <div>
                {key.startsWith("note") ||
                key === "bookingConfirmed" ? (
                  <textarea
                    dir="rtl"
                    value={labelsAr[key]}
                    onChange={(e) =>
                      setLabelsAr((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-16 text-right"
                  />
                ) : (
                  <input
                    dir="rtl"
                    value={labelsAr[key]}
                    onChange={(e) =>
                      setLabelsAr((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm text-right"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end gap-3 mt-6 pb-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FaUndo size={12} /> Reset Defaults
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#1F8593] text-white rounded-lg hover:bg-[#17707c] transition-colors"
        >
          Save Labels
        </button>
      </div>
    </div>
  );
}
