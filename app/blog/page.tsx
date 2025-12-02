import Header from "../components/header/page";
import BlogBanner from "../components/Blog/BlogBanner";
import BlogsPage from "../components/Blog/BlogsPage";
import Footer from "../components/footer/page";

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