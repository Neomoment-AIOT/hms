# HMS — Missing Odoo API Endpoints

> **For:** Odoo Backend Developer
> **From:** Frontend Team (Next.js)
> **Date:** April 6, 2026
> **Status:** These APIs are required to complete the hotel management website. The Next.js frontend proxy routes and page integrations are already built and waiting for these endpoints.

---

## Table of Contents

1. [API #1 — Hotel Detail (Enhanced)](#api-1--hotel-detail-enhanced)
2. [API #2 — Hotel Amenities](#api-2--hotel-amenities)
3. [API #3 — Hotel Reviews (Read)](#api-3--hotel-reviews-read)
4. [API #4 — Hotel Reviews (Submit)](#api-4--hotel-reviews-submit)
5. [API #5 — Hotel Services & Meal Pricing](#api-5--hotel-services--meal-pricing)
6. [API #6 — Hotel Photo Gallery](#api-6--hotel-photo-gallery)
7. [API #7 — Homepage Banner Content](#api-7--homepage-banner-content)
8. [API #8 — Homepage Banner Update (Admin)](#api-8--homepage-banner-update-admin)
9. [API #9 — Featured Offers / Special Hotels](#api-9--featured-offers--special-hotels)
10. [API #10 — Featured Offers Update (Admin)](#api-10--featured-offers-update-admin)
11. [API #11 — Blog Posts (List)](#api-11--blog-posts-list)
12. [API #12 — Blog Post (Single)](#api-12--blog-post-single)
13. [API #13 — Blog Post Create/Update (Admin)](#api-13--blog-post-createupdate-admin)
14. [API #14 — Global Reviews (Read)](#api-14--global-reviews-read)
15. [API #15 — Global Reviews Update (Admin)](#api-15--global-reviews-update-admin)
16. [API #16 — Hotels List (Full Detail for Filter Page)](#api-16--hotels-list-full-detail-for-filter-page)
17. [API #17 — Session Verify](#api-17--session-verify)
18. [API #18 — Session Logout](#api-18--session-logout)
19. [Priority Summary](#priority-summary)

---

## Existing APIs (Already Working)

These Odoo APIs are already built and integrated in the frontend:

| # | Endpoint | Method | Status |
|---|----------|--------|--------|
| 1 | `/api/signup` | POST | ✅ Working |
| 2 | `/api/signin` | POST | ✅ Working |
| 3 | `/api/forget_password` | POST | ✅ Working |
| 4 | `/api/change_contact_password` | POST | ✅ Working |
| 5 | `/api/hotels/list` | POST | ✅ Working |
| 6 | `/api/hotels` | POST | ✅ Working |
| 7 | `/api/hotel/<hotel_id>` | POST | ✅ Working |
| 8 | `/api/room_availability` | POST | ✅ Working |
| 9 | `/api/room_availability_multiple` | POST | ✅ Working |
| 10 | `/api/room_rates` | POST | ✅ Working |
| 11 | `/api/confirm_room_availability` | POST | ✅ Working |
| 12 | `/api/retrieve_room_booking` | POST | ✅ Working |
| 13 | `/api/cancel_room_booking` | POST | ✅ Working |
| 14 | `/api/update_room_payment` | POST | ✅ Working |
| 15 | `/api/get/partner` | GET | ✅ Working |
| 16 | `/api/update_contact_data` | POST | ✅ Working |
| 17 | `/api/country/state/list` | GET | ✅ Working |
| 18 | `/generate/bookings_pdf` | GET | ✅ Working |

---

## Missing APIs — Detailed Specifications

---

### API #1 — Hotel Detail (Enhanced)

> **Priority: 🔴 HIGH**
> **Used on:** Hotel Detail page, Guest Detail page, Payment Success page
> **Problem:** Currently the hotel name, address, phone, and rating are hardcoded as "Raffah-2" everywhere in the booking flow

**Option A (Recommended):** Enhance the existing `POST /api/hotel/<hotel_id>` response to include these additional fields. This avoids creating a new endpoint.

**Additional fields needed in existing response:**

```json
{
  "status": "success",
  "hotels": [{
    // ... existing fields (id, name, star_rating, etc.) ...

    // ⬇️ NEW FIELDS NEEDED ⬇️
    "name_ar": "فندق رافة ٢",
    "address_en": "BeAl Aqiq, King Fahd Branch Rd, Riyadh 13515, Saudi Arabia",
    "address_ar": "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية",
    "phone": "+966 920010417",
    "amenities": [
      {
        "id": 1,
        "name_en": "Free Wi-Fi",
        "name_ar": "واي فاي مجاني",
        "icon": "wifi"
      }
    ],
    "services": [
      {
        "id": 10,
        "name_en": "Breakfast",
        "name_ar": "إفطار",
        "price": 120.00,
        "type": "meal",
        "frequency": "daily"
      },
      {
        "id": 11,
        "name_en": "Lunch",
        "name_ar": "غداء",
        "price": 150.00,
        "type": "meal",
        "frequency": "daily"
      },
      {
        "id": 12,
        "name_en": "Dinner",
        "name_ar": "عشاء",
        "price": 100.00,
        "type": "meal",
        "frequency": "daily"
      },
      {
        "id": 20,
        "name_en": "Laundry",
        "name_ar": "غسيل",
        "price": 50.00,
        "type": "service",
        "frequency": "one_time"
      }
    ],
    "gallery": [
      {
        "url": "https://odoo-server.com/web/image/hotel.gallery/1/image",
        "caption_en": "Lobby",
        "caption_ar": "اللوبي",
        "order": 1
      }
    ]
  }]
}
```

**Why needed:** The booking flow pages (Guest Detail, Payment Success) display hotel name, address, phone, and rating. Currently these are all hardcoded to "Raffah-2". The `amenities`, `services` (meal prices), and `gallery` fields allow removing 3 more hardcoded data sources.

---

### API #2 — Hotel Amenities

> **Priority: 🔴 HIGH**
> **Used on:** Hotel Detail page — Amenities tab
> **Problem:** 8 amenities are hardcoded with static content

**Endpoint:** `GET /api/hotel/<hotel_id>/amenities`
**Auth:** `public`
**Request:** None (hotel_id in URL)

**Response:**
```json
{
  "status": "success",
  "amenities": [
    {
      "id": 1,
      "name_en": "Wi-Fi",
      "name_ar": "واي فاي",
      "icon": "wifi",
      "description_en": "Complimentary high-speed wireless internet available in all rooms and public areas",
      "description_ar": "إنترنت لاسلكي مجاني عالي السرعة متوفر في جميع الغرف والمناطق العامة",
      "is_free": true
    },
    {
      "id": 2,
      "name_en": "Front Desk",
      "name_ar": "مكتب الاستقبال",
      "icon": "concierge",
      "description_en": "24-hour front desk service",
      "description_ar": "خدمة استقبال على مدار الساعة",
      "is_free": true
    },
    {
      "id": 3,
      "name_en": "Breakfast",
      "name_ar": "إفطار",
      "icon": "restaurant",
      "description_en": "Buffet breakfast available daily",
      "description_ar": "بوفيه إفطار متوفر يومياً",
      "is_free": false,
      "extra_charge": 120.00
    }
  ]
}
```

**Note:** If easier, include `amenities` array in the existing `POST /api/hotel/<hotel_id>` response (see API #1 Option A).

---

### API #3 — Hotel Reviews (Read)

> **Priority: 🟡 MEDIUM**
> **Used on:** Hotel Detail page — Reviews tab, About page
> **Problem:** Reviews are stored in browser localStorage, lost on cache clear

**Endpoint:** `GET /api/hotel/<hotel_id>/reviews`
**Auth:** `public`
**Request:** None (hotel_id in URL)

**Response:**
```json
{
  "status": "success",
  "overall_score": 8.9,
  "total_reviews": 128,
  "category_ratings": [
    { "label_en": "Location", "label_ar": "الموقع", "score": 9.4 },
    { "label_en": "Cleanliness", "label_ar": "النظافة", "score": 8.7 },
    { "label_en": "Value for Money", "label_ar": "القيمة مقابل المال", "score": 8.2 },
    { "label_en": "Comfort", "label_ar": "الراحة", "score": 8.5 },
    { "label_en": "Staff", "label_ar": "الموظفون", "score": 9.1 },
    { "label_en": "Facilities", "label_ar": "المرافق", "score": 8.0 }
  ],
  "reviews": [
    {
      "id": 1,
      "author_name": "Sami",
      "author_initial": "S",
      "date": "2025-01-12",
      "stay_type_en": "Couple",
      "stay_type_ar": "زوجين",
      "score": 9.0,
      "text_en": "The hotel had an amazing view of the Kaaba...",
      "text_ar": "كان الفندق يتمتع بإطلالة رائعة على الكعبة..."
    }
  ]
}
```

---

### API #4 — Hotel Reviews (Submit)

> **Priority: 🟡 MEDIUM**
> **Used on:** Hotel Detail page — after checkout
> **Problem:** No way for guests to submit reviews

**Endpoint:** `POST /api/hotel/<hotel_id>/reviews`
**Auth:** `public` (with partner_id)

**Request:**
```json
{
  "partner_id": 42,
  "score": 9.0,
  "stay_type": "couple",
  "text_en": "Great stay, loved the view!",
  "text_ar": "إقامة رائعة، أحببت الإطلالة!"
}
```

**Response:**
```json
{
  "status": "success",
  "review_id": 156,
  "message": "Review submitted successfully"
}
```

---

### API #5 — Hotel Services & Meal Pricing

> **Priority: 🔴 HIGH**
> **Used on:** Guest Detail page (meal selection), Payment Success page
> **Problem:** Meal prices are hardcoded: breakfast=120, lunch=150, dinner=100

**Endpoint:** `GET /api/hotel/<hotel_id>/services`
**Auth:** `public`
**Request:** None (hotel_id in URL)

**Response:**
```json
{
  "status": "success",
  "services": [
    {
      "id": 10,
      "name_en": "Breakfast",
      "name_ar": "إفطار",
      "price": 120.00,
      "currency": "SAR",
      "type": "meal",
      "frequency": "daily",
      "is_included": false
    },
    {
      "id": 11,
      "name_en": "Lunch",
      "name_ar": "غداء",
      "price": 150.00,
      "currency": "SAR",
      "type": "meal",
      "frequency": "daily",
      "is_included": false
    },
    {
      "id": 12,
      "name_en": "Dinner",
      "name_ar": "عشاء",
      "price": 100.00,
      "currency": "SAR",
      "type": "meal",
      "frequency": "daily",
      "is_included": false
    },
    {
      "id": 20,
      "name_en": "Airport Transfer",
      "name_ar": "نقل من المطار",
      "price": 200.00,
      "currency": "SAR",
      "type": "service",
      "frequency": "one_time",
      "is_included": false
    },
    {
      "id": 21,
      "name_en": "Laundry",
      "name_ar": "غسيل الملابس",
      "price": 50.00,
      "currency": "SAR",
      "type": "service",
      "frequency": "per_use",
      "is_included": false
    }
  ]
}
```

**Note:** The `hotel.service` and `meal.code` models already exist in Odoo. This API just needs to expose them via a public REST endpoint.

---

### API #6 — Hotel Photo Gallery

> **Priority: 🟡 MEDIUM**
> **Used on:** Hotel Detail page — Gallery section
> **Problem:** Hotel images are hardcoded or stored in localStorage as base64

**Endpoint:** `GET /api/hotel/<hotel_id>/gallery`
**Auth:** `public`
**Request:** None (hotel_id in URL)

**Response:**
```json
{
  "status": "success",
  "images": [
    {
      "id": 1,
      "url": "https://odoo-server.com/web/image/hotel.gallery/1/image",
      "thumbnail_url": "https://odoo-server.com/web/image/hotel.gallery/1/image?width=300",
      "caption_en": "Hotel Lobby",
      "caption_ar": "لوبي الفندق",
      "order": 1,
      "category": "lobby"
    },
    {
      "id": 2,
      "url": "https://odoo-server.com/web/image/hotel.gallery/2/image",
      "thumbnail_url": "https://odoo-server.com/web/image/hotel.gallery/2/image?width=300",
      "caption_en": "Deluxe Room",
      "caption_ar": "غرفة ديلوكس",
      "order": 2,
      "category": "room"
    }
  ]
}
```

---

### API #7 — Homepage Banner Content

> **Priority: 🟡 MEDIUM**
> **Used on:** Homepage — hero banner section
> **Problem:** Banner media (image/video/carousel) is stored in browser localStorage as base64. Data lost on cache clear.

**Endpoint:** `GET /api/cms/banner`
**Auth:** `public`

**Response:**
```json
{
  "status": "success",
  "banner": {
    "media_type": "image",
    "image_url": "https://odoo-server.com/web/image/cms.banner/1/image",
    "video_url": null,
    "carousel_items": [],
    "carousel_interval": 5000,
    "title_en": "Book Your Hotel With Ease Today.",
    "title_ar": "احجز فندقك بسهولة اليوم.",
    "subtitle_en": "Let us help you find the perfect stay for your Hajj and Umrah journey.",
    "subtitle_ar": "دعنا نساعدك في العثور على الإقامة المثالية لرحلة حجك وعمرتك."
  }
}
```

**`media_type` values:** `"image"` | `"video"` | `"carousel"`

---

### API #8 — Homepage Banner Update (Admin)

> **Priority: 🟡 MEDIUM**
> **Used on:** Admin panel — Banner management page

**Endpoint:** `POST /api/cms/banner`
**Auth:** `user` (admin only)

**Request:**
```json
{
  "media_type": "carousel",
  "image_url": "https://...",
  "video_url": null,
  "carousel_items": [
    { "type": "image", "url": "https://..." },
    { "type": "image", "url": "https://..." }
  ],
  "carousel_interval": 5000,
  "title_en": "Book Your Hotel With Ease Today.",
  "title_ar": "احجز فندقك بسهولة اليوم.",
  "subtitle_en": "Let us help you find the perfect stay.",
  "subtitle_ar": "دعنا نساعدك في العثور على الإقامة المثالية."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Banner updated successfully"
}
```

**Note:** For image/video uploads, the frontend will send base64-encoded data or use a separate upload endpoint. An `POST /api/cms/upload` endpoint for file uploads would be ideal — returns a URL that can be referenced in the banner config.

---

### API #9 — Featured Offers / Special Hotels

> **Priority: 🟡 MEDIUM**
> **Used on:** Homepage — "Hotels selected for you" section
> **Problem:** Featured hotels list is stored in browser localStorage

**Endpoint:** `GET /api/cms/offers`
**Auth:** `public`

**Response:**
```json
{
  "status": "success",
  "offers": [
    {
      "id": 1,
      "hotel_id": 36,
      "name_en": "Kudi Tower",
      "name_ar": "كدي تاور",
      "price": 250.00,
      "original_price": 300.00,
      "discount_percent": 17,
      "image_url": "https://odoo-server.com/web/image/hotel.offer/1/image",
      "order": 1,
      "is_active": true
    }
  ]
}
```

---

### API #10 — Featured Offers Update (Admin)

> **Priority: 🟡 MEDIUM**
> **Used on:** Admin panel — Offers management page

**Endpoint:** `POST /api/cms/offers`
**Auth:** `user` (admin only)

**Request:**
```json
{
  "offers": [
    {
      "hotel_id": 36,
      "name_en": "Kudi Tower",
      "name_ar": "كدي تاور",
      "price": 250.00,
      "image_url": "https://...",
      "order": 1
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Offers updated successfully"
}
```

---

### API #11 — Blog Posts (List)

> **Priority: 🟡 MEDIUM**
> **Used on:** Blog listing page (`/blog`)
> **Problem:** Blog posts stored in browser localStorage

**Endpoint:** `GET /api/cms/blogs`
**Auth:** `public`

**Response:**
```json
{
  "status": "success",
  "blogs": [
    {
      "id": 1,
      "slug": "5-tips-to-find-the-best-hotels-in-makkah",
      "title_en": "5 Tips to find the best hotels in Makkah",
      "title_ar": "5 نصائح للعثور على أفضل الفنادق في مكة",
      "description_en": "Finding the best hotels in Makkah requires careful planning...",
      "description_ar": "يتطلب العثور على أفضل الفنادق في مكة تخطيطاً دقيقاً...",
      "image_url": "https://odoo-server.com/web/image/cms.blog/1/image",
      "date": "2025-10-12",
      "reading_time": "5 min",
      "comment_count": 12,
      "author": "Admin",
      "is_published": true
    }
  ]
}
```

---

### API #12 — Blog Post (Single)

> **Priority: 🟡 MEDIUM**
> **Used on:** Blog detail page (`/blog/[slug]`)

**Endpoint:** `GET /api/cms/blogs/<slug>`
**Auth:** `public`

**Response:**
```json
{
  "status": "success",
  "blog": {
    "id": 1,
    "slug": "5-tips-to-find-the-best-hotels-in-makkah",
    "title_en": "5 Tips to find the best hotels in Makkah",
    "title_ar": "5 نصائح للعثور على أفضل الفنادق في مكة",
    "content_en": "<div class='space-y-12'><h2>Tip #1: Book Early</h2><p>...</p></div>",
    "content_ar": "<div class='space-y-12 font-arabic' dir='rtl'><h2>النصيحة #1: احجز مبكراً</h2><p>...</p></div>",
    "image_url": "https://...",
    "date": "2025-10-12",
    "reading_time": "5 min",
    "author": "Admin",
    "comments": [
      {
        "id": 1,
        "author": "Ahmed",
        "text": "Great article!",
        "date": "2025-10-15"
      }
    ]
  }
}
```

---

### API #13 — Blog Post Create/Update (Admin)

> **Priority: 🟡 MEDIUM**
> **Used on:** Admin panel — Blog management page

**Endpoint:** `POST /api/cms/blogs`
**Auth:** `user` (admin only)

**Request:**
```json
{
  "slug": "new-blog-post",
  "title_en": "New Blog Post",
  "title_ar": "منشور مدونة جديد",
  "description_en": "Short description...",
  "description_ar": "وصف قصير...",
  "content_en": "<div>Full HTML content</div>",
  "content_ar": "<div dir='rtl'>محتوى HTML كامل</div>",
  "image_url": "https://...",
  "date": "2026-04-06",
  "is_published": true
}
```

**Response:**
```json
{
  "status": "success",
  "blog_id": 5,
  "message": "Blog post created successfully"
}
```

---

### API #14 — Global Reviews (Read)

> **Priority: 🟡 MEDIUM**
> **Used on:** About page — guest reviews section
> **Problem:** Reviews stored in browser localStorage

**Endpoint:** `GET /api/cms/reviews`
**Auth:** `public`

**Response:**
```json
{
  "status": "success",
  "overall_score": 8.9,
  "total_reviews": 128,
  "reviews": [
    {
      "id": 1,
      "author_name": "Sami",
      "author_initial": "S",
      "initial_bg_color": "#7c3aed",
      "date": "2025-01-12",
      "stay_type_en": "Couple",
      "stay_type_ar": "زوجين",
      "score": 9.0,
      "text_en": "The hotel had an amazing view of the Kaaba. The staff was incredibly helpful and made our Umrah journey comfortable.",
      "text_ar": "كان الفندق يتمتع بإطلالة رائعة على الكعبة. كان الموظفون متعاونين بشكل لا يصدق وجعلوا رحلة العمرة مريحة."
    }
  ]
}
```

---

### API #15 — Global Reviews Update (Admin)

> **Priority: 🟡 MEDIUM**
> **Used on:** Admin panel — Reviews management page

**Endpoint:** `POST /api/cms/reviews`
**Auth:** `user` (admin only)

**Request:**
```json
{
  "reviews": [
    {
      "author_name": "Sami",
      "author_initial": "S",
      "initial_bg_color": "#7c3aed",
      "date": "2025-01-12",
      "stay_type_en": "Couple",
      "stay_type_ar": "زوجين",
      "score": 9.0,
      "text_en": "Amazing view...",
      "text_ar": "إطلالة رائعة..."
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Reviews updated successfully"
}
```

---

### API #16 — Hotels List (Full Detail for Filter Page)

> **Priority: 🔴 HIGH**
> **Used on:** Hotel Filter page (`/Hotel_Filter`)
> **Problem:** 14 hotels with full properties (rating, reviews, location, rooms, propertyView, guestRating, roomTypes) are hardcoded in `Hotel_Data.ts`

**Current existing API `POST /api/hotels` returns most of this data.** However it requires `checkin_date` and `checkout_date`. We need either:

**Option A (Recommended):** Make the date parameters optional in `POST /api/hotels`. When dates are omitted, return all hotels without availability filtering.

**Option B:** Create a new `GET /api/hotels/all` endpoint that returns all hotels with these fields:

**Response:**
```json
{
  "status": "success",
  "hotels": [
    {
      "id": 36,
      "name": "Kudi Tower",
      "name_ar": "كدي تاور",
      "logo": "base64_png_string",
      "starting_price": 250.00,
      "star_rating": 3.9,
      "review_count": 9,
      "review_label": "Very Good",
      "location": "Makkah, Saudi Arabia",
      "total_rooms": 33,
      "kaaba_view": true,
      "property_view": "fullKaaba",
      "guest_rating": "excellent",
      "room_types": [
        { "id": 1, "type": "deluxe" },
        { "id": 2, "type": "double" },
        { "id": 3, "type": "familySuite" }
      ],
      "is_active": true
    }
  ]
}
```

**Fields the frontend needs for filtering:**
- `property_view`: `"fullKaaba"` | `"partialKaaba"` | `"noView"` — used for property view filter
- `guest_rating`: `"excellent"` | `"veryGood"` | `"good"` | `"average"` — used for guest rating filter
- `room_types`: array of room type slugs — used for room type filter
- `star_rating`: float — used for star rating filter
- `starting_price`: float — used for price range filter

---

### API #17 — Session Verify

> **Priority: 🟢 LOW**
> **Used on:** App startup — check if session is still valid

**Endpoint:** `POST /api/auth/verify_session`
**Auth:** `public`

**Request:**
```json
{
  "session_token": "abc123xyz..."
}
```

**Response (valid):**
```json
{
  "status": "success",
  "valid": true,
  "partner_id": 42,
  "email": "user@example.com"
}
```

**Response (expired):**
```json
{
  "status": "success",
  "valid": false
}
```

---

### API #18 — Session Logout

> **Priority: 🟢 LOW**
> **Used on:** Sign out action — destroy session on server

**Endpoint:** `POST /api/auth/logout`
**Auth:** `public`

**Request:**
```json
{
  "session_token": "abc123xyz..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Session destroyed"
}
```

---

## Priority Summary

### 🔴 HIGH — Blocks core booking flow

| # | API | Why Critical |
|---|-----|-------------|
| 1 | Enhanced Hotel Detail (name_ar, address, phone, amenities, services, gallery) | Hardcoded "Raffah-2" everywhere |
| 2 | Hotel Amenities | Hardcoded 8 amenities on hotel page |
| 5 | Hotel Services & Meal Pricing | Hardcoded breakfast=120, lunch=150, dinner=100 |
| 16 | Hotels List (Full Detail) | 14 hotels hardcoded in Hotel_Data.ts |

### 🟡 MEDIUM — CMS content management

| # | API | Why Needed |
|---|-----|-----------|
| 3 | Hotel Reviews (Read) | Reviews in localStorage, lost on cache clear |
| 4 | Hotel Reviews (Submit) | Guests can't submit reviews |
| 6 | Hotel Photo Gallery | Hotel images hardcoded/localStorage |
| 7-8 | Homepage Banner (Read/Write) | Banner stored in localStorage as base64 |
| 9-10 | Featured Offers (Read/Write) | Offers stored in localStorage |
| 11-13 | Blog Posts (List/Single/Admin) | Blogs stored in localStorage |
| 14-15 | Global Reviews (Read/Write) | About page reviews in localStorage |

### 🟢 LOW — Nice to have

| # | API | Why Needed |
|---|-----|-----------|
| 17 | Session Verify | Check if user still logged in on app load |
| 18 | Session Logout | Server-side session destruction |

---

## Implementation Notes for Odoo Developer

### General Conventions
- All endpoints should return `{"status": "success", ...}` or `{"status": "error", "message": "..."}`
- All public endpoints use `auth='public'` with `csrf=False`
- Admin endpoints use `auth='user'`
- All text fields should have `_en` and `_ar` variants for bilingual support
- Image fields should return full URLs (not base64) for gallery/banner images
- Date fields should use `YYYY-MM-DD` format

### Existing Models to Leverage
- `hotel.amenity` → for API #2 (amenities already exist as a model)
- `hotel.service` → for API #5 (services already exist as a model)
- `meal.code` → for API #5 (meal pricing already exists)
- `res.company` → for API #1 (hotel details — address, phone, etc.)

### Suggested New Models
- `cms.banner` → Singleton model for homepage banner config
- `cms.blog` → Blog posts with slug, bilingual content, image
- `cms.review` → Global guest reviews (not hotel-specific)
- `cms.offer` → Featured hotel offers for homepage
- `hotel.gallery` → Hotel photo gallery images

### Quick Win
If creating all these endpoints at once is too much, the **highest value change** is enhancing the existing `POST /api/hotel/<hotel_id>` to include `name_ar`, `address_en`, `address_ar`, `phone`, `amenities[]`, and `services[]` (with meal prices). This single change unblocks the entire booking flow from using hardcoded data.

---

## Contact

**Frontend Developer:** Uses Next.js 16 + TypeScript
**API Base URL:** Set via `ODOO_URL` environment variable
**Frontend repo:** `hms` (branch: `dev`)
**This document:** `docs/MISSING_ODOO_APIS.md`
