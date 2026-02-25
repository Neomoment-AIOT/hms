import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { PDFLabels } from "./pdfLabels";

/* ────────── Types ────────── */

export type BookingPDFData = {
  bookingRef: string;
  guestName: string;
  email: string;
  roomName: string;
  roomCount: number;
  checkIn: string;
  checkOut: string;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  rating: string;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  mealPrices: { breakfast: number; lunch: number; dinner: number };
  roomPrice: number;
  totalAmount: number;
  isArabic?: boolean;
  labels: PDFLabels;
};

/* ────────── HTML template builder ────────── */

function buildHTML(data: BookingPDFData): string {
  const { labels: L, isArabic } = data;
  const dir = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";
  const fontFamily = isArabic
    ? "'Cairo', 'Segoe UI', Tahoma, sans-serif"
    : "'Segoe UI', Tahoma, Geneva, sans-serif";

  const mealNames = ["breakfast", "lunch", "dinner"] as const;
  const mealLabels = { breakfast: L.breakfast, lunch: L.lunch, dinner: L.dinner };

  const mealTotal = mealNames.reduce(
    (sum, m) => sum + (data.meals[m] ? data.mealPrices[m] : 0),
    0
  );

  const row = (label: string, value: string) => `
    <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #e6e6e6;">
      <span style="color:#646464;font-size:9px;">${label}</span>
      <span style="font-weight:bold;font-size:9px;">${value}</span>
    </div>`;

  const sectionHeader = (title: string) => `
    <div style="background:#008864;color:#fff;padding:3px 10px;border-radius:3px;font-weight:bold;font-size:9px;margin-top:6px;">
      ${title}
    </div>`;

  const dateLocale = isArabic ? "ar-SA" : "en-GB";

  // A4 at 72 DPI = 595 x 842. We use 595px width and cap at 842px height.
  return `
<div id="pdf-content" style="
  width:595px;
  height:842px;
  font-family:${fontFamily};
  direction:${dir};
  text-align:${align};
  color:#000;
  background:#fff;
  padding:0;
  margin:0;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  overflow:hidden;
">
  <!-- HEADER -->
  <div style="background:#005840;color:#fff;padding:10px 20px;">
    <div style="font-size:16px;font-weight:bold;">${data.hotelName}</div>
    <div style="font-size:8px;margin-top:2px;">${data.hotelAddress}</div>
    <div style="font-size:8px;margin-top:1px;">${L.phone}: ${data.hotelPhone}</div>
  </div>

  <div style="padding:10px 20px;flex:1;">
    <!-- CONFIRMED BADGE -->
    <div style="background:#e8f5e9;border-radius:4px;padding:6px;text-align:center;margin-bottom:8px;">
      <div style="font-size:14px;font-weight:bold;color:#388e3c;">${L.confirmed}</div>
      <div style="font-size:8px;color:#646464;margin-top:2px;">${L.bookingConfirmed}</div>
    </div>

    <!-- BOOKING DETAILS -->
    ${sectionHeader(L.bookingDetails)}
    <div style="padding:1px 0;">
      ${row(L.bookingConfirmationNo, data.bookingRef)}
      ${row(L.guestName, data.guestName)}
      ${row(L.email, data.email)}
    </div>

    <!-- STAY DETAILS -->
    ${sectionHeader(L.stayDetails)}
    <div style="padding:1px 0;">
      ${row(L.checkIn, data.checkIn)}
      ${row(L.checkOut, data.checkOut)}
      ${row(L.checkInTime, isArabic ? "من 2:00 مساءً" : "From 2:00 PM")}
      ${row(L.checkOutTime, isArabic ? "11:30 صباحًا - 12:00 مساءً" : "11:30 AM - 12:00 PM")}
    </div>

    <!-- ROOM DETAILS -->
    ${sectionHeader(L.roomDetails)}
    <div style="padding:1px 0;">
      ${row(L.roomType, data.roomName)}
      ${row(L.noOfRooms, String(data.roomCount))}
      ${row(L.hotelRating, data.rating)}
    </div>

    <!-- MEAL SERVICES -->
    ${sectionHeader(L.mealServices)}
    <div style="padding:1px 0;">
      ${mealNames
        .map((meal) => {
          const selected = data.meals[meal];
          const price = selected ? data.mealPrices[meal] : 0;
          const value = selected
            ? `${L.currency} ${price.toFixed(2)}`
            : L.notSelected;
          return row(mealLabels[meal], value);
        })
        .join("")}
    </div>

    <!-- PRICE BREAKDOWN -->
    ${sectionHeader(L.priceBreakdown)}
    <div style="padding:1px 0;">
      ${row(
        `${L.room} (${data.roomName} x${data.roomCount})`,
        `${L.currency} ${data.roomPrice.toFixed(2)}`
      )}
      ${row(L.mealServices, `${L.currency} ${mealTotal.toFixed(2)}`)}
    </div>

    <!-- TOTAL BOX -->
    <div style="background:#e8f5e9;border-radius:3px;padding:6px 10px;display:flex;justify-content:space-between;font-weight:bold;font-size:11px;color:#005840;margin-top:5px;">
      <span>${L.totalAmount}</span>
      <span>${L.currency} ${data.totalAmount.toFixed(2)}</span>
    </div>

    <!-- PAYMENT STATUS -->
    <div style="background:#e8f5e9;border-radius:3px;padding:4px;text-align:center;margin-top:4px;">
      <span style="font-weight:bold;color:#388e3c;font-size:9px;">${L.paymentStatus}: ${L.paid}</span>
    </div>

    <!-- IMPORTANT INFO -->
    <div style="margin-top:8px;">
      <div style="font-weight:bold;font-size:8px;margin-bottom:3px;">${L.importantInfo}</div>
      <div style="font-size:7px;color:#646464;line-height:1.4;">
        <div>&#8226; ${L.note1}</div>
        <div>&#8226; ${L.note2}</div>
        <div>&#8226; ${L.note3}</div>
        <div>&#8226; ${L.note4}</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#005840;color:#fff;padding:6px 20px;text-align:center;font-size:7px;">
    ${data.hotelName}  |  ${data.hotelPhone}  |  ${L.generatedOn} ${new Date().toLocaleDateString(dateLocale)}
  </div>
</div>`;
}

/* ────────── Main generator ────────── */

export async function generateBookingPDF(data: BookingPDFData) {
  // Load Cairo font for Arabic if needed
  if (data.isArabic) {
    const existingLink = document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=Cairo"]'
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    // Wait for font to load
    await document.fonts.ready;
  }

  // Create temp container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.zIndex = "-1";
  container.innerHTML = buildHTML(data);
  document.body.appendChild(container);

  const el = container.querySelector("#pdf-content") as HTMLElement;

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: 595,
      height: 842,
      windowWidth: 595,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfH = pdf.internal.pageSize.getHeight(); // 297mm

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);

    pdf.save(`Booking_Confirmation_${data.bookingRef}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
