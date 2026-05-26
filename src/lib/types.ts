export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  collection: string;
  description: string;
  price: number; // minor units
  currency: string;
  cover_accent: string;
  pages: number;
  pdf_filename: string | null;
  published: number;
  sort_order: number;
  created_at: string;
};

export type Order = {
  id: string;
  email: string;
  status: "pending" | "paid" | "cancelled";
  total: number;
  currency: string;
  discount_code: string | null;
  stripe_session_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  price: number;
};

export type DownloadGrant = {
  token: string;
  order_id: string;
  product_id: string;
  download_count: number;
  created_at: string;
};

export type CartLine = { slug: string; quantity: number };
