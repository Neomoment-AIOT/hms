import Header from "../_components/header/page";
import BlogBanner from "../_components/Blog/BlogBanner";
import BlogsPage from "../_components/Blog/BlogsPage";
import Footer from "../_components/footer/page";

export default function Blog() {
    return (
        <div>
            <Header />
            <BlogBanner />
            <BlogsPage />
            <Footer />
        </div>
    );
}