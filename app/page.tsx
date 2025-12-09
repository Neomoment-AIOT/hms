"use client";

import Header from "./components/header/page";
import Footer from "./components/footer/page";
import Banner from "./components/Home/Banner";
import Hotels from "./components/Home/hotels";
import Offers from "./components/Home/offers";

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
