"use client";

import Label from "../components/About/label";
import Header from "../components/header/page";
import AboutUs from "../components/About/about_us";
import FAQ from "../components/About/faq";
import Footer from "../components/footer/page";
import Review from "../components/About/review";

export default function About() {

  return (
    <div>
      <Header />
      <Label />
      <AboutUs />
      <FAQ />
      <Review />
      <Footer />
    </div>
  );
}
