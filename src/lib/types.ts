export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Hot' | 'Fiery';
export type DietaryType = 'veg' | 'non-veg';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  weight: string; // "250g" | "500g" | "1kg"
  price: number;
  mrp: number;
  stock_quantity: number;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number; // base price (usually 250g or 500g)
  mrp: number;
  discount_percent: number;
  weight: string; // default variant
  stock_quantity: number;
  sku: string;
  spice_level: SpiceLevel;
  dietary: DietaryType;
  shelf_life: string;
  storage_instructions: string;
  ingredients: string[];
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  variants: ProductVariant[];
  created_at: string;
}

export interface CartItem {
  id: string; // composite cart item id (e.g. productId-variantId)
  product_id: string;
  variant_id?: string;
  product_name: string;
  slug: string;
  image: string;
  weight: string;
  price: number;
  mrp: number;
  quantity: number;
  max_stock: number;
  dietary: DietaryType;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  image: string;
  variant_weight: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon_code?: string;
  shipping_fee: number;
  tax: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  order_status: OrderStatus;
  timeline: OrderTimelineItem[];
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  expiry_date: string;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  product_name?: string;
  user_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string;
  status: 'Active' | 'Inactive';
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  store_email: string;
  store_phone: string;
  whatsapp_number: string;
  fssai_number: string;
  gst_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  razorpay_key_id: string;
  is_razorpay_live: boolean;
  enable_cod: boolean;
}

export type FlashUpdateTheme = 'crimson' | 'amber' | 'emerald' | 'gold' | 'dark';
export type FlashDisplayMode = 'slide' | 'marquee';
export type MarqueeDirection = 'ltr' | 'rtl';

export interface FlashUpdate {
  id: string;
  badge: string;
  message: string;
  link_url?: string;
  link_text?: string;
  theme: FlashUpdateTheme;
  is_active: boolean;
  priority?: number;
  display_mode?: FlashDisplayMode;
  marquee_direction?: MarqueeDirection;
  countdown_end?: string; // ISO date string e.g. "2026-09-12T23:59:59"
  stock_alert_text?: string; // e.g. "Only 18 Jars Left Today"
  click_count?: number;
  created_at?: string;
  updated_at?: string;
}
