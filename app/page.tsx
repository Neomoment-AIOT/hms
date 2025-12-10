"use client";

import Header from "./_components/header/page";
import Footer from "./_components/footer/page";
import Banner from "./_components/Home/Banner";
import Hotels from "./_components/Home/hotels";
import Offers from "./_components/Home/offers";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Header />
      <Banner />
      <Hotels />
      <Offers />
      <Footer />
    </div>
  );
}
