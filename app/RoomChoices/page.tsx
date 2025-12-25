"use client";

import Header from "../_components/header/page";
import HotelTab from "../_components/RoomChoicesPage/HotelTab";
import RoomChoicesPage from "../_components/RoomChoicesPage/roomchoicepage";
import Footer from "../_components/footer/page";


export default function RoomPage() {
    return (
        <div>
            <Header />
            <HotelTab />
            <RoomChoicesPage />
            <Footer />
        </div>
    );
}