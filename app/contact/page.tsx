import Header from "../_components/header/page";
import ContactBanner from "../_components/Contact/contactBanner";
import ContactUs from "../_components/Contact/contact_us";
import Map from "../_components/Contact/map";
import Footer from "../_components/footer/page";

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