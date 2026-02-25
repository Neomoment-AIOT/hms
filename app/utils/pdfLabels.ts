/* ────────── PDF Label Keys & Types ────────── */

export type PDFLabels = {
  confirmed: string;
  bookingConfirmed: string;
  bookingDetails: string;
  bookingConfirmationNo: string;
  guestName: string;
  email: string;
  stayDetails: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  roomDetails: string;
  roomType: string;
  noOfRooms: string;
  hotelRating: string;
  mealServices: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  notSelected: string;
  priceBreakdown: string;
  room: string;
  totalAmount: string;
  paymentStatus: string;
  paid: string;
  importantInfo: string;
  note1: string;
  note2: string;
  note3: string;
  note4: string;
  phone: string;
  generatedOn: string;
  currency: string;
};

/* ────────── Default English Labels ────────── */

export const DEFAULT_LABELS_EN: PDFLabels = {
  confirmed: "Confirmed",
  bookingConfirmed: "Your booking has been confirmed.",
  bookingDetails: "Booking Details",
  bookingConfirmationNo: "Booking Confirmation No.",
  guestName: "Guest Name",
  email: "Email",
  stayDetails: "Stay Details",
  checkIn: "Check-in",
  checkOut: "Check-out",
  checkInTime: "Check-in Time",
  checkOutTime: "Check-out Time",
  roomDetails: "Room Details",
  roomType: "Room Type",
  noOfRooms: "No. of Rooms",
  hotelRating: "Hotel Rating",
  mealServices: "Meal Services",
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  notSelected: "Not selected",
  priceBreakdown: "Price Breakdown",
  room: "Room",
  totalAmount: "Total Amount",
  paymentStatus: "Payment Status",
  paid: "PAID",
  importantInfo: "Important Information",
  note1: "Please present this confirmation at the front desk upon check-in.",
  note2: "A valid government-issued ID is required at check-in.",
  note3: "Early check-in and late check-out are subject to availability.",
  note4: "Credit card may be required for incidental charges.",
  phone: "Phone",
  generatedOn: "Generated on",
  currency: "SAR",
};

/* ────────── Default Arabic Labels ────────── */

export const DEFAULT_LABELS_AR: PDFLabels = {
  confirmed: "مؤكد",
  bookingConfirmed: "تم تأكيد حجزك.",
  bookingDetails: "تفاصيل الحجز",
  bookingConfirmationNo: "رقم تأكيد الحجز",
  guestName: "اسم الضيف",
  email: "البريد الإلكتروني",
  stayDetails: "تفاصيل الإقامة",
  checkIn: "تسجيل الوصول",
  checkOut: "تسجيل المغادرة",
  checkInTime: "وقت تسجيل الوصول",
  checkOutTime: "وقت تسجيل المغادرة",
  roomDetails: "تفاصيل الغرفة",
  roomType: "نوع الغرفة",
  noOfRooms: "عدد الغرف",
  hotelRating: "تصنيف الفندق",
  mealServices: "خدمات الوجبات",
  breakfast: "إفطار",
  lunch: "غداء",
  dinner: "عشاء",
  notSelected: "غير محدد",
  priceBreakdown: "تفصيل السعر",
  room: "غرفة",
  totalAmount: "المبلغ الإجمالي",
  paymentStatus: "حالة الدفع",
  paid: "مدفوع",
  importantInfo: "معلومات مهمة",
  note1: "يرجى تقديم هذا التأكيد في مكتب الاستقبال عند تسجيل الوصول.",
  note2: "مطلوب بطاقة هوية صادرة عن جهة حكومية عند تسجيل الوصول.",
  note3: "تسجيل الوصول المبكر والمغادرة المتأخرة يخضعان للتوفر.",
  note4: "قد يُطلب بطاقة ائتمان للرسوم العرضية.",
  phone: "هاتف",
  generatedOn: "تاريخ الإصدار",
  currency: "ر.س",
};

/* ────────── Label Keys (for admin UI iteration) ────────── */

export const LABEL_KEYS: (keyof PDFLabels)[] = Object.keys(
  DEFAULT_LABELS_EN
) as (keyof PDFLabels)[];

/* ────────── Get labels with admin overrides ────────── */

export function getPDFLabels(isArabic: boolean): PDFLabels {
  const defaults = isArabic ? DEFAULT_LABELS_AR : DEFAULT_LABELS_EN;

  if (typeof window === "undefined") return defaults;

  try {
    const stored = localStorage.getItem("admin_pdf_labels");
    if (!stored) return defaults;

    const overrides = JSON.parse(stored) as {
      en?: Partial<PDFLabels>;
      ar?: Partial<PDFLabels>;
    };

    const langOverrides = isArabic ? overrides.ar : overrides.en;
    if (!langOverrides) return defaults;

    return { ...defaults, ...langOverrides };
  } catch {
    return defaults;
  }
}
