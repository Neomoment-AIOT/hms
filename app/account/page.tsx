"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { LangContext } from "@/app/lang-provider";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import MyBookingsPage from "../my-bookings/page";
import MyReservationsPage from "../_components/my-reservations/MyReservationsPage";

const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad",
  "Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus",
  "Czechia (Czech Republic)","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini (fmr. 'Swaziland')","Ethiopia",
  "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
  "Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar",
  "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia",
  "Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (formerly Burma)","Namibia","Nauru",
  "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
  "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka",
  "Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga",
  "Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States of America","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

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
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleSave = () => {
    const updatedUser = { name: `${firstName} ${lastName}`, email };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert(isArabic ? "تم حفظ البيانات!" : "Saved successfully!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

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
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
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
              <button onClick={handleSave} className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-4 py-2 rounded">{isArabic ? "حفظ" : "Save"}</button>
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
