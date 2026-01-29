"use client";

import { useState, useRef, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import HotelList from "./Hotel_List";
import { hotelsData } from "./Hotel_Data";
import { LangContext } from "@/app/lang-provider";
import ArabicCalendar from "../ArabicCalendar";
import { format } from "date-fns";

/* ---------------- TYPES ---------------- */
type Filters = {
  rating: number | null;
  propertyViews: string[];
  guestRatings: string[];
  minPrice: number;
  maxPrice: number;
  roomTypes: string[];
};

type GuestDetails = {
  room: number;
  adult: number;
  children: number;
};

export default function HotelFilter() {
  const { lang } = useContext(LangContext);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn) {
      setArrival(new Date(checkIn + "T00:00:00"));
    }

    if (checkOut) {
      setDeparture(new Date(checkOut + "T00:00:00"));
    }

    setGuestDetails({
      room: Number(searchParams.get("room") ?? 1),
      adult: Number(searchParams.get("adult") ?? 1),
      children: Number(searchParams.get("children") ?? 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- DATE & GUEST STATE ---------------- */
  const [arrival, setArrival] = useState<Date | undefined>(undefined);
  const [departure, setDeparture] = useState<Date | undefined>(undefined);
  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [arrivalPos, setArrivalPos] = useState({ top: 0, left: 0 });
  const [departurePos, setDeparturePos] = useState({ top: 0, left: 0 });

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    room: 1,
    adult: 1,
    children: 0,
  });
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [menuTopPosition, setMenuTopPosition] = useState(0);
  const [menuLeftPosition, setMenuLeftPosition] = useState(0);

  const arrivalRef = useRef<HTMLDivElement | null>(null);
  const departureRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupContentRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FILTER STATE ---------------- */
  const [filters, setFilters] = useState<Filters>({
    rating: null,
    propertyViews: [],
    guestRatings: [],
    minPrice: 0,
    maxPrice: 500,
    roomTypes: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* ---------------- POSITION UPDATE ---------------- */
  const updatePositions = () => {
    if (arrivalRef.current) {
      const rect = arrivalRef.current.getBoundingClientRect();
      setArrivalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    if (departureRef.current) {
      const rect = departureRef.current.getBoundingClientRect();
      setDeparturePos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setMenuTopPosition(rect.bottom + window.scrollY);
      setMenuLeftPosition(rect.left + window.scrollX);
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (showArrivalCalendar || showDepartureCalendar) updatePositions();
    };
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [showArrivalCalendar, showDepartureCalendar]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        arrivalRef.current?.contains(target) ||
        departureRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      )
        return;

      setShowArrivalCalendar(false);
      setShowDepartureCalendar(false);
      setShowGuestPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- GUEST HANDLERS ---------------- */
  const changeDetail = (key: keyof GuestDetails, delta: number) => {
    setGuestDetails((prev) => {
      const next = { ...prev };
      next[key] = Math.max(0, prev[key] + delta);
      return next;
    });
  };

  const toggleGuestMenu = () => {
    if (!showGuestPopup && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setMenuTopPosition(rect.bottom + window.scrollY);
      setMenuLeftPosition(rect.left + window.scrollX);
    }
    setShowGuestPopup(!showGuestPopup);
  };

  /* ---------------- FILTER HANDLERS ---------------- */
  const handleCheckboxChange = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const list = prev[category] as string[];
      return {
        ...prev,
        [category]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  const handleReset = () => {
    const reset: Filters = {
      rating: null,
      propertyViews: [],
      guestRatings: [],
      minPrice: 0,
      maxPrice: 500,
      roomTypes: [],
    };
    setFilters(reset);
    setAppliedFilters(reset);
    setGuestDetails({ room: 1, adult: 1, children: 0 });
    setArrival(undefined);
    setDeparture(undefined);
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    setIsMobileFilterOpen(false);
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredHotels = hotelsData.filter((hotel) => {
    if (appliedFilters.rating !== null && hotel.rating < appliedFilters.rating) return false;
    if (hotel.price < appliedFilters.minPrice || hotel.price > appliedFilters.maxPrice) return false;
    if (appliedFilters.propertyViews.length > 0 && !appliedFilters.propertyViews.includes(hotel.propertyView))
      return false;
    if (appliedFilters.guestRatings.length > 0 && !appliedFilters.guestRatings.includes(hotel.guestRating))
      return false;
    if (appliedFilters.roomTypes.length > 0 && !hotel.roomTypes.some((room) => appliedFilters.roomTypes.includes(room)))
      return false;

    return true;
  });

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "font-arabic" : ""}>
      {/* ---------------- BANNER-STYLE SEARCH ---------------- */}
      <div className="mb-6">
        <div className={`flex flex-col md:flex-row gap-2 justify-center items-stretch rounded-lg p-2 shadow-md text-black ${lang === "ar" ? "text-right" : "text-left"}`}>

          {/* Arrival Date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12" ref={arrivalRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowArrivalCalendar(!showArrivalCalendar); setShowDepartureCalendar(false); updatePositions(); }}
              className="w-full h-full text-left px-3 pt-5 pb-1 focus:outline-none"
            >
              <label className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs`}>
                {lang === "ar" ? "تاريخ الوصول" : "Arrival Date"}
              </label>
              <span className={`text-sm ${lang === "ar" ? "font-arabic text-right block" : ""}`}>
                {arrival ? format(arrival, lang === "ar" ? "yyyy/MM/dd" : "dd/MM/yyyy") : lang === "ar" ? "---- / -- / --" : "-- / -- / ----"}
              </span>
            </button>

            {showArrivalCalendar &&
              createPortal(
                <div
                  className="absolute z-50"
                  style={{ top: arrivalPos.top, left: arrivalPos.left, transform: window.innerWidth < 768 ? "scale(0.7)" : "scale(0.85)", transformOrigin: "top left" }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <ArabicCalendar
                    lang={lang}
                    selected={arrival}
                    showClearButton
                    onSelect={(date) => {
                      setArrival(date);
                      if (departure && date && date >= departure) {
                        setDeparture(undefined);
                      }
                      setShowArrivalCalendar(false);
                      if (date) setShowDepartureCalendar(true);
                    }}
                  />
                </div>,
                document.body
              )}
          </div>

          {/* Departure Date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12" ref={departureRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowDepartureCalendar(!showDepartureCalendar); setShowArrivalCalendar(false); updatePositions(); }}
              className="w-full h-full text-left px-3 pt-5 pb-1 focus:outline-none"
            >
              <label className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs`}>
                {lang === "ar" ? "تاريخ المغادرة" : "Departure Date"}
              </label>
              <span className={`text-sm ${lang === "ar" ? "font-arabic text-right block" : ""}`}>
                {departure ? format(departure, lang === "ar" ? "yyyy/MM/dd" : "dd/MM/yyyy") : lang === "ar" ? "---- / -- / --" : "-- / -- / ----"}
              </span>
            </button>

            {showDepartureCalendar &&
              createPortal(
                <div
                  className="absolute z-50"
                  style={{ top: departurePos.top, left: departurePos.left, transform: window.innerWidth < 768 ? "scale(0.7)" : "scale(0.85)", transformOrigin: "top left" }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <ArabicCalendar
                    lang={lang}
                    selected={departure}
                    disabled={(date) => arrival ? date < arrival : date < new Date()}
                    showClearButton
                    onSelect={(date) => {
                      if (!date) return;
                      setDeparture(date);
                      setShowDepartureCalendar(false);
                    }}
                  />
                </div>,
                document.body
              )}
          </div>

          {/* Guests */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12" ref={popupRef}>
            <button
              type="button"
              onClick={toggleGuestMenu}
              className={`w-full px-3 pt-5 pb-1 focus:outline-none ${lang === "ar" ? "text-right" : "text-left"}`}
            >
              <label className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs`}>
                {lang === "ar" ? "الضيوف والغرف" : "Guests & Rooms"}
              </label>
              <div className={`text-black font-medium text-sm mt-1 truncate ${lang === "ar" ? "font-arabic text-right" : ""}`}>
                {guestDetails.room} {lang === "ar" ? (guestDetails.room === 1 ? "غرفة" : "غرف") : (guestDetails.room === 1 ? "Room" : "Rooms")},
                {guestDetails.adult} {lang === "ar" ? (guestDetails.adult === 1 ? "بالغ" : "بالغين") : (guestDetails.adult === 1 ? "Adult" : "Adults")},
                {guestDetails.children} {lang === "ar" ? (guestDetails.children === 1 ? "طفل" : "أطفال") : (guestDetails.children === 1 ? "Child" : "Children")}
              </div>
            </button>

            {showGuestPopup &&
              createPortal(
                <div
                  ref={popupContentRef}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`absolute mt-2 bg-white shadow-lg rounded-md w-[80%] lg:w-fit p-2 text-xs z-20 ${lang === "ar" ? "font-arabic text-right rtl" : "text-left"}`}
                  style={{ top: menuTopPosition, left: menuLeftPosition }}
                >
                  {["room", "adult", "children"].map((key) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between mb-1.5 last:mb-0 ${lang === "ar" ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-gray-700 font-medium">
                        {key === "room" ? (lang === "ar" ? "غرفة" : "Room") : key === "adult" ? (lang === "ar" ? "بالغ" : "Adult") : (lang === "ar" ? "أطفال" : "Child")}
                      </span>
                      <div className={`flex items-center ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-1" : "space-x-1"}`}>
                        <button
                          type="button"
                          onClick={() => changeDetail(key as keyof GuestDetails, -1)}
                          className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-4 text-center">{guestDetails[key as keyof GuestDetails]}</span>
                        <button
                          type="button"
                          onClick={() => changeDetail(key as keyof GuestDetails, 1)}
                          className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className={`flex justify-between mt-2 ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"}`}>
                    <button
                      type="button"
                      onClick={() => setGuestDetails({ room: 0, adult: 0, children: 0 })}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-medium"
                    >
                      {lang === "ar" ? "إعادة تعيين" : "Reset"}
                    </button>
                    <div className={`flex ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"}`}>
                      <button
                        type="button"
                        onClick={() => setShowGuestPopup(false)}
                        className="px-3 py-1 border rounded hover:bg-gray-200 text-xs font-medium"
                      >
                        {lang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGuestPopup(false)}
                        className="px-3 py-1 bg-[#003243] text-white rounded text-xs font-medium"
                      >
                        {lang === "ar" ? "تأكيد" : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>

          {/* Search Button */}
          <div className={`flex flex-col justify-end ${lang === "ar" ? "items-start" : "items-end"} mt-2 md:mt-0`}>
            <button
              className={`bg-[#EF4050] hover:bg-[#d93848] text-white px-10 h-15 py-1.5 rounded transition w-full md:w-auto text-ms font-medium ${lang === "ar" ? "font-arabic" : ""}`}
            >
              {lang === "ar" ? "ابحث عن الفنادق" : "Search Hotels"}
            </button>
          </div>

        </div>
      </div>

      {/* ---------------- FILTER UI ---------------- */}
      <div className="md:hidden flex justify-start mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg"
        >
          {lang === "ar" ? "تصفية" : "Filter"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* DESKTOP FILTER */}
        <aside className="hidden md:block w-72 bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{lang === "ar" ? "التصفية" : "Filters"}</h2>
            <div className="flex gap-3">
              <button onClick={handleReset} className="text-sm text-gray-500 hover:underline">{lang === "ar" ? "إعادة تعيين" : "Reset"}</button>
              <button onClick={handleApply} className="text-sm text-teal-600 font-medium hover:underline">{lang === "ar" ? "تطبيق" : "Apply"}</button>
            </div>
          </div>

          <FilterContent
            filters={filters}
            setFilters={setFilters}
            handleCheckboxChange={handleCheckboxChange}
            lang={lang}
          />
        </aside>

        {/* HOTEL LIST */}
        <div className="flex-1">
          <HotelList hotels={filteredHotels} />
        </div>
      </div>

      {/* MOBILE FILTER POPUP */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <div className="bg-white w-full h-full flex flex-col">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">{lang === "ar" ? "التصفية" : "Filters"}</h2>
              <div className="flex gap-4">
                <button onClick={handleReset} className="text-sm text-gray-500">{lang === "ar" ? "إعادة تعيين" : "Reset"}</button>
                <button onClick={handleApply} className="text-sm text-teal-600 font-medium">{lang === "ar" ? "تطبيق" : "Apply"}</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterContent
                filters={filters}
                setFilters={setFilters}
                handleCheckboxChange={handleCheckboxChange}
                lang={lang}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- FILTER CONTENT ---------------- */
type FilterContentProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  handleCheckboxChange: (category: keyof Filters, value: string) => void;
  lang: string;
};

function FilterContent({
  filters,
  setFilters,
  handleCheckboxChange,
  lang,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* RATING */}
      <div>
        <h3 className="font-semibold mb-2">
          {lang === "ar" ? "التقييم" : "Rating"}
        </h3>

        <select
          value={filters.rating ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              rating: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className={`w-full border rounded px-3 py-2 bg-white ${lang === "ar" ? "text-right font-arabic" : "text-left"
            }`}
        >
          <option value="">
            {lang === "ar" ? "كل التقييمات" : "All ratings"}
          </option>

          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              ★ {r}.0+
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- PROPERTY VIEWS ---------------- */}
      <div>
        <h3 className="font-semibold mb-2">
          {lang === "ar" ? "إطلالات الفندق" : "Property Views"}
        </h3>

        {[
          { id: "fullKaaba", ar: "إطلالة كاملة على الكعبة", en: "Full view of Kaaba" },
          { id: "partialKaaba", ar: "إطلالة جزئية على الكعبة", en: "Partial view of Kaaba" },
          { id: "noView", ar: "بدون إطلالة / إطلالة المدينة", en: "No view / City view" },
        ].map((v) => (
          <label
            key={v.id}
            className={`flex items-center justify-between w-full cursor-pointer ${lang === "ar" ? "flex-row-reverse text-right" : ""
              }`}
          >
            {lang === "ar" ? (
              <>
                <input
                  type="checkbox"
                  checked={filters.propertyViews.includes(v.id)}
                  onChange={() =>
                    handleCheckboxChange("propertyViews", v.id)
                  }
                />
                <span className="flex-1 mr-3">{v.ar}</span>
              </>
            ) : (
              <>
                <span className="flex-1">{v.en}</span>
                <input
                  type="checkbox"
                  checked={filters.propertyViews.includes(v.id)}
                  onChange={() =>
                    handleCheckboxChange("propertyViews", v.id)
                  }
                />
              </>
            )}
          </label>
        ))}
      </div>

      {/* ---------------- GUEST RATING (FIXED IDS) ---------------- */}
      <div>
        <h3 className="font-semibold mb-2">
          {lang === "ar" ? "تقييم الضيوف" : "Guest Rating"}
        </h3>

        {[
          { id: "excellent", en: "Excellent", ar: "ممتاز" },
          { id: "veryGood", en: "Very good", ar: "جيد جدًا" },
          { id: "good", en: "Good", ar: "جيد" },
          { id: "average", en: "Average", ar: "متوسط" },
        ].map((r) => (
          <label
            key={r.id}
            className={`flex items-center justify-between w-full cursor-pointer ${lang === "ar" ? "flex-row-reverse text-right" : ""
              }`}
          >
            {lang === "ar" ? (
              <>
                <input
                  type="checkbox"
                  checked={filters.guestRatings.includes(r.id)}
                  onChange={() =>
                    handleCheckboxChange("guestRatings", r.id)
                  }
                />
                <span className="flex-1 mr-3">{r.ar}</span>
              </>
            ) : (
              <>
                <span className="flex-1">{r.en}</span>
                <input
                  type="checkbox"
                  checked={filters.guestRatings.includes(r.id)}
                  onChange={() =>
                    handleCheckboxChange("guestRatings", r.id)
                  }
                />
              </>
            )}
          </label>
        ))}
      </div>

      {/* ---------------- PRICE ---------------- */}
      <div>
        <h3 className="font-semibold mb-2">
          {lang === "ar" ? "السعر" : "Price"}
        </h3>

        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{filters.minPrice} SAR</span>
          <span>{filters.maxPrice} SAR</span>
        </div>

        <input
          type="range"
          min={0}
          max={500}
          step={10}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full accent-teal-600"
        />
      </div>

      {/* ---------------- ROOM TYPES ---------------- */}
      <div>
        <h3 className="font-semibold mb-2">
          {lang === "ar" ? "أنواع الغرف" : "Room Types"}
        </h3>

        {[
          { en: "Deluxe Room", ar: "غرفة ديلوكس", value: "deluxe" },
          { en: "Double Room", ar: "غرفة مزدوجة", value: "double" },
          { en: "Quadruple Room", ar: "غرفة رباعية", value: "quadruple" },
          { en: "Family Suite", ar: "جناح عائلي", value: "familySuite" },
          { en: "Junior Suite", ar: "جناح صغير", value: "juniorSuite" },
          { en: "Standard Room", ar: "غرفة قياسية", value: "standard" },
          { en: "Triple Room", ar: "غرفة ثلاثية", value: "triple" },
          { en: "Super Deluxe Room", ar: "غرفة سوبر ديلوكس", value: "superDeluxe" },
          { en: "Hexagonal Room", ar: "غرفة سداسية", value: "hexagonal" },
          { en: "Senior Suite", ar: "جناح كبير", value: "seniorSuite" },
        ].map((room) => (
          <label key={room.value} className={`flex items-center justify-between w-full cursor-pointer ${lang === "ar" ? "flex-row-reverse text-right" : ""}`}>
            {lang === "ar" ? (
              <>
                <input
                  type="checkbox"
                  checked={filters.roomTypes.includes(room.value)}
                  onChange={() => handleCheckboxChange("roomTypes", room.value)}
                />
                <span className="flex-1 mr-3">{room.ar}</span>
              </>
            ) : (
              <>
                <span className="flex-1">{room.en}</span>
                <input
                  type="checkbox"
                  checked={filters.roomTypes.includes(room.value)}
                  onChange={() => handleCheckboxChange("roomTypes", room.value)}
                />
              </>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}