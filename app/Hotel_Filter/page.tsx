"use client";

import Header from "../_components/header/page";
import HotelFilter from "../_components/Hotel_Filter/Hotel_filter";
import Footer from "../_components/footer/page";

export default function HotelFilterPage() {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Hotels in Makkah</h1>
        <HotelFilter />
      </div>
      <Footer />
    </div>
  );
}