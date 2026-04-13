import Header from "../_components/header/page";
import HotelBanner from "../_components/Hotel/HotelBanner";
import HotelsListSection from "../_components/Hotel/HotelsListSection";
import Footer from "../_components/footer/page";

export default function Hotel() {
  return (
    <div>
      <Header />
      <HotelBanner />
      <HotelsListSection />
      <Footer />
    </div>
  );
}
