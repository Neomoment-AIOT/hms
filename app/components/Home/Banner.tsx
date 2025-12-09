"use client";

import {
  useState,
  useRef,
  useContext,
  useEffect,
  useState as useReactState,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { LangContext } from "@/app/lang-provider";

type GuestDetails = {
  room: number;
  adult: number;
  children: number;
};

export default function Banner() {
  const { lang } = useContext(LangContext);
  const router = useRouter();

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    room: 0,
    adult: 0,
    children: 0,
  });
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  const [headerHeight, setHeaderHeight] = useReactState(0);
  const [menuTopPosition, setMenuTopPosition] = useReactState(0);
  const [menuLeftPosition, setMenuLeftPosition] = useReactState(0);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    const city = lang === "en" ? "Makkah" : "مكة";
    router.push(
      `/search?city=${encodeURIComponent(city)}&arrival=${encodeURIComponent(
        arrival
      )}&departure=${encodeURIComponent(departure)}&rooms=${guestDetails.room
      }&adults=${guestDetails.adult}&children=${guestDetails.children}`
    );
  };

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
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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
      <img
        src="/banner.jpg"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 text-center text-white max-w-6xl w-full px-3 scale-90">
        {/* Title */}
        <h1
          className={`text-2xl md:text-5xl font-semibold mb-2 ${
            lang === "ar" ? "font-arabic text-right w-full" : ""
          }`}
          style={lang === "ar" ? { direction: "rtl" } : {}}
        >
          {lang === "en"
            ? "Book Your Hotel With Ease Today."
            : "احجز فندقك بسهولة اليوم."}
        </h1>

        {/* Subtitle */}
        <p
          className={`mb-3 text-sm md:text-base ${
            lang === "ar" ? "font-arabic text-right w-full" : ""
          }`}
          style={lang === "ar" ? { direction: "rtl" } : {}}
        >
          {lang === "en"
            ? "Let us help you find the perfect stay for your Hajj and Umrah journey."
            : "دعنا نساعدك في العثور على الإقامة المثالية لرحلة حجك وعمرتك."}
        </p>

        {/* Search Form */}
        <div
          className={`flex flex-col md:flex-row gap-2 justify-center items-stretch rounded-lg p-2 shadow-md text-black ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          {/* City */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12 px-3 pt-5 pb-1">
            <label
              className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs ${
                lang === "ar" ? "font-arabic" : ""
              }`}
            >
              {lang === "en" ? "City" : "المدينة"}
            </label>

            <span
              className={`font-medium text-ms mt-0.5 ${
                lang === "ar" ? "font-arabic" : ""
              }`}
            >
              {lang === "en" ? "Makkah" : "مكة المكرمة"}
            </span>
          </div>

          {/* Arrival Date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12">
            <div className="w-full relative">
              <input
                type="date"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className="peer px-3 pt-5 pb-1 w-full text-ms rounded focus:outline-none"
              />

              <label
                className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs ${
                  lang === "ar" ? "font-arabic" : ""
                }`}
              >
                {lang === "en" ? "Arrival Date" : "تاريخ الوصول"}
              </label>
            </div>
          </div>

          {/* Departure Date */}
          <div className="relative flex-1 bg-white flex items-center rounded border border-gray-300 min-h-12">
            <div className="w-full relative">
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="peer px-3 pt-5 pb-1 w-full text-ms rounded focus:outline-none"
              />

              <label
                className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs ${
                  lang === "ar" ? "font-arabic" : ""
                }`}
              >
                {lang === "en" ? "Departure Date" : "تاريخ المغادرة"}
              </label>
            </div>
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
                className="peer w-full text-left px-3 pt-5 pb-1 rounded focus:outline-none"
              >
                <label
                  className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-2.5 text-gray-500 text-xs ${
                    lang === "ar" ? "font-arabic" : ""
                  }`}
                >
                  {lang === "en" ? "Guests & Rooms" : "الضيوف والغرف"}
                </label>

                <div
                  className={`text-black font-medium text-sm mt-1 truncate ${
                    lang === "ar" ? "font-arabic text-right" : ""
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

              {/* Popup */}
              {showGuestPopup &&
                createPortal(
                  <div
                    className={`absolute mt-2 bg-white shadow-lg rounded-md w-[80%] lg:w-fit p-2 text-xs z-20 ${
                      lang === "ar" ? "font-arabic text-right" : "text-left"
                    }`}
                    style={{
                      top: menuTopPosition,
                      left: menuLeftPosition,
                    }}
                  >
                    {(
                      [
                        { label: lang === "en" ? "Room" : "غرفة", key: "room" },
                        { label: lang === "en" ? "Adult" : "بالغ", key: "adult" },
                        { label: lang === "en" ? "Children" : "أطفال", key: "children" },
                      ] as { label: string; key: keyof GuestDetails }[]
                    ).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between mb-1.5 last:mb-0"
                      >
                        <span className="text-gray-700 font-medium">{item.label}</span>

                        <div className={`flex items-center ${lang === "ar" ? "space-x-reverse space-x-1" : "space-x-1"}`}>
                          <button
                            type="button"
                            onClick={() => changeDetail(item.key, -1)}
                            className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{guestDetails[item.key]}</span>
                          <button
                            type="button"
                            onClick={() => changeDetail(item.key, 1)}
                            className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className={`flex justify-between mt-2 ${lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                      <button
                        type="button"
                        onClick={() =>
                          setGuestDetails({ room: 0, adult: 0, children: 0 })
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-medium"
                      >
                        {lang === "en" ? "Reset" : "إعادة تعيين"}
                      </button>

                      <div className={`flex ${lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"}`}>
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
              className={`bg-[#EF4050] hover:bg-[#d93848] text-white px-10 py-1.5 mb-5 lg:mb-0 rounded transition w-full md:w-auto h-full text-ms font-medium ${
                lang === "ar" ? "font-arabic" : ""
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
