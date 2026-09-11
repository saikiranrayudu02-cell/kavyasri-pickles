-- Kavyasri Pickles Seed Data for Supabase (Products, Categories & Settings ONLY)

-- 1. Insert Categories
insert into categories (id, name, slug, description, image_url, is_active, display_order) values
('10000000-0000-0000-0000-000000000001', 'Traditional Veg Pickles', 'traditional-veg-pickles', 'Time-honored vegetarian pickles hand-crafted with sun-cured spices and wood-pressed oils.', '/images/pickles/mango.jpg', true, 1),
('10000000-0000-0000-0000-000000000002', 'Authentic Non-Veg Pickles', 'authentic-non-veg-pickles', 'Slow-cooked succulent meat & seafood pickles prepared with age-old royal recipes.', '/images/pickles/chicken.jpg', true, 2),
('10000000-0000-0000-0000-000000000003', 'Spicy Andhra Delights', 'spicy-andhra-delights', 'Fiery and bold flavors from the heart of Andhra Pradesh, famous for Guntur chillies and gongura.', '/images/pickles/gongura.jpg', true, 3),
('10000000-0000-0000-0000-000000000004', 'Seasonal & Gourmet Specials', 'seasonal-gourmet-specials', 'Limited edition small-batch batches made with fresh seasonal produce like wild gooseberries and winter veggies.', '/images/pickles/garlic.jpg', true, 4),
('10000000-0000-0000-0000-000000000005', 'Handcrafted Combo Jars', 'handcrafted-combo-jars', 'Curated value packs and gift sets of our most loved homemade pickle varieties.', '/images/pickles/hero.jpg', true, 5)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  image_url = excluded.image_url,
  is_active = excluded.is_active,
  display_order = excluded.display_order;

-- 2. Insert Products (11 items)
insert into products (id, category_id, name, slug, short_description, description, price, mrp, discount_percent, weight, stock_quantity, sku, spice_level, dietary, shelf_life, storage_instructions, ingredients, images, is_featured, is_active, rating, reviews_count) values
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Avakaya Mango Pickle (Spicy Andhra Style)', 'andhra-avakaya-mango-pickle', 'Sun-cured raw Ramkela mangoes in cold-pressed sesame oil with stone-ground Guntur chillies.', 'Our signature Avakaya is made strictly adhering to grandmas 70-year-old heirloom recipe. Crisp, hand-cut raw mango chunks with tender kernel skin are marinated in cold-pressed gingelly oil, fiery stone-ground Guntur red chillies, aromatic mustard powder, and plump garlic cloves. Aged naturally in traditional ceramic martaban jars under the warm sun.', 249, 299, 17, '250g', 65, 'KP-MNG-250', 'Extra Hot', 'veg', '12 Months', 'Store in a cool, dry place. Use only a dry spoon.', ARRAY['Raw Mango Chunks', 'Cold-Pressed Sesame Oil', 'Guntur Red Chilli Powder', 'Mustard Powder', 'Garlic Cloves', 'Fenugreek', 'Rock Salt', 'Turmeric'], ARRAY['/images/pickles/mango.jpg', '/images/pickles/hero.jpg'], true, true, 4.90, 142),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Authentic Andhra Gongura Pickle (Red Sorrel)', 'authentic-andhra-gongura-pickle', 'Tangy red sorrel leaves slow-roasted in pure sesame oil with whole roasted red chillies.', 'Gongura is the pride of Telugu cuisine! We hand-pick tender fresh red sorrel leaves, sun-dry them thoroughly, and slow-cook them in fragrant sesame oil. Tempered with roasted dry red chillies, golden garlic cloves, and toasted cumin-fenugreek powder.', 229, 269, 15, '250g', 48, 'KP-GON-250', 'Hot', 'veg', '9 Months', 'Keep away from moisture.', ARRAY['Fresh Gongura Leaves', 'Sesame Oil', 'Dry Red Chillies', 'Garlic', 'Mustard Seeds', 'Sea Salt'], ARRAY['/images/pickles/gongura.jpg', '/images/pickles/hero.jpg'], true, true, 4.80, 118),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Country Style Boneless Chicken Pickle', 'country-style-chicken-pickle', 'Crisp-fried juicy tender boneless chicken bites tossed in fiery Andhra masala gravy.', 'Fresh boneless chicken cubes are marinated in lemon juice and organic turmeric, crisp-fried till golden, and folded into a rich, lip-smacking spice gravy made of freshly ground cloves, cinnamon, tellicherry pepper, garlic paste, and fried curry leaves.', 349, 399, 13, '250g', 38, 'KP-CHK-250', 'Hot', 'non-veg', '6 Months', 'Refrigeration recommended after opening.', ARRAY['Fresh Boneless Chicken', 'Groundnut Oil', 'Ginger-Garlic', 'Red Chilli Powder', 'Curry Leaves', 'Lemon Juice'], ARRAY['/images/pickles/chicken.jpg'], true, true, 4.90, 196),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Traditional Tangy Lemon Pickle (Nimbu ka Achar)', 'traditional-tangy-lemon-pickle', 'Thin-skinned country lemons sun-cured with slit green chillies, fenugreek, and ajwain.', 'Our oil-free/low-oil sun-matured lemon pickle is made from fragrant thin-skinned yellow kagzi lemons. Cured under direct sunlight for 21 days with rock salt and roasted carom seeds.', 199, 249, 20, '250g', 52, 'KP-LMN-250', 'Medium', 'veg', '18 Months', 'Gets better with age! Store in a dry pantry.', ARRAY['Sun-Matured Kagzi Lemons', 'Green Chillies', 'Carom Seeds', 'Fenugreek', 'Turmeric', 'Rock Salt'], ARRAY['/images/pickles/lemon.jpg'], false, true, 4.70, 84),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Pahadi Desi Garlic Pickle (Lahsun ka Achar)', 'desi-garlic-chilli-pickle', 'Whole peeled garlic cloves drenched in fiery mustard oil and roasted Indian spices.', 'Immunity powerhouse! Plump, pungent desi garlic cloves soaked in pungent cold-pressed mustard oil, crushed yellow mustard seeds, split fenugreek, and crushed Kashmiri red chillies.', 239, 279, 14, '250g', 44, 'KP-GAR-250', 'Hot', 'veg', '12 Months', 'Keep jar tightly closed in a cool dry area.', ARRAY['Fresh Desi Garlic Cloves', 'Cold-Pressed Mustard Oil', 'Yellow Mustard Seeds', 'Red Chilli Powder', 'Fenugreek'], ARRAY['/images/pickles/garlic.jpg'], true, true, 4.80, 92),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Sun-Dried Country Tomato Pickle (Thakkali Thokku)', 'sun-dried-tomato-pickle', 'Vine-ripened country tomatoes slow-simmered with tamarind pulp and curry leaves.', 'Juicy desi country tomatoes slow-reduced in pure gingelly oil with sour tamarind pulp, crisp fried curry leaves, and a generous tempering of mustard and asafoetida.', 219, 259, 15, '250g', 50, 'KP-TOM-250', 'Medium', 'veg', '9 Months', 'Store in a cool dry place. Use a clean dry spoon.', ARRAY['Country Desi Tomatoes', 'Tamarind Paste', 'Sesame Oil', 'Red Chilli Powder', 'Mustard Seeds', 'Curry Leaves'], ARRAY['/images/pickles/tomato.jpg'], false, true, 4.70, 73),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Royal Hyderabadi Mutton Pickle (Gosht ka Achar)', 'royal-hyderabadi-mutton-pickle', 'Tender boneless mutton cubes slow-braised in aromatic Nizami roasted spices and mustard oil.', 'A royal Nawabi creation. Boneless morsels of fresh, tender mutton are slow-braised in their own juices and infused with stone-ground Tellicherry black pepper, roasted Kashmiri chillies, fresh ginger-garlic paste, and lemon reduction.', 449, 499, 10, '250g', 24, 'KP-MUT-250', 'Extra Hot', 'non-veg', '6 Months', 'Keep refrigerated after breaking the seal.', ARRAY['Prime Boneless Mutton', 'Mustard Oil', 'Tellicherry Black Pepper', 'Kashmiri Chillies', 'Ginger-Garlic', 'Garam Masala'], ARRAY['/images/pickles/mutton.jpg'], true, true, 4.90, 158),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 'Ginger Tamarind Pickle (Allam Pachadi)', 'andhra-allam-ginger-pickle', 'Spicy ginger ground with organic jaggery, sour tamarind, and tempered mustard.', 'The golden jewel of Andhra tiffins! Pungent country ginger is carefully stone-crushed with dark organic palm jaggery, thick tamarind pulp, and sun-dried chillies.', 229, 269, 15, '250g', 36, 'KP-GNG-250', 'Medium', 'veg', '9 Months', 'Store in an airtight ceramic or glass container.', ARRAY['Fresh Country Ginger', 'Organic Jaggery', 'Tamarind Pulp', 'Red Chilli Powder', 'Fenugreek Powder'], ARRAY['/images/pickles/lemon.jpg'], false, true, 4.60, 51),
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 'Seasonal Amla & Green Chilli Pickle (Usirikaya)', 'seasonal-amla-gooseberry-pickle', 'Whole Indian gooseberries steamed and steeped in mustard oil with green chillies.', 'Wild country amla (gooseberries) steamed until tender, then immersed in hot tempered mustard oil with slit green chillies, split fenugreek seeds, and turmeric.', 239, 279, 14, '250g', 18, 'KP-AML-250', 'Medium', 'veg', '6 Months', 'Keep in a cool place, away from sunlight.', ARRAY['Whole Indian Gooseberries', 'Fresh Green Chillies', 'Cold-Pressed Mustard Oil', 'Mustard Seeds', 'Fenugreek'], ARRAY['/images/pickles/garlic.jpg'], false, true, 4.80, 67),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'Grand Feast Mixed Vegetable & Green Chilli Pickle', 'mixed-vegetable-green-chilli-pickle', 'Crunchy cauliflower, carrots, and turnips tossed with pungent green chillies and ajwain.', 'A crunchy celebration of fresh winter harvest! Hand-chopped cauliflower, crisp Delhi carrots, and fresh turnips tossed with whole pungent green chillies, mustard oil, nigella seeds.', 189, 229, 17, '250g', 42, 'KP-MIX-250', 'Hot', 'veg', '9 Months', 'Keep tightly sealed in a cool pantry.', ARRAY['Cauliflower', 'Carrot', 'Turnip', 'Green Chillies', 'Mustard Oil', 'Mustard Seeds'], ARRAY['/images/pickles/tomato.jpg'], false, true, 4.60, 42),
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000005', 'Traditional Pickle Trio Combo Pack', 'traditional-trio-combo-pack', 'Our top three all-time bestselling handcrafted pickles bundled in a festive gift box.', 'Get the complete Kavyasri experience with our Traditional Heritage Trio! Contains our spicy Andhra Avakaya Mango (250g), tangy Gongura Pachadi (250g), and immunity-boosting Desi Garlic Pickle (250g).', 649, 749, 13, '3 x 250g', 30, 'KP-TRIO-750', 'Hot', 'veg', '12 Months', 'Store each jar separately with lid tightly closed.', ARRAY['Mango Pickle', 'Gongura Pickle', 'Garlic Pickle'], ARRAY['/images/pickles/hero.jpg', '/images/pickles/mango.jpg', '/images/pickles/gongura.jpg'], true, true, 5.00, 210)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  slug = excluded.slug,
  short_description = excluded.short_description,
  description = excluded.description,
  price = excluded.price,
  mrp = excluded.mrp,
  discount_percent = excluded.discount_percent,
  weight = excluded.weight,
  stock_quantity = excluded.stock_quantity,
  sku = excluded.sku,
  spice_level = excluded.spice_level,
  dietary = excluded.dietary,
  shelf_life = excluded.shelf_life,
  storage_instructions = excluded.storage_instructions,
  ingredients = excluded.ingredients,
  images = excluded.images,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count;

-- 3. Insert Product Variants
insert into product_variants (id, product_id, weight, price, mrp, stock_quantity) values
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '250g', 249, 299, 65),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '500g', 449, 499, 40),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '1kg', 799, 899, 22),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '250g', 229, 269, 48),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', '500g', 399, 459, 35),
('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '1kg', 749, 849, 18),
('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000003', '250g', 349, 399, 38),
('40000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', '500g', 599, 699, 25),
('40000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000003', '1kg', 1099, 1249, 12),
('40000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000004', '250g', 199, 249, 52),
('40000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000004', '500g', 349, 399, 30),
('40000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000004', '1kg', 649, 729, 15),
('40000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000005', '250g', 239, 279, 44),
('40000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000005', '500g', 419, 469, 26),
('40000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000005', '1kg', 769, 869, 10),
('40000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000006', '250g', 219, 259, 50),
('40000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000006', '500g', 379, 429, 32),
('40000000-0000-0000-0000-000000000018', '20000000-0000-0000-0000-000000000006', '1kg', 699, 799, 14),
('40000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000007', '250g', 449, 499, 24),
('40000000-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000007', '500g', 799, 899, 15),
('40000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000007', '1kg', 1499, 1699, 8),
('40000000-0000-0000-0000-000000000028', '20000000-0000-0000-0000-000000000008', '250g', 229, 269, 36),
('40000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000008', '500g', 399, 449, 20),
('40000000-0000-0000-0000-000000000024', '20000000-0000-0000-0000-000000000008', '1kg', 729, 819, 9),
('40000000-0000-0000-0000-000000000025', '20000000-0000-0000-0000-000000000009', '250g', 239, 279, 18),
('40000000-0000-0000-0000-000000000026', '20000000-0000-0000-0000-000000000009', '500g', 429, 489, 12),
('40000000-0000-0000-0000-000000000027', '20000000-0000-0000-0000-000000000010', '250g', 189, 229, 42),
('40000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000010', '500g', 329, 379, 28),
('40000000-0000-0000-0000-000000000029', '20000000-0000-0000-0000-000000000011', '3 x 250g', 649, 749, 30),
('40000000-0000-0000-0000-000000000030', '20000000-0000-0000-0000-000000000011', '3 x 500g', 1199, 1399, 15)
on conflict (id) do update set
  product_id = excluded.product_id,
  weight = excluded.weight,
  price = excluded.price,
  mrp = excluded.mrp,
  stock_quantity = excluded.stock_quantity;

-- 4. Insert Coupons
insert into coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, times_used, is_active) values
('30000000-0000-0000-0000-000000000001', 'KAVYA10', 'percentage', 10, 499, 150, '2026-12-31', 500, 124, true),
('30000000-0000-0000-0000-000000000002', 'DESI50', 'fixed', 50, 399, null, '2026-11-30', 300, 87, true),
('30000000-0000-0000-0000-000000000003', 'WELCOME100', 'fixed', 100, 899, null, '2026-12-31', 200, 45, true)
on conflict (id) do update set
  code = excluded.code,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_order_amount = excluded.min_order_amount,
  max_discount = excluded.max_discount,
  expiry_date = excluded.expiry_date,
  usage_limit = excluded.usage_limit,
  times_used = excluded.times_used,
  is_active = excluded.is_active;

-- 5. Insert Store Settings
insert into store_settings (key, value) values
('general', '{"store_name": "Kavyasri Pickles", "tagline": "Traditional Taste. Homemade Love.", "store_email": "support@kavyasripickles.com", "store_phone": "+91 91234 56789", "whatsapp_number": "+91 91234 56789", "fssai_number": "13624014000189", "gst_number": "36AAECK1294F1Z3", "address": "Plot 42, Heritage Kitchens, Near RTC Colony, Kothapet", "city": "Hyderabad", "state": "Telangana", "pincode": "500035", "free_shipping_threshold": 499, "standard_shipping_fee": 50, "razorpay_key_id": "rzp_test_kavyaPickles2026", "is_razorpay_live": false, "enable_cod": true}'::jsonb)
on conflict (key) do update set
  value = excluded.value;
