import Header from "../components/header/page";
import ContactBanner from "../components/Contact/contactBanner";
import ContactUs from "../components/Contact/contact_us";
import Map from "../components/Contact/map";
import Footer from "../components/footer/page";

export default function Contact() {
    return (
        <div>
            <Header />
            <ContactBanner />
            <ContactUs />
            <Map />
            <Footer />
        </div>
    );
}