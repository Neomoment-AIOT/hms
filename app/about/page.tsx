"use client";

import Label from "../_components/About/label";
import Header from "../_components/header/page";
import AboutUs from "../_components/About/about_us";
import FAQ from "../_components/About/faq";
import Footer from "../_components/footer/page";
import Review from "../_components/About/review";

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
