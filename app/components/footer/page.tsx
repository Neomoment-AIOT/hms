"use client";

import { useState, FormEvent } from "react";
import { FaLinkedin, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setStatus({ loading: false, success: true, error: "" });
      setEmail(""); // Clear input

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: "Something went wrong. Try again.",
      });
    }
  };

  return (
    <footer className="bg-black text-gray-300 px-6 py-12 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/hotel" className="hover:text-white">Hotels</a></li>
            <li><a href="/blog" className="hover:text-white">Blogs</a></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div className="col-span-1 text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Contact Information</h3>
          <ul className="space-y-2">
            <li>Phone: +966 9200 10417</li>
            <li>Email: marketing@alrefaa.co</li>
            <li>Location: Al Azizyah, Makkah, Saudia</li>
          </ul>
        </div>

        {/* Policies */}
        <div className="text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Policies</h3>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>Cancellation Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>


        {/* Subscribe Section */}
        <div className="bg-gray-800 p-6 rounded-lg col-span-1 w-full">
          <h3 className="text-white font-semibold mb-4">Subscribe</h3>
          
          {/* Form wrapper */}
          <form onSubmit={handleSubscribe} className="flex mb-2">
            <input
              suppressHydrationWarning
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="w-full rounded-l-md px-4 py-2 text-gray-900 bg-white focus:outline-none"
            />
            <button
              suppressHydrationWarning
              type="submit"
              disabled={status.loading}
              className="bg-teal-600 text-white rounded-r-md px-4 flex items-center justify-center hover:bg-teal-700 disabled:opacity-50"
            >
              {status.loading ? (
                <span className="text-xs">...</span>
              ) : (
                <FaArrowRight size={18} />
              )}
            </button>
          </form>

          {/* Status Messages */}
          <div className="min-h-[24px] mb-2">
            {status.success && (
              <p className="text-green-400 text-sm">Subscribed successfully!</p>
            )}
            {status.error && (
              <p className="text-red-400 text-sm">{status.error}</p>
            )}
          </div>

          <p className="text-sm text-gray-400">
            Our goal is to translate the positive effects from revolutionizing how companies
            engage with their clients & their team.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Bottom section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>Copyright &copy; 2025 AL-Riffa</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaLinkedin size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaFacebook size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <SiX size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaInstagram size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}