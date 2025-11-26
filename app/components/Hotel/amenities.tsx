"use client";

import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const WifiIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <path d="M4.5 9.5A11.5 11.5 0 0 1 12 7c2.73 0 5.23.96 7.5 2.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M7 12.5A8.5 8.5 0 0 1 12 11c1.8 0 3.46.55 5 1.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.75 15a4.5 4.5 0 0 1 4.5 0" stroke="currentColor" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1.25" fill="currentColor" />
  </svg>
);

const BedIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="3" y="10" width="18" height="7" rx="1.5" stroke="currentColor" />
    <rect x="5" y="11" width="5" height="3" rx="1" stroke="currentColor" />
    <rect x="13" y="11" width="6" height="3" rx="1" stroke="currentColor" />
    <path d="M4 17v2M20 17v2" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const DumbbellIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="4" y="9" width="3" height="6" rx="0.75" stroke="currentColor" />
    <rect x="17" y="9" width="3" height="6" rx="0.75" stroke="currentColor" />
    <path d="M7 11h10M7 13h10" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const LiftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" />
    <path d="M9 16V9h6v7" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.5 7 8 5.5 6.5 7M14.5 5.5 16 7l1.5-1.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const LaundryIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" />
    <path d="M8 7h2.5M14 7h1.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const NoSmokingIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M8 15h5M15 15h1.5a1 1 0 0 0 0-2H16M15 11h1a1 1 0 0 0 0-2h-.2" stroke="currentColor" strokeLinecap="round" />
    <path d="M8 9l8 8" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const RestaurantIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <path d="M7 4v7.5M9 4v7.5M5 4v7.5a2 2 0 0 0 2 2v4.5" stroke="currentColor" strokeLinecap="round" />
    <path d="M15 4v6.5a2.5 2.5 0 0 0 2.5 2.5H18v5" stroke="currentColor" strokeLinecap="round" />
    <path d="M15 4h3" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const ParkingIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M10 16V8h3a2 2 0 0 1 0 4h-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckedCircleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WheelchairIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="11" cy="6" r="1.5" stroke="currentColor" />
    <path d="M10.5 8.5 11 11h3l1.5 5.5M9 11l-1 2.5a3.5 3.5 0 1 0 6.2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NoParkingIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
    <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
    <path d="M10 16V8h3a2 2 0 0 1 0 4h-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 8.5 15.5 15.5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const sidebarItems = [
  { label: "Wi-Fi", icon: WifiIcon },
  { label: "Front-end Desk", icon: BedIcon },
  { label: "Fitness center", icon: DumbbellIcon },
  { label: "Lifts", icon: LiftIcon },
  { label: "Laundry service", icon: LaundryIcon },
  { label: "Non-smoking hotel", icon: NoSmokingIcon },
  { label: "Restaurant", icon: RestaurantIcon },
  { label: "Parking", icon: ParkingIcon },
  { label: "Fitness center", icon: DumbbellIcon },
];

export default function Amenities() {
  return (
    <section className="w-full bg-[#0e7c86] py-10">
      {/* 👇 IMPORTANT: make this match your navbar container */}
      <div className="mx-auto max-w-7xl px-8">
        <div className="bg-white w-full rounded-[28px] p-6 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1 space-y-6 rounded-[26px] bg-[#f8fafc] px-6 py-6">
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center space-x-3 text-sm text-gray-700"
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
            {/* Wi-Fi */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <WifiIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">Wi-Fi</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Free Wi-Fi</span>
                </li>
              </ul>
            </div>

            {/* Front-end desk */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <BedIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">Front-end desk</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Front desk services</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Laundry service</span>
                </li>
              </ul>
            </div>

            {/* Accessibility */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <WheelchairIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">Accessibility</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Wheelchair accessible</span>
                </li>
              </ul>
            </div>

            {/* Food & drink */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <RestaurantIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">Food & drink</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Free Restaurant Wi-Fi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span className="flex items-center space-x-2">
                    <span>Breakfast</span>
                    <span className="bg-[#f9c65c] text-[#7a4b00] text-[11px] px-2 py-0.5 rounded">
                      Extra charges
                    </span>
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Vending machines</span>
                </li>
              </ul>
            </div>

            {/* Beauty & wellness */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <DumbbellIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">Beauty & wellness</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span>Gym/fitness centre</span>
                </li>
              </ul>
            </div>

            {/* Parking & transportation */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <NoParkingIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">
                  Parking & transportation
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500 text-lg leading-none">✓</span>
                  <span className="flex items-center space-x-2">
                    <span>Parking</span>
                    <span className="bg-[#cdeed9] text-[#2f855a] text-[11px] px-2 py-0.5 rounded">
                      Free
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* General */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#e3d7ff] rounded-full flex items-center justify-center text-[#5a3ec8]">
                  <CheckedCircleIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">General</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Lifts",
                  "Breakfast",
                  "Non-smoking hotel",
                  "Multilingual staff",
                  "Business center",
                ].map((text) => (
                  <li key={text} className="flex items-center space-x-2">
                    <span className="text-green-500 text-lg leading-none">
                      ✓
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}