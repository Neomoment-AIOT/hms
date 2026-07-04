"use client";
import { LangContext } from "@/app/lang-provider";
import { useContext, useState, useEffect } from "react";

type Hotel = {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  rating: number;
  imageUrl: string;
};

// NOTE: Hardcoded offers COMMENTED OUT for API testing
// Offers should come from Odoo CMS API (M7) when built
const hotels: Hotel[] = [];

const toArabicNumbers = (num: number) =>
  num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const Offers = () => {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [offersList, setOffersList] = useState<Hotel[]>(hotels);
  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) Preferred source: Odoo public CMS API (Featured Hotels)
      try {
        const res = await fetch("/api/cms/featured-hotels", { cache: "no-store" });
        const json = (await res.json().catch(() => null)) as
          | { ok: true; data: unknown }
          | { ok: false; error?: string }
          | null;

        if (!cancelled && json?.ok && Array.isArray(json.data)) {
          setOffersList(
            (json.data as Array<Record<string, unknown>>).map((h) => ({
              id: Number((h.id as number) || (h.odooId as number) || 0),
              nameEn: String((h.nameEn as string) || (h.name as string) || ""),
              // When API doesn't provide Arabic, mirror English so UI doesn't look empty.
              nameAr: String((h.nameAr as string) || (h.arabicName as string) || (h.name as string) || ""),
              price: Number(
                (h.starting_price as number) ||
                  (h.startingPrice as number) ||
                  (h.price as number) ||
                  0
              ),
              rating: (h.star_rating as number) || 0,
              imageUrl: (h.logo as string) || (h.imageUrl as string) || "/hotel/hotel1.jpg",
            }))
          );
          return;
        }
      } catch {
        // ignore and fall back
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
     <section className="w-full bg-gray-200" dir={isArabic ? "rtl" : "ltr"}>
          <div className="max-w-[1440px] mx-auto p-6">

            {/* Title */}
            <h2 className={`text-3xl font-bold mb-10 ${isArabic ? "font-arabic text-right" : ""}`}>
               {isArabic ? "فنادق تم اختيارها من أجلك" : "Hotels selected for you"}
            </h2>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {offersList.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`relative rounded-lg overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow h-80 md:h-96 ${isArabic ? "text-right" : "text-left"}`}
                >
                  <img
                    src={hotel.imageUrl}
                    alt={isArabic ? hotel.nameAr : hotel.nameEn}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  <div className={`absolute bottom-0 ${isArabic ? "right-0" : "left-0"} w-full p-3 text-white`}>
                    <h3 className={`font-semibold text-sm ${isArabic ? "font-arabic" : ""}`}>
                      {isArabic ? hotel.nameAr : hotel.nameEn}
                    </h3>

                    <p className={`text-lg opacity-80 ${isArabic ? "font-arabic" : ""}`}>
                      {isArabic ? hotel.nameEn : hotel.nameAr}
                    </p>

                    <div className="flex items-center mt-2 text-xs justify-between">
                      <span className={`${isArabic ? "font-arabic text-right" : ""}`}>
                        {hotel.rating > 0 ? `★ ${hotel.rating}` : (isArabic ? "بدون تقييمات" : "No ratings")}
                      </span>

                      <span
                        className={`bg-[#003243] px-3 py-1 rounded text-white text-sm flex items-center gap-1.5 ${isArabic ? "font-arabic" : ""}`}
                      >
                        {isArabic ? (
                          <>
                            <span>{toArabicNumbers(hotel.price)}</span>
                            <img src="/Riyal_White.png" alt="Riyal" width={14} height={14} />
                            <span>/ ليلة</span>
                          </>
                        ) : (
                          <>
                            Night /
                            <img src="/Riyal_White.png" alt="Riyal" width={14} height={14} />
                            {hotel.price}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
};

export default Offers;
