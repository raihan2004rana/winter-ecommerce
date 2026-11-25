export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  birthdate?: string;
  gender_preference?: "all" | "men" | "women";
  preferred_currency: "USD" | "EUR" | "GBP" | "CAD";
  preferred_locale: string;
  role: "customer" | "staff" | "admin" | "super_admin";
  membership_tier: string;
  newsletter_subscribed: boolean;
  newsletter_frequency: "weekly" | "monthly" | "drops_only";
  notify_drops: boolean;
  notify_sales: boolean;
  notify_orders: boolean;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  title: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country_code: string;
  phone: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at: string;
}

export interface CustomerOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_slug: string;
  product_title: string;
  variant_sku?: string;
  size: string;
  color_name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "paid" | "pending" | "authorized" | "failed";
  currency: "USD" | "EUR" | "GBP" | "CAD";
  subtotal_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  shipping_carrier: string;
  tracking_number: string;
  tracking_url?: string;
  estimated_delivery?: string;
  created_at: string;
  items: CustomerOrderItem[];
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
  }>;
}

export interface CustomerReview {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  product_slug: string;
  rating: number;
  fit_feedback: "runs_small" | "true_to_size" | "runs_large";
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}
