"use client";

import React, { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = React.FC<IconProps>;

/* ---------------- ICONS ---------------- */
const WifiIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <path d="M4.5 9.5A11.5 11.5 0 0 1 12 7c2.73 0 5.23.96 7.5 2.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M7 12.5A8.5 8.5 0 0 1 12 11c1.8 0 3.46.55 5 1.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.75 15a4.5 4.5 0 0 1 4.5 0" stroke="currentColor" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1.25" fill="currentColor" />
  </svg>
);

const BedIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="3" y="10" width="18" height="7" rx="1.5" stroke="currentColor" />
    <rect x="5" y="11" width="5" height="3" rx="1" stroke="currentColor" />
    <rect x="13" y="11" width="6" height="3" rx="1" stroke="currentColor" />
    <path d="M4 17v2M20 17v2" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const DumbbellIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="4" y="9" width="3" height="6" rx="0.75" stroke="currentColor" />
    <rect x="17" y="9" width="3" height="6" rx="0.75" stroke="currentColor" />
    <path d="M7 11h10M7 13h10" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const LiftIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" />
    <path d="M9 16V9h6v7" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.5 7 8 5.5 6.5 7M14.5 5.5 16 7l1.5-1.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const LaundryIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" />
    <path d="M8 7h2.5M14 7h1.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const NoSmokingIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M8 15h5M15 15h1.5a1 1 0 0 0 0-2H16M15 11h1a1 1 0 0 0 0-2h-.2" stroke="currentColor" strokeLinecap="round" />
    <path d="M8 9l8 8" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const RestaurantIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <path d="M7 4v7.5M9 4v7.5M5 4v7.5a2 2 0 0 0 2 2v4.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M15 4v6.5a2.5 2.5 0 0 0 2.5 2.5H18v5" stroke="currentColor" strokeLinecap="round" />
    <path d="M15 4h3" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const ParkingIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M10 16V8h3a2 2 0 0 1 0 4h-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckedCircleIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WheelchairIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="11" cy="6" r="1.5" stroke="currentColor" />
    <path d="M10.5 8.5 11 11h3l1.5 5.5M9 11l-1 2.5a3.5 3.5 0 1 0 6.2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------- SIDEBAR DATA ---------------- */
const sidebarItems = [
  { en: "Wi-Fi", ar: "الواي فاي", icon: WifiIcon },
  { en: "Front desk", ar: "الاستقبال", icon: BedIcon },
  { en: "Fitness Center", ar: "مركز اللياقة", icon: DumbbellIcon },
  { en: "Lifts", ar: "المصاعد", icon: LiftIcon },
  { en: "Laundry Service", ar: "خدمة غسيل الملابس", icon: LaundryIcon },
  { en: "Non-smoking Hotel", ar: "فندق لغير المدخنين", icon: NoSmokingIcon },
  { en: "Restaurant", ar: "مطعم", icon: RestaurantIcon },
  { en: "Parking", ar: "مواقف السيارات", icon: ParkingIcon },
];

/* ---------------- AMENITIES COMPONENT ---------------- */
export default function Amenities() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  return (
    <section className={`w-full bg-[#0e7c86] py-10 ${ar ? "text-right font-arabic" : "text-left"}`}>
      <div className="mx-auto max-w-7xl px-8">

        <div className={`bg-white w-full rounded-[28px] p-6 md:p-10 flex flex-col md:flex-row ${ar ? "md:flex-row-reverse" : ""} gap-8`}>

          {/* SIDEBAR */}
          <div className="md:w-1/4 space-y-6 rounded-[26px] bg-[#f8fafc] px-6 py-6">
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`flex items-center ${ar ? "flex-row-reverse space-x-reverse" : ""} space-x-3 text-sm text-gray-700`}>
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{ar ? item.ar : item.en}</span>
                </div>
              );
            })}
          </div>

          {/* CONTENT */}
          <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

            {ar ? (
              <>
                {/* Right column (Column 1) */}
                <div className="space-y-6 order-3">
                  <AmenityBox ar={ar} Icon={WifiIcon} title_en="Wi-Fi" title_ar="الواي فاي" items_en={["Free Wi-Fi"]} items_ar={["واي فاي مجاني"]} />
                  <AmenityBox ar={ar} Icon={RestaurantIcon} title_en="Food & drink" title_ar="الطعام والشراب"
                    items_en={["Free restaurant Wi-Fi", "Breakfast – Extra charges", "Vending machines"]}
                    items_ar={["مطعم واي فاي مجاني", "إفطار – رسوم إضافية", "آلات البيع"]}
                    highlightIndex={1}
                  />
                  <AmenityBox ar={ar} Icon={CheckedCircleIcon} title_en="General" title_ar="عام"
                    items_en={["Lifts", "Breakfast", "Non-smoking hotel", "Multilingual staff", "Business center"]}
                    items_ar={["المصاعد", "إفطار", "فندق لغير المدخنين", "طاقم عمل متعدد اللغات", "مركز أعمال"]}
                  />
                </div>

                {/* Middle column (Column 2) */}
                <div className="space-y-6 order-2">
                  <AmenityBox ar={ar} Icon={BedIcon} title_en="Front desk" title_ar="مكتب الواجهة الأمامية" items_en={["Front desk services", "Laundry service"]} items_ar={["خدمات مكتب الاستقبال", "خدمة غسيل الملابس"]} />
                  <AmenityBox ar={ar} Icon={DumbbellIcon} title_en="Beauty & wellness" title_ar="الجمال والعافية" items_en={["Gym / fitness centre"]} items_ar={["صالة ألعاب رياضية / مركز لياقة بدنية"]} />
                </div>

                {/* Left column (Column 3) */}
                <div className="space-y-6 order-1">
                  <AmenityBox ar={ar} Icon={WheelchairIcon} title_en="Accessibility" title_ar="إمكانية الوصول" items_en={["Wheelchair accessible"]} items_ar={["إمكانية وصول الكراسي المتحركة"]} />
                  <AmenityBox ar={ar} Icon={ParkingIcon} title_en="Parking & transportation" title_ar="مواقف السيارات والنقل" items_en={["Parking – Free"]} items_ar={["وقوف السيارات"]} />
                </div>
              </>
            ) : (
              <>
                {/* English version unchanged */}
                <AmenityBox ar={ar} Icon={WifiIcon} title_en="Wi-Fi" title_ar="الواي فاي" items_en={["Free Wi-Fi"]} items_ar={["واي فاي مجاني"]} />
                <AmenityBox ar={ar} Icon={BedIcon} title_en="Front desk" title_ar="الاستقبال" items_en={["Front desk services", "Laundry service"]} items_ar={["خدمات الاستقبال", "خدمة غسيل الملابس"]} />
                <AmenityBox ar={ar} Icon={WheelchairIcon} title_en="Accessibility" title_ar="إمكانية الوصول" items_en={["Wheelchair accessible"]} items_ar={["إمكانية وصول الكراسي المتحركة"]} />
                <AmenityBox ar={ar} Icon={RestaurantIcon} title_en="Food & drink" title_ar="الطعام والشراب"
                  items_en={["Free restaurant Wi-Fi", "Breakfast – Extra charges", "Vending machines"]}
                  items_ar={["واي فاي مجاني في المطعم", "الإفطار – رسوم إضافية", "ماكينات بيع"]}
                  highlightIndex={1}
                />
                <AmenityBox ar={ar} Icon={DumbbellIcon} title_en="Beauty & wellness" title_ar="العافية والرياضة" items_en={["Gym / fitness centre"]} items_ar={["مركز اللياقة البدنية"]} />
                <AmenityBox ar={ar} Icon={ParkingIcon} title_en="Parking & transportation" title_ar="مواقف وإنتقالات" items_en={["Parking – Free"]} items_ar={["موقف سيارات – مجاني"]} />
                <AmenityBox ar={ar} Icon={CheckedCircleIcon} title_en="General" title_ar="عام"
                  items_en={["Lifts", "Breakfast", "Non-smoking hotel", "Multilingual staff", "Business center"]}
                  items_ar={["المصاعد", "الإفطار", "فندق لغير المدخنين", "طاقم متعدد اللغات", "مركز أعمال"]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- AMENITY BOX ---------------- */
interface AmenityBoxProps {
  ar: boolean;
  Icon: IconComponent;
  title_en: string;
  title_ar: string;
  items_en: string[];
  items_ar: string[];
  highlightIndex?: number;
}

function AmenityBox({ ar, Icon, title_en, title_ar, items_en, items_ar, highlightIndex = -1 }: AmenityBoxProps) {
  const items = ar ? items_ar : items_en;

  return (
    <div>
      <div className={`flex items-center mb-3 ${ar ? "flex-row-reverse space-x-reverse" : ""} space-x-3`}>
        <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-base font-semibold">{ar ? title_ar : title_en}</h3>
      </div>

      <ul className="space-y-2 text-gray-700">
        {items.map((text, index) => (
          <li key={index} className={`flex items-center ${ar ? "flex-row-reverse space-x-reverse" : ""} space-x-2`}>
            <span className="text-green-500 text-lg leading-none">✓</span>
            {highlightIndex === index ? (
              <span className={`flex items-center ${ar ? "flex-row-reverse space-x-reverse" : ""} space-x-2`}>
                <span>{text.split("–")[0]}</span>
                <span className="bg-[#f9c65c] text-[#7a4b00] text-[11px] px-2 py-0.5 rounded">
                  {ar ? "رسوم إضافية" : "Extra charges"}
                </span>
              </span>
            ) : (
              <span>{text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
