-- Kavyasri Pickles Relational Database Schema (Idempotent)
-- Run this in Supabase SQL Editor or automated connection script

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status_type as enum ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status_type as enum ('Pending', 'Paid', 'Failed', 'Refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type spice_level_type as enum ('Mild', 'Medium', 'Hot', 'Extra Hot', 'Fiery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type dietary_type as enum ('veg', 'non-veg');
exception when duplicate_object then null; end $$;

-- 3. PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role user_role default 'customer'::user_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CATEGORIES
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PRODUCTS
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric(10,2) not null,
  mrp numeric(10,2) not null,
  discount_percent numeric(5,2) default 0,
  weight text not null default '250g',
  stock_quantity integer default 0,
  sku text unique,
  spice_level spice_level_type default 'Hot'::spice_level_type,
  dietary dietary_type default 'veg'::dietary_type,
  shelf_life text default '12 Months',
  storage_instructions text,
  ingredients text[] default '{}',
  images text[] default '{}',
  is_featured boolean default false,
  is_active boolean default true,
  rating numeric(3,2) default 4.8,
  reviews_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PRODUCT VARIANTS
create table if not exists product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  weight text not null,
  price numeric(10,2) not null,
  mrp numeric(10,2) not null,
  stock_quantity integer default 0
);

-- 7. ADDRESSES
create table if not exists addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. ORDERS
create table if not exists orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  coupon_code text,
  shipping_fee numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  total_amount numeric(10,2) not null,
  payment_status payment_status_type default 'Pending'::payment_status_type,
  payment_method text default 'Razorpay UPI',
  razorpay_order_id text,
  razorpay_payment_id text,
  order_status order_status_type default 'Pending'::order_status_type,
  timeline jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ORDER ITEMS
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  image text,
  variant_weight text not null,
  price numeric(10,2) not null,
  quantity integer not null,
  total numeric(10,2) not null
);

-- 10. COUPONS
create table if not exists coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  max_discount numeric(10,2),
  expiry_date date,
  usage_limit integer default 100,
  times_used integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. REVIEWS
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text not null,
  is_approved boolean default false,
  is_verified_purchase boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. STORE SETTINGS
create table if not exists store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table coupons enable row level security;
alter table product_variants enable row level security;
alter table store_settings enable row level security;

-- Public read policies
drop policy if exists "Allow public read for active categories" on categories;
create policy "Allow public read for active categories" on categories for select using (is_active = true);

drop policy if exists "Allow public read for active products" on products;
create policy "Allow public read for active products" on products for select using (is_active = true);

drop policy if exists "Allow public read for approved reviews" on reviews;
create policy "Allow public read for approved reviews" on reviews for select using (is_approved = true);

drop policy if exists "Allow public read for active coupons" on coupons;
create policy "Allow public read for active coupons" on coupons for select using (is_active = true);

drop policy if exists "Allow public read for product variants" on product_variants;
create policy "Allow public read for product variants" on product_variants for select using (true);

drop policy if exists "Allow public read for store settings" on store_settings;
create policy "Allow public read for store settings" on store_settings for select using (true);

drop policy if exists "Allow public read for order items" on order_items;
create policy "Allow public read for order items" on order_items for select using (true);

drop policy if exists "Allow public read for profiles" on profiles;
create policy "Allow public read for profiles" on profiles for select using (true);

drop policy if exists "Allow public insert for profiles" on profiles;
create policy "Allow public insert for profiles" on profiles for insert with check (true);

drop policy if exists "Allow public read for addresses" on addresses;
create policy "Allow public read for addresses" on addresses for select using (true);

drop policy if exists "Allow public insert for addresses" on addresses;
create policy "Allow public insert for addresses" on addresses for insert with check (true);

drop policy if exists "Allow public insert for order items" on order_items;
create policy "Allow public insert for order items" on order_items for insert with check (true);

-- User scoped policies
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own addresses" on addresses;
create policy "Users can view own addresses" on addresses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own addresses" on addresses;
create policy "Users can insert own addresses" on addresses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own addresses" on addresses;
create policy "Users can update own addresses" on addresses for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own addresses" on addresses;
create policy "Users can delete own addresses" on addresses for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);

drop policy if exists "Users can create orders" on orders;
create policy "Users can create orders" on orders for insert with check (true);

-- Admin policies
drop policy if exists "Admins full access on products" on products;
create policy "Admins full access on products" on products using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins full access on orders" on orders;
create policy "Admins full access on orders" on orders using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins full access on categories" on categories;
create policy "Admins full access on categories" on categories using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins full access on coupons" on coupons;
create policy "Admins full access on coupons" on coupons using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins full access on reviews" on reviews;
create policy "Admins full access on reviews" on reviews using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

