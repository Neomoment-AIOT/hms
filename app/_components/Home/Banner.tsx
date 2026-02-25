"use client";

import {
  useState,
  useRef,
  useContext,
  useEffect,
  useMemo,
  useState as useReactState,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { LangContext } from "@/app/lang-provider";
import ArabicCalendar from "../ArabicCalendar";
import { format } from "date-fns";
import BannerMedia, { type BannerMediaConfig } from "./BannerMedia";

type GuestDetails = {
  room: number;
  adult: number;
  children: number;
};

export default function Banner() {
  const { lang } = useContext(LangContext);
  const router = useRouter();

  // Admin-managed banner data (extended for media types)
  const [adminBanner, setAdminBanner] = useState<{
    imageUrl?: string;
    videoUrl?: string;
    animationHtml?: string;
    mediaType?: string;
    carouselItems?: { type: "image" | "video"; url: string }[];
    carouselInterval?: number;
    titleEn?: string;
    titleAr?: string;
    subtitleEn?: string;
    subtitleAr?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_global_banner");
      if (stored) setAdminBanner(JSON.parse(stored));
    } catch {}
  }, []);

  // Build BannerMediaConfig from admin data
  const mediaConfig = useMemo<BannerMediaConfig>(() => {
    if (!adminBanner || !adminBanner.mediaType || adminBanner.mediaType === "image") {
      return {
        mediaType: "image",
        imageUrl: adminBanner?.imageUrl || "/banner.jpg",
      };
    }
    if (adminBanner.mediaType === "video") {
      return {
        mediaType: "video",
        videoUrl: adminBanner.videoUrl || "",
      };
    }
    if (adminBanner.mediaType === "animation") {
      return {
        mediaType: "animation",
        animationHtml: adminBanner.animationHtml || "",
      };
    }
    if (adminBanner.mediaType === "carousel") {
      return {
        mediaType: "carousel",
        carouselItems: adminBanner.carouselItems || [],
        carouselInterval: adminBanner.carouselInterval || 5000,
      };
    }
    return { mediaType: "image", imageUrl: "/banner.jpg" };
  }, [adminBanner]);

  const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const toDateParam = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [arrivalDate, setArrivalDate] = useState<Date>(getToday());
  const [departureDate, setDepartureDate] = useState<Date>(getTomorrow());

  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);

  const [arrivalPos, setArrivalPos] = useState({ top: 0, left: 0 });
  const [departurePos, setDeparturePos] = useState({ top: 0, left: 0 });
  const [guestPos, setGuestPos] = useState({ top: 0, left: 0 });
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    room: 1,
    adult: 1,
    children: 0,
  });

  const [showGuestPopup, setShowGuestPopup] = useState(false);

  const [headerHeight, setHeaderHeight] = useReactState(0);
  const [menuTopPosition, setMenuTopPosition] = useReactState(0);
  const [menuLeftPosition, setMenuLeftPosition] = useReactState(0);

  const arrivalRef = useRef<HTMLDivElement | null>(null);
  const departureRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupContentRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    const checkIn = toDateParam(arrivalDate);
    const checkOut = toDateParam(departureDate);
    router.push(
      `/Hotel_Filter?checkIn=${checkIn}&checkOut=${checkOut}&room=${guestDetails.room}&adult=${guestDetails.adult}&children=${guestDetails.children}`
    );
  };

  const updatePositions = () => {
    if (arrivalRef.current) {
      const rect = arrivalRef.current.getBoundingClientRect();
      setArrivalPos({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
    if (departureRef.current) {
      const rect = departureRef.current.getBoundingClientRect();
      setDeparturePos({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setGuestPos({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
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
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (arrivalRef.current?.contains(target)) return;
      if (departureRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;

      setShowArrivalCalendar(false);
      setShowDepartureCalendar(false);
      setShowGuestPopup(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);

    const handleResize = () => {
      if (header) setHeaderHeight(header.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        popupContentRef.current &&
        !popupContentRef.current.contains(event.target as Node)
      ) {
        setShowGuestPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative h-[420px] w-full flex items-center justify-center overflow-hidden transition-all duration-300"
      style={{ marginTop: `${headerHeight}px` }}
    >
      {/* Dynamic banner media: image / video / animation / carousel */}
      <BannerMedia config={mediaConfig} />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      <div className="relative z-[2] text-white max-w-7xl mx-auto w-full px-4">
        {/* Title */}
<h1
  className={`text-2xl md:text-5xl font-semibold mb-2 w-full
    ${
      lang === "ar"
        ? "font-arabic text-right"
        : "text-center"
    }
  `}
>
  {lang === "en"
    ? (adminBanner?.titleEn || "Book Your Hotel With Ease Today.")
    : (adminBanner?.titleAr || "احجز فندقك بسهولة اليوم.")}
</h1>

{/* Subtitle */}
<p
  className={`mb-3 text-sm md:text-base w-full
    ${
      lang === "ar"
        ? "font-arabic text-right"
        : "text-center"
    }
  `}
>
  {lang === "en"
    ? (adminBanner?.subtitleEn || "Let us help you find the perfect stay for your Hajj and Umrah journey.")
    : (adminBanner?.subtitleAr || "دعنا نساعدك في العثور على الإقامة المثالية لرحلة حجك وعمرتك.")}
</p>


        {/* Search Form */}
        <div
  className="flex flex-col md:flex-row gap-2 justify-between items-stretch rounded-lg p-2 shadow-md text-black w-full"
>

          {/* City */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12 px-3 pt-5 pb-1">
            <label
              className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 font-arabic text-gray-500 text-xs`}
            >
              {lang === "en" ? "City" : "المدينة"}
            </label>
            <span className={`${lang === "ar" ? "font-arabic" : ""}`}>
              {lang === "en" ? "Makkah" : "مكة المكرمة"}
            </span>
          </div>

          {/* Arrival date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12" ref={arrivalRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); updatePositions(); setShowArrivalCalendar(!showArrivalCalendar); setShowDepartureCalendar(false); }}
              className="w-full h-full text-left px-3 pt-5 pb-1 focus:outline-none"
            >
              <label className={`absolute ${lang === "ar" ? "right-3" : "left-3"} font-arabic top-2.5 text-gray-500 text-xs cursor-pointer`}>
                {lang === "en" ? "Arrival Date" : "تاريخ الوصول"}
              </label>
              <span className={`text-sm ${lang === 'ar' ? 'font-arabic text-right block' : ''}`}>
                {arrivalDate
                  ? lang === "en"
                    ? format(arrivalDate, "dd/MM/yyyy")
                    : format(arrivalDate, "yyyy/MM/dd")
                  : lang === "en"
                    ? "-- / -- / ----"
                    : "---- / -- / --"
                }
              </span>
            </button>
          </div>

          {/* Departure date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12" ref={departureRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); updatePositions(); setShowDepartureCalendar(!showDepartureCalendar); setShowArrivalCalendar(false); }}
              className="w-full h-full text-left px-3 pt-5 pb-1 focus:outline-none"
            >
              <label className={`absolute ${lang === "ar" ? "right-3" : "left-3"} font-arabic top-2.5 text-gray-500 text-xs cursor-pointer`}>
                {lang === "en" ? "Departure Date" : "تاريخ المغادرة"}
              </label>
              <span className={`text-sm ${lang === 'ar' ? 'font-arabic text-right block' : ''}`}>
                {departureDate
                  ? lang === "en"
                    ? format(departureDate, "dd/MM/yyyy")
                    : format(departureDate, "yyyy/MM/dd")
                  : lang === "en"
                    ? "-- / -- / ----"
                    : "---- / -- / --"
                }
              </span>
            </button>
          </div>

          {/* Guests & Rooms */}
          <div
            className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12"
            ref={popupRef}
          >
            <div className="w-full relative">
              <button
                type="button"
                onClick={toggleGuestMenu}
                className={`peer w-full px-3 pt-5 pb-1 rounded focus:outline-none
        ${lang === "ar" ? "text-right" : "text-left"}
      `}
              >
                <label
                  className={`absolute ${lang === "ar" ? "right-3" : "left-3"} font-arabic top-2.5 text-gray-500 text-xs`}
                >
                  {lang === "en" ? "Guests & Rooms" : "الضيوف والغرف"}
                </label>

                <div
                  className={`text-black font-medium text-sm mt-1 truncate ${lang === "ar" ? "font-arabic text-right" : ""
                    }`}
                >
                  {guestDetails.room}{" "}
                  {lang === "en"
                    ? guestDetails.room === 1
                      ? "Room"
                      : "Rooms"
                    : guestDetails.room === 1
                      ? "غرفة"
                      : "غرف"}
                  , {guestDetails.adult}{" "}
                  {lang === "en"
                    ? guestDetails.adult === 1
                      ? "Adult"
                      : "Adults"
                    : guestDetails.adult === 1
                      ? "بالغ"
                      : "بالغين"}
                  , {guestDetails.children}{" "}
                  {lang === "en"
                    ? guestDetails.children === 1
                      ? "Child"
                      : "Children"
                    : guestDetails.children === 1
                      ? "طفل"
                      : "أطفال"}
                </div>
              </button>

              {/* Arrival Calendar Portal */}
              {showArrivalCalendar && createPortal(
                <div
                  className="absolute z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    top: arrivalPos.top,
                    left: arrivalPos.left,
                    transform: window.innerWidth < 768 ? "scale(0.7)" : "scale(0.85)",
                    transformOrigin: "top left",
                  }}
                >
                  <ArabicCalendar
                    lang={lang}
                    selected={arrivalDate}
                    showClearButton={true}
                    onSelect={(date: Date | undefined) => {
                      if (!date) {
                        const today = getToday();
                        setArrivalDate(today);
                        setDepartureDate(getTomorrow());

                        setShowArrivalCalendar(false);
                        return;
                      }
                      setArrivalDate(date);

                      if (departureDate <= date) {
                        const nextDay = new Date(date);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setDepartureDate(nextDay);
                      }

                      setShowArrivalCalendar(false);
                      setShowDepartureCalendar(true);
                    }}

                  />
                </div>,
                document.body
              )}

              {/* Departure Calendar Portal */}
              {showDepartureCalendar && createPortal(
                <div
                  className="absolute z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    top: departurePos.top,
                    left: departurePos.left,
                    transform: window.innerWidth < 768 ? "scale(0.7)" : "scale(0.85)",
                    transformOrigin: "top left",
                  }}
                >
                  <ArabicCalendar
                    lang={lang}
                    selected={departureDate}
                    showClearButton={true}
                    disabled={(date) => arrivalDate ? date < arrivalDate : date < new Date()}
                    onSelect={(date: Date | undefined) => {
                      if (!date) {
                        setDepartureDate(getTomorrow());
                        setShowDepartureCalendar(false);
                        return;
                      }

                      setDepartureDate(date);
                      setShowDepartureCalendar(false);
                    }}

                  />
                </div>,
                document.body
              )}

              {showGuestPopup &&
                createPortal(
                  <div
                    ref={popupContentRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute mt-2 bg-white shadow-lg rounded-md w-[80%] lg:w-fit p-2 text-xs z-20 ${lang === "ar" ? "font-arabic text-right rtl" : "text-left"
                      }`}
                    style={{
                      top: menuTopPosition,
                      left: menuLeftPosition,
                    }}
                  >
                    {[
                      { label: lang === "en" ? "Room" : "غرفة", key: "room" },
                      { label: lang === "en" ? "Adult" : "بالغ", key: "adult" },
                      { label: lang === "en" ? "Children" : "أطفال", key: "children" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between mb-1.5 last:mb-0 ${lang === "ar" ? "flex-row-reverse" : ""
                          }`}
                      >
                        <span className="text-gray-700 font-medium">{item.label}</span>

                        <div
                          className={`flex items-center ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-1" : "space-x-1"
                            }`}
                        >
                          <button
                            type="button"
                            onClick={() => changeDetail(item.key as keyof GuestDetails, -1)}
                            className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>

                          <span className="w-4 text-center">
                            {guestDetails[item.key as keyof GuestDetails]}
                          </span>

                          <button
                            type="button"
                            onClick={() => changeDetail(item.key as keyof GuestDetails, 1)}
                            className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <div
                      className={`flex justify-between mt-2 ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setGuestDetails({ room: 1, adult: 1, children: 0 })
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-medium"
                      >
                        {lang === "en" ? "Reset" : "إعادة تعيين"}
                      </button>

                      <div
                        className={`flex ${lang === "ar" ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => setShowGuestPopup(false)}
                          className="px-3 py-1 border rounded hover:bg-gray-200 text-xs font-medium"
                        >
                          {lang === "en" ? "Cancel" : "إلغاء"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowGuestPopup(false)}
                          className="px-3 py-1 bg-[#003243] text-white rounded text-xs font-medium"
                        >
                          {lang === "en" ? "Confirm" : "تأكيد"}
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          </div>

          {/* Search Button */}
          <div className={`flex flex-col justify-end ${lang === "ar" ? "items-start" : "items-end"}`}>
            <button
              onClick={handleSearch}
              className={`bg-[#EF4050] hover:bg-[#d93848] text-white px-10 py-1.5 mb-5 lg:mb-0 rounded transition w-full md:w-auto h-full text-ms font-medium ${lang === "ar" ? "font-arabic" : ""
                }`}
            >
              {lang === "en" ? "Search Hotels" : "ابحث عن الفنادق"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}