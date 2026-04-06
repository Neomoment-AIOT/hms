// ═══════════════════════════════════════════════════════════════
// Odoo HMS API – TypeScript type definitions
// All request/response shapes for the Odoo REST API endpoints
// ═══════════════════════════════════════════════════════════════

// ─── Generic Envelope ──────────────────────────────────────────

export interface OdooSuccessResponse<T = unknown> {
  status: "success";
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface OdooErrorResponse {
  status: "error";
  message: string;
}

export type OdooResponse<T = unknown> = OdooSuccessResponse<T> | OdooErrorResponse;

// ─── Auth ──────────────────────────────────────────────────────

export interface SignUpRequest {
  email?: string;
  mobile?: string;
  password: string;
  name?: string;
}

export interface SignUpResponse {
  status: "success" | "error";
  message: string;
  partner_id?: number;
  email?: string;
}

export interface SignInRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface SignInResponse {
  status: "success" | "error";
  message: string;
  session_token?: string;
  partner_id?: number;
  email?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  old_password: string;
  new_password: string;
}

// ─── Partner / Account ─────────────────────────────────────────

export interface PartnerUpdateRequest {
  partner_id: number;
  name?: string;
  state_id?: number;
  country_id?: number;
  website?: string;
  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
}

export interface PartnerData {
  partner_id: number;
  name: string;
  complete_name?: string;
  state_id: number | null;
  country_id: number | null;
  website: string;
  street: string;
  street2: string;
  zip: string;
  city: string;
}

export interface PartnerResponse {
  status: "success" | "error";
  message?: string;
  partner_data?: PartnerData;
}

export interface CountryState {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  country: string;
  states: CountryState[];
}

export interface CountryStateListResponse {
  status: "success" | "error";
  countries?: Country[];
}

// ─── Hotels ────────────────────────────────────────────────────

export interface HotelListItem {
  id: number;
  name: string;
  logo: string | null;
  review: string;
  star_rating: number;
  starting_price: number;
}

export interface HotelListResponse {
  status: "success" | "error";
  hotels?: HotelListItem[];
}

export interface HotelSearchRequest {
  checkin_date: string;   // YYYY-MM-DD
  checkout_date: string;  // YYYY-MM-DD
  room_count: number;
  adult_count: number;
}

export interface RoomTypeInfo {
  id: number;
  type: string;
  pax: number;
  room_count: number;
}

export interface HotelDetail {
  id: number;
  name: string;
  age_threshold: number;
  phone: string;
  email: string;
  website: string;
  title: string;
  star_rating: number;
  kaaba_view: boolean;
  description: string;
  location: string;
  discount: number;
  review: string;
  total_available_rooms: number;
  min_pay: number;
  payment: number;
  amount_payment: boolean;
  percent_payment: boolean;
  logo: string | null;
  starting_price: number;
  room_types: RoomTypeInfo[];
}

export interface HotelSearchResponse {
  status: "success" | "error";
  hotels?: HotelDetail[];
  services?: unknown[];
  meals?: unknown[];
}

// ─── Room Availability ─────────────────────────────────────────

export interface RoomAvailabilityRequest {
  hotel_id: number;          // 0 for all hotels
  check_in_date: string;     // YYYY-MM-DD
  check_out_date: string;    // YYYY-MM-DD
  person_count: number;
  room_count: number;
}

export interface RoomAvailabilityData {
  hotel_id: number;
  age_threshold: number;
  room_types: RoomTypeInfo[];
}

export interface RoomAvailabilityResponse {
  status: "success" | "error";
  data?: RoomAvailabilityData[];
}

export interface RoomAvailabilityMultipleOption {
  adults: number;
  children: number;
}

export interface RoomAvailabilityMultipleRequest {
  hotel_id: number;
  person_id?: number;
  person_email?: string;
  check_in_date: string;
  check_out_date: string;
  options: RoomAvailabilityMultipleOption[];
}

// ─── Room Rates ────────────────────────────────────────────────

export interface RoomRatesRequest {
  room_type_id: number;
  total_person_count: number;
  total_child_count: number;
  check_in_date: string;
  check_out_date: string;
}

export interface RateDetail {
  id: number;
  pax_1: number;
  pax_2: number;
  pax_3: number;
  pax_4: number;
  pax_5: number;
  pax_6: number;
  price: { adult: number; child: number };
}

export interface RoomRatesResponse {
  status: "success" | "error";
  rates?: RateDetail[];
}

// ─── Bookings ──────────────────────────────────────────────────

export interface CustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  contact?: string;
}

export interface RoomBookingItem {
  room_type_id: number;
  pax: number;
  adults: number;
  children: number;
}

export interface ConfirmBookingRequest {
  check_in_date: string;
  check_out_date: string;
  hotel_id: number;
  customer_details: CustomerDetails;
  rooms: RoomBookingItem[];
  services?: unknown[];
  reference_number?: string;
  payment_details?: Record<string, unknown>;
  reference_booking?: string;
  additional_notes?: string;
  special_request?: string;
}

export interface RetrieveBookingRequest {
  partner_email?: string;
  partner_id?: number;
}

export interface BookingData {
  id: number;
  name: string;
  state: string;
  check_in: string;
  check_out: string;
  hotel_id: number;
  hotel_name: string;
  room_type: string;
  adults: number;
  children: number;
  total_amount: number;
  [key: string]: unknown;
}

export interface RetrieveBookingResponse {
  status: "success" | "error";
  group_bookings_data?: unknown[];
  bookings_data?: BookingData[];
}

export interface CancelBookingRequest {
  booking_id: number;
}

// ─── Payments ──────────────────────────────────────────────────

export interface UpdatePaymentRequest {
  payment_id: number;
  booking_id: number;
  payment_type?: string;
  payment_status: string;
}

export interface UpdatePaymentResponse {
  status: "success" | "error";
  message?: string;
}

// ─── BFF Envelope (Next.js → Client) ──────────────────────────

export interface ApiSuccess<T = unknown> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  status?: number;
}

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiError;
