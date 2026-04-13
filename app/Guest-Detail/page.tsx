import { Suspense } from "react";
import Header from "../_components/header/page";
import GuestDetailsPage from "../_components/guest-details/GuestDetailsPage";
import Footer from "../_components/footer/page";

export default function GuestPage() {
  return (
    <div>
      <Header />
      {/* Suspense required: GuestDetailsPage uses useSearchParams() */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <GuestDetailsPage />
      </Suspense>
      <Footer />
    </div>
  );
}
