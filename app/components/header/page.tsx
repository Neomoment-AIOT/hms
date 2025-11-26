"use client";
import { useState } from "react";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);
  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const otherLanguage = language === "English" ? "Arabic" : "English";

  return (
    <header className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" >
          <div className="bg-white rounded-full w-auto h-auto flex justify-center items-center">
            <img src="/logo.png" alt="Al Refa logo" className="h-16 w-16 object-cover" />
          </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-7 relative">
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/hotel" className="hover:underline">Hotels</a>
          <a href="/contact" className="hover:underline">Contact Us</a>
          <a href="/blog" className="hover:underline">Blogs</a>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLangDropdown}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FaGlobe size={16} />
              <span>{language}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-32">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => selectLanguage(otherLanguage)}
                >
                  {otherLanguage}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/booking")}
            className="border border-white px-3 py-1 rounded hover:bg-white hover:text-teal-700 transition"
          >
            Retrieve Booking
          </button>

          <button
            onClick={() => router.push("/signin")}
            className="bg-white text-teal-700 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Sign In
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none text-2xl"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white text-black w-[90%] transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleMenu}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 p-6 text-lg">
          <a href="/" className="hover:text-teal-600" onClick={toggleMenu}>Home</a>
          <a href="/about" className="hover:text-teal-600" onClick={toggleMenu}>About Us</a>
          <a href="/hotel" className="hover:text-teal-600" onClick={toggleMenu}>Hotels</a>
          <a href="/contact" className="hover:text-teal-600" onClick={toggleMenu}>Contact Us</a>
          <a href="/blog" className="hover:text-teal-600" onClick={toggleMenu}>Blog</a>

          {/* Language Dropdown Mobile */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-2 hover:text-teal-600"
            >
              <FaGlobe size={18} />
              <span>{language}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="mt-2 bg-white text-black rounded shadow-lg w-32">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => { selectLanguage(otherLanguage); toggleMenu(); }}
                >
                  {otherLanguage}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { router.push("/booking"); toggleMenu(); }}
            className="border border-teal-600 px-4 py-2 rounded hover:bg-teal-600 hover:text-white transition"
          >
            Retrieve Booking
          </button>

          <button
            onClick={() => { router.push("/signin"); toggleMenu(); }}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Sign In 
          </button>
        </nav>
      </div>
    </header>
  );
}