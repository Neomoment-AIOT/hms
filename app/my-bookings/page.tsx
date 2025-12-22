"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaUser,
    FaChild,
    FaDoorOpen,
    FaCalendarAlt,
} from "react-icons/fa";
import Header from "../_components/header/page";
import Footer from "../_components/footer/page";
import { LangContext } from "@/app/lang-provider";

type Booking = {
    id: string; // always English
    name: string; // always English
    hotelEn: string;
    hotelAr: string;
    image: string;
    rooms: number;
    adults: number;
    children: number;
    statusEn: string;
    statusAr: string;
    checkIn: string; // numbers stay English
    checkOut: string;
};

const individualBookings: Booking[] = [
    {
        id: "Raffah / 00567",
        name: "Fawad Ali",
        hotelEn: "Raffah Hotel",
        hotelAr: "فندق رافة",
        image: "/hotel/hotel3.jpeg",
        rooms: 1,
        adults: 2,
        children: 2,
        statusEn: "Not confirmed",
        statusAr: "غير مؤكدة",
        checkIn: "02/18/2025",
        checkOut: "03/19/2025",
    },
    {
        id: "Velvet Hotel / 00137",
        name: "Fawad Ali",
        hotelEn: "Velvet Hotel",
        hotelAr: "فندق فيلفيت",
        image: "/hotel/hotel13.jpeg",
        rooms: 1,
        adults: 1,
        children: 1,
        statusEn: "Not confirmed",
        statusAr: "غير مؤكدة",
        checkIn: "02/22/2025",
        checkOut: "03/24/2025",
    },
];

const groupBookings: Booking[] = [
    {
        id: "Velvet Hotel / 00136",
        name: "Fawad Ali",
        hotelEn: "Velvet Hotel",
        hotelAr: "فندق فيلفيت",
        image: "/hotel/hotel13.jpeg",
        rooms: 1,
        adults: 1,
        children: 1,
        statusEn: "Not confirmed",
        statusAr: "غير مؤكدة",
        checkIn: "02/22/2025",
        checkOut: "03/24/2025",
    },
    {
        id: "Raffah / 00567",
        name: "Fawad Ali",
        hotelEn: "Raffah Hotel",
        hotelAr: "فندق رافة",
        image: "/hotel/hotel3.jpeg",
        rooms: 1,
        adults: 2,
        children: 2,
        statusEn: "Not confirmed",
        statusAr: "غير مؤكدة",
        checkIn: "02/18/2025",
        checkOut: "03/19/2025",
    },
];

export default function MyBookingsPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"individual" | "group">("individual");
    const { lang } = useContext(LangContext);
    const isArabic = lang === "ar";

    const bookings = tab === "individual" ? individualBookings : groupBookings;

    return (
        <>
            <Header />
            <div
                className={`min-h-screen bg-[#F2F4F4] p-8 mt-15 ${isArabic ? "font-arabic" : ""
                    }`}
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 mb-6"
                >
                    {isArabic ? (
                        <>
                            <FaArrowRight /> رجوع
                        </>
                    ) : (
                        <>
                            <FaArrowLeft /> Back
                        </>
                    )}
                </button>

                {/* Container */}
                <div className="bg-white rounded-xl p-6 shadow">
                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setTab("individual")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "individual"
                                    ? "bg-gray-100 text-black"
                                    : "text-gray-500"
                                }`}
                        >
                            {isArabic ? "الحجز الفردي" : "Individual Booking"}
                        </button>

                        <button
                            onClick={() => setTab("group")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "group"
                                    ? "bg-gray-100 text-black"
                                    : "text-gray-500"
                                }`}
                        >
                            {isArabic ? "الحجز الجماعي" : "Group Booking"}
                        </button>
                    </div>

                    {/* Cards */}
                    <div className="flex gap-6 flex-wrap">
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className="w-[360px] border rounded-xl p-5 shadow-sm bg-white"
                            >
                                <div
                                    className={`flex gap-4 ${isArabic ? "flex-row-reverse" : ""
                                        }`}
                                >
                                    <img
                                        src={b.image}
                                        alt={isArabic ? b.hotelAr : b.hotelEn}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />

                                    <div>
                                        {/* Name always English */}
                                        <h3 className="font-semibold">{b.name}</h3>

                                        <p className="text-sm text-gray-500">
                                            {isArabic ? b.hotelAr : b.hotelEn}
                                        </p>

                                        <span className="inline-block mt-1 text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                                            {b.id}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mt-5 space-y-2 text-sm text-gray-700">
                                    <p
                                        className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <FaDoorOpen />
                                        {isArabic ? "عدد الغرف" : "Room count"}
                                        <span className="ml-auto">{b.rooms}</span>
                                    </p>

                                    <p
                                        className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <FaUser />
                                        {isArabic ? "البالغون" : "Adults"}
                                        <span className="ml-auto">{b.adults}</span>
                                    </p>

                                    <p
                                        className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <FaChild />
                                        {isArabic ? "الأطفال" : "Children"}
                                        <span className="ml-auto">{b.children}</span>
                                    </p>

                                    <p>
                                        <strong>{isArabic ? "الحالة" : "Status"}</strong>
                                        <span className="ml-2 text-gray-500">
                                            {isArabic ? b.statusAr : b.statusEn}
                                        </span>
                                    </p>

                                    <p
                                        className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <FaCalendarAlt />
                                        {isArabic ? "تسجيل الوصول" : "Check-in"}
                                        <span className="ml-auto">{b.checkIn}</span>
                                    </p>

                                    <p
                                        className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <FaCalendarAlt />
                                        {isArabic ? "تسجيل المغادرة" : "Check-out"}
                                        <span className="ml-auto">{b.checkOut}</span>
                                    </p>
                                </div>

                                {/* Action */}
                                <button className="mt-6 w-full bg-[#1F8593] text-white py-2 rounded-lg font-semibold hover:opacity-90">
                                    {isArabic ? "إلغاء الحجز" : "Cancel Booking"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
