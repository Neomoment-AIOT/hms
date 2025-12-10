import Header from "../_components/header/page";
import HotelBanner from "../_components/Hotel/HotelBanner";
import Room from "../_components/Hotel/rooms";
import Amenities from "../_components/Hotel/amenities";
import Review from "../_components/About/review";
import Footer from "../_components/footer/page";

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