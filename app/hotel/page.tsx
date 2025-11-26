import Header from "../components/header/page";
import HotelBanner from "../components/Hotel/HotelBanner";
import Room from "../components/Hotel/rooms";
import Amenities from "../components/Hotel/amenities";
import Review from "../components/About/review";
import Footer from "../components/footer/page";

export default function Hotel(){
    return (
        <div>
            <Header />
            <HotelBanner />
            <Room />
            <Amenities />
            <Review />
            <Footer />
        </div>
    );
}