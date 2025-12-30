"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { arSA } from "date-fns/locale";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "react-day-picker/dist/style.css";

interface ArabicCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  lang?: string;
  disabled?: (date: Date) => boolean;
  showClearButton?: boolean;
}

export default function ArabicCalendar({
  selected: initialSelected,
  onSelect,
  lang,
  disabled,
  showClearButton = false,
}: ArabicCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(initialSelected);
  const arabicDays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onSelect?.(date);
  };

  const handleClear = () => {
    setSelected(undefined);
    onSelect?.(undefined);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-fit">
      <style>{`
        .rdp-day:hover:not(.rdp-day_selected) {
          background-color: #f0f0f0;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .rdp-day_today {
          border: 2px solid #003243;
          color: #003243;
          border-radius: 50%;
        }
      `}</style>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        disabled={disabled}
        locale={lang === "ar" ? arSA : undefined}
        dir={lang === "ar" ? "rtl" : "ltr"}
        weekStartsOn={lang === "ar" ? 6 : 0}
        navLayout="around"
        components={{
          Chevron: ({ orientation, ...props }) => (
            orientation === "left" ? (
              <FaArrowLeft {...props} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
            ) : (
              <FaArrowRight {...props} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
            )
          ),
        }}
        formatters={{
          formatWeekdayName: (date) =>
            lang === "ar"
              ? arabicDays[date.getDay()]
              : date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        }}
        styles={{
          head_cell: {
            width: 44,
            height: 36,
            padding: 0,
          },
          weekday: {
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#000000",
            opacity: 1,
            textAlign: "center",
          },
          caption_label: {
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#003243",
          },
          nav_button: {
            color: "#003243",
          },
          day_selected: {
            backgroundColor: "#003243",
            color: "#ffffff",
            borderRadius: "50%",
          },
        }}
        className="w-full !px-0!"
      />

      {/* CLEAR BUTTON */}
      {showClearButton && (
        <div className={`flex mt-3 ${lang === "ar" ? "justify-start" : "justify-end"}`}>
          <button
            className="py-1 px-4 rounded font-arabic bg-gray-200 font-medium hover:bg-gray-300 transition"
            onClick={handleClear}
          >
            {lang === "ar" ? "إلغاء " : "Clear"}
          </button>
        </div>
      )}
    </div>
  );
}