"use client";

import { FaLinkedin, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 px-6 py-12 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/hotel" className="hover:text-white">Hotels</a></li>
            <li><a href="/blog" className="hover:text-white">Blogs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Information</h3>
          <ul className="space-y-2">
            <li>Phone: +966 9200 10417</li>
            <li>Email: marketing@alrefaa.co</li>
            <li>Location: Al Azizyah, Makkah, Saudia</li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-semibold mb-4">Policies</h3>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>Cancellation Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white font-semibold mb-4">Subscribe</h3>
          <div className="flex mb-4">
            <input
              suppressHydrationWarning
              type="email"
              placeholder="Email address"
              className="w-full rounded-l-md px-4 py-2 text-gray-900 bg-white focus:outline-none"
            />
            <button
              suppressHydrationWarning
              className="bg-teal-600 text-white rounded-r-md px-4 flex items-center justify-center hover:bg-teal-700"
            >
              <FaArrowRight size={18} />
            </button>
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
          <a
            className="text-white border border-gray-200 p-3 rounded-full transition-colors"
            href="#"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            className="text-white border border-gray-200 p-3 rounded-full transition-colors"
            href="#"
          >
            <FaFacebook size={24} />
          </a>
          <a
            className="text-white border border-gray-200 p-3 rounded-full transition-colors"
            href="#"
          >
            <SiX size={24} />
          </a>
          <a
            className="text-white border border-gray-200 p-3 rounded-full  transition-colors"
            href="#"
          >
            <FaInstagram size={24} />
          </a>
          <a
            className="text-white border border-gray-200 p-3 rounded-full  transition-colors"
            href="#"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}