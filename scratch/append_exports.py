import json

seed_data_path = '/Users/maggi/kavya_pickles/src/lib/data/seed-data.ts'

remaining_seed_exports = '''
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KP-2026-8942',
    user_id: 'usr-1',
    customer_name: 'Rajesh Sharma',
    customer_email: 'rajesh.sharma@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: 'Flat 402, Sai Residency, Jubilee Hills, Hyderabad, Telangana - 500033',
    items: [
      {
        product_id: 'prod-avakaya',
        product_name: 'Avakaya Pickle',
        image: '/images/pickles/avakaya.jpg',
        variant_weight: '500g',
        price: 749,
        quantity: 1,
        total: 749,
      },
    ],
    subtotal: 749,
    discount: 0,
    shipping_fee: 0,
    tax: 0,
    total_amount: 749,
    payment_status: 'Paid',
    payment_method: 'UPI',
    order_status: 'Delivered',
    timeline: [
      { status: 'Pending', timestamp: '10 Aug 2026, 10:30 AM', note: 'Order placed by customer' },
      { status: 'Confirmed', timestamp: '10 Aug 2026, 10:32 AM', note: 'Payment verified via UPI' },
      { status: 'Processing', timestamp: '10 Aug 2026, 02:15 PM', note: 'Jar packed with bubble cushioning' },
      { status: 'Shipped', timestamp: '11 Aug 2026, 09:00 AM', note: 'Handed over to BlueDart express courier' },
      { status: 'Delivered', timestamp: '12 Aug 2026, 04:30 PM', note: 'Package delivered successfully' },
    ],
    created_at: '2026-08-10T10:30:00Z',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'KAVYA10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 399,
    max_discount_amount: 100,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2026-12-31T23:59:59Z',
    usage_limit: 500,
    used_count: 142,
    is_active: true,
  },
  {
    id: 'c-2',
    code: 'WELCOME50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 299,
    valid_from: '2026-01-01T00:00:00Z',
    valid_until: '2026-12-31T23:59:59Z',
    usage_limit: 1000,
    used_count: 320,
    is_active: true,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r-1',
    product_id: 'prod-avakaya',
    user_id: 'usr-1',
    user_name: 'Sridevi Rao',
    rating: 5,
    comment: 'Reminds me exactly of my grandmother’s mango pickle in Vijayawada! Perfect oil and Guntur chilli punch.',
    created_at: '2026-08-05T12:00:00Z',
    is_verified_buyer: true,
  },
  {
    id: 'r-2',
    product_id: 'prod-gongura',
    user_id: 'usr-2',
    user_name: 'Venkatesh K.',
    rating: 5,
    comment: 'The Gongura pickle with hot rice and ghee is heaven on earth. Must buy for authentic Andhra taste!',
    created_at: '2026-08-08T15:30:00Z',
    is_verified_buyer: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    total_orders: 4,
    total_spent: 2450,
    last_order_date: '2026-08-10T10:30:00Z',
    status: 'active',
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  store_name: 'Kavyasri Pickles',
  support_email: 'support-[#166534]pickles.com',
  support_phone: '+91 94949 28282',
  free_shipping_threshold: 499,
  flat_shipping_fee: 50,
  tax_percentage: 0,
  currency: '₹',
};

export const INITIAL_FLASH_UPDATES: FlashUpdate[] = [
  {
    id: 'flash-1',
    title: 'FREE EXPRESS SHIPPING',
    message: 'On all orders above ₹499 across India!',
    link: '/shop',
    badge_text: 'LIMITED OFFER',
    is_active: true,
  },
  {
    id: 'flash-2',
    title: 'FRESH VEG BATCH READY',
    message: '20 Traditional Homemade Veg Pickles now in stock!',
    link: '/veg-pickles',
    badge_text: 'NEW BATCH',
    is_active: true,
  },
];
'''

with open(seed_data_path, 'a') as f:
    f.write('\n' + remaining_seed_exports)

print('Appended missing seed data exports successfully!')
