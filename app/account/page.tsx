"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { LangContext } from "@/app/lang-provider";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import MyBookingsPage from "../my-bookings/page";
import MyReservationsPage from "../_components/my-reservations/MyReservationsPage";
import { signOut } from "@/app/utils/auth";

type CountryOption = {
  id: number;
  country: string;
};

export default function AccountPage() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activePage, setActivePage] = useState("profile");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/account/profile");
        const json = await res.json();

        if (json.ok && json.data) {
          const d = json.data;
          const fullName = (d.name || d.complete_name || "").split(" ");
          setFirstName(fullName[0] || "");
          setLastName(fullName.slice(1).join(" ") || "");
          setEmail(d.email || "");
          setCity(d.city || "");
          setZip(d.zip || "");
          setCurrentLocation(d.street || "");
          setCountryId(d.country_id || null);

          setUser({ name: d.name || "", email: d.email || "" });
          setProfileLoading(false);
          return;
        }
      } catch {
        // API failed, try localStorage fallback
      }

      // Fallback: localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        const nameParts = (parsed.name || "").split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(parsed.email || "");
      }
      setProfileLoading(false);
    };

    loadProfile();
  }, []);

  // Load countries from API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch("/api/geo/countries-states");
        const json = await res.json();

        if (json.ok && Array.isArray(json.data)) {
          setCountries(
            json.data.map((c: { id: number; country: string }) => ({
              id: c.id,
              country: c.country,
            }))
          );

          // Set initial country selection from profile
          if (countryId) {
            const match = json.data.find((c: { id: number }) => c.id === countryId);
            if (match) setCountry(String(match.id));
          }
        }
      } catch {
        // Countries API failed — leave empty
      }
    };

    loadCountries();
  }, [countryId]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          city,
          zip,
          street: currentLocation,
          country_id: country ? parseInt(country) : undefined,
        }),
      });

      const json = await res.json();

      if (json.ok) {
        const updatedUser = { name: `${firstName} ${lastName}`.trim(), email };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert(isArabic ? "تم حفظ البيانات!" : "Saved successfully!");
      } else {
        alert(json.error || (isArabic ? "فشل الحفظ" : "Save failed"));
      }
    } catch {
      alert(isArabic ? "فشل الحفظ" : "Save failed");
    }
    setSaving(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  if (profileLoading) {
    return <div className="p-8 text-gray-500">{isArabic ? "جاري التحميل..." : "Loading..."}</div>;
  }

  if (!user) return <p className="p-8 text-red-500">{isArabic ? "أنت لست مسجلاً الدخول" : "You are not logged in."}</p>;

  return (
    <div className={`min-h-screen ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-gray-100 p-6 md:w-64 w-full shrink-0">
          <div className="flex flex-col md:block justify-between">
            <h2 className="text-lg font-semibold mb-6">{isArabic ? "الإعدادات" : "Setting"}</h2>
            <ul className="space-y-4">
  <li
    className={`cursor-pointer ${activePage === "profile" ? "font-semibold text-teal-600" : ""}`}
    onClick={() => setActivePage("profile")}
  >
    {isArabic ? "الملف الشخصي" : "Profile"}
  </li>

  <li
    className={`cursor-pointer ${activePage === "reservations" ? "font-semibold text-teal-600" : ""}`}
    onClick={() => setActivePage("reservations")}
  >
    {isArabic ? "حجوزاتي" : "My Reservations"}
  </li>

  <li className="cursor-pointer" onClick={handleLogout}>
    {isArabic ? "تسجيل الخروج" : "Logout"}
  </li>
</ul>

            <Link href="/" className="mt-6 inline-block bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-5 py-2 rounded">
              {isArabic ? "العودة للصفحة الرئيسية" : "Back to Home"}
            </Link>
          </div>
        </aside>
        {activePage === "profile" && (
  <>

      {/* Main content */}
        <main className="flex-1 bg-white p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">{isArabic ? "الإعدادات" : "Setting"}</h1>
          <div className="space-y-4">

            {/* Name */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label className="block text-sm font-medium">{isArabic ? "الاسم الأول" : "First Name"}</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded p-2"/>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">{isArabic ? "الاسم الأخير" : "Last Name"}</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded p-2"/>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">{isArabic ? "البريد الإلكتروني" : "Email Address"}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded p-2"/>
            </div>

            {/* Profile photo */}
            <div>
              <label className="block text-sm font-medium">{isArabic ? "صورتك" : "Your photo"}</label>
              <div className="flex items-center space-x-4 mt-2 flex-col md:flex-row">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden">
                  {previewImage ? <img src={previewImage} alt="Profile" className="w-full h-full object-cover"/> : <FaUser className="text-gray-500" size={24}/>}
                </div>
                <div onClick={() => fileRef.current?.click()} className="border-dashed border-2 border-gray-300 rounded p-4 text-center cursor-pointer">
                  {isArabic ? "انقر للرفع أو السحب والإفلات" : "Click to upload or drag and drop"}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
              </div>
            </div>

            {/* Mobile, Country, City, Zip, Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">{isArabic ? "رقم الهاتف" : "Mobile Number"}</label>
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={isArabic ? "أدخل رقم هاتفك" : "Enter your mobile number"} className="w-full border rounded p-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium">{isArabic ? "الدولة" : "Country"}</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border rounded p-2">
                  <option value="" disabled>{isArabic ? "اختر الدولة" : "Select a country"}</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.country}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">{isArabic ? "المدينة" : "City"}</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={isArabic ? "أدخل المدينة" : "Enter your city"} className="w-full border rounded p-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium">{isArabic ? "الرمز البريدي" : "Zip Code"}</label>
                <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder={isArabic ? "أدخل الرمز البريدي" : "Enter zip code"} className="w-full border rounded p-2"/>
              </div>

              <div>
                <label className="block text-sm font-medium">{isArabic ? "الموقع الحالي" : "Current Location"}</label>
                <input type="text" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} placeholder={isArabic ? "أدخل موقعك الحالي" : "Enter current location"} className="w-full border rounded p-2"/>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium">{isArabic ? "نبذة عنك" : "Bio"}</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full border rounded p-2"/>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4">
              <button onClick={handleSave} disabled={saving} className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-4 py-2 rounded disabled:opacity-50">
                {saving ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ" : "Save")}
              </button>
              <button onClick={() => window.location.reload()} className="border px-4 py-2 rounded">{isArabic ? "إلغاء" : "Cancel"}</button>
            </div>

          </div>
        </main>
  </>
)}
        {activePage === "reservations" && <MyReservationsPage />}

      </div>
    </div>
  );
}
