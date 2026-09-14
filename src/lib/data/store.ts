import { Product, Category, Order, Coupon, Review, Customer, StoreSettings, OrderStatus, PaymentStatus, FlashUpdate } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_FLASH_UPDATES,
} from './seed-data';

const STORAGE_KEYS = {
  PRODUCTS: 'kp_products_v9',
  CATEGORIES: 'kp_categories_v9',
  ORDERS: 'kp_orders_v1',
  COUPONS: 'kp_coupons_v1',
  REVIEWS: 'kp_reviews_v1',
  CUSTOMERS: 'kp_customers_v1',
  SETTINGS: 'kp_settings_v1',
  FLASH_UPDATES: 'kp_flash_updates_v1',
};

// Safe localStorage access helper
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed saving to localStorage [${key}]:`, err);
  }
}

// Global in-memory fallback for SSR
let memoryStore = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  orders: [...INITIAL_ORDERS],
  coupons: [...INITIAL_COUPONS],
  reviews: [...INITIAL_REVIEWS],
  customers: [...INITIAL_CUSTOMERS],
  settings: { ...INITIAL_STORE_SETTINGS },
  flashUpdates: [...INITIAL_FLASH_UPDATES],
};

export const DataStore = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, memoryStore.products);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug && p.is_active);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    let updated: Product[];

    if (index >= 0) {
      updated = [...products];
      updated[index] = product;
    } else {
      updated = [product, ...products];
    }

    setStored(STORAGE_KEYS.PRODUCTS, updated);
    memoryStore.products = updated;
    return product;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts().filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, products);
    memoryStore.products = products;
    return true;
  },

  // CATEGORIES
  getCategories(): Category[] {
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, memoryStore.categories);
  },

  saveCategory(category: Category): Category {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    let updated: Category[];

    if (index >= 0) {
      updated = [...categories];
      updated[index] = category;
    } else {
      updated = [...categories, category];
    }

    setStored(STORAGE_KEYS.CATEGORIES, updated);
    memoryStore.categories = updated;
    return category;
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CATEGORIES, categories);
    memoryStore.categories = categories;
    return true;
  },

  // ORDERS
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, memoryStore.orders);
  },

  getUserOrders(userId?: string, email?: string): Order[] {
    if (!userId && !email) return [];
    const all = this.getOrders();
    const cleanEmail = email?.trim().toLowerCase();

    return all.filter((o) => {
      const matchUser = userId && o.user_id && o.user_id === userId;
      const matchEmail = cleanEmail && o.customer_email && o.customer_email.trim().toLowerCase() === cleanEmail;
      return Boolean(matchUser || matchEmail);
    });
  },

  getOrderById(id: string): Order | undefined {
    if (!id) return undefined;
    const orders = this.getOrders();
    const cleanId = id.trim().toLowerCase();
    return orders.find((o) => o.id.toLowerCase() === cleanId);
  },

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id.toLowerCase() === order.id.toLowerCase());
    let updated: Order[];
    if (index >= 0) {
      updated = [...orders];
      updated[index] = order;
    } else {
      updated = [order, ...orders];
    }
    setStored(STORAGE_KEYS.ORDERS, updated);
    memoryStore.orders = updated;
    return order;
  },

  createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'timeline'>): Order {
    const newId = `KP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const timestampFormatted = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      ...orderData,
      id: newId,
      created_at: now,
      timeline: [
        {
          status: 'Pending',
          timestamp: timestampFormatted,
          note: 'Order placed by customer',
        },
        {
          status: 'Confirmed',
          timestamp: timestampFormatted,
          note: `Payment confirmed via ${orderData.payment_method}`,
        },
      ],
    };

    const orders = [newOrder, ...this.getOrders()];
    setStored(STORAGE_KEYS.ORDERS, orders);
    memoryStore.orders = orders;

    // Reduce stock quantities for purchased items
    const products = this.getProducts();
    const updatedProducts = products.map((prod) => {
      const purchased = orderData.items.find((item) => item.product_id === prod.id);
      if (purchased) {
        const remainingStock = Math.max(0, prod.stock_quantity - purchased.quantity);
        return {
          ...prod,
          stock_quantity: remainingStock,
          variants: prod.variants.map((v) =>
            v.weight === purchased.variant_weight
              ? { ...v, stock_quantity: Math.max(0, v.stock_quantity - purchased.quantity) }
              : v
          ),
        };
      }
      return prod;
    });

    setStored(STORAGE_KEYS.PRODUCTS, updatedProducts);
    memoryStore.products = updatedProducts;

    // Async sync to live Supabase DB
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const validUserId = orderData.user_id && orderData.user_id.length === 36 ? orderData.user_id : null;
      client
        .from('orders')
        .insert({
          id: newOrder.id,
          user_id: validUserId,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          coupon_code: newOrder.coupon_code || null,
          shipping_fee: newOrder.shipping_fee,
          tax: newOrder.tax,
          total_amount: newOrder.total_amount,
          payment_status: newOrder.payment_status,
          payment_method: newOrder.payment_method,
          razorpay_order_id: newOrder.razorpay_order_id || null,
          razorpay_payment_id: newOrder.razorpay_payment_id || null,
          order_status: newOrder.order_status,
          timeline: newOrder.timeline,
        })
        .then(({ error }) => {
          if (error) {
            console.error('Supabase orders insert:', error.message);
            return;
          }

          const itemsToInsert = newOrder.items.map((it) => ({
            order_id: newOrder.id,
            product_id: it.product_id && it.product_id.length === 36 ? it.product_id : null,
            product_name: it.product_name,
            image: it.image,
            variant_weight: it.variant_weight,
            price: it.price,
            quantity: it.quantity,
            total: it.total,
          }));

          client
            .from('order_items')
            .insert(itemsToInsert)
            .then(({ error: itemErr }) => {
              if (itemErr) console.error('Supabase order_items insert:', itemErr.message);
            });
        });
    }

    return newOrder;
  },

  getOrderByRazorpayId(rzpId: string): Order | undefined {
    if (!rzpId) return undefined;
    const orders = this.getOrders();
    const cleanId = rzpId.trim();
    return orders.find(
      (o) =>
        (o.razorpay_order_id && o.razorpay_order_id === cleanId) ||
        (o.razorpay_payment_id && o.razorpay_payment_id === cleanId)
    );
  },

  updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    razorpayPaymentId?: string
  ): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
    if (index === -1) return undefined;

    const order = orders[index];
    // Avoid redundant state mutations
    if (order.payment_status === paymentStatus && (!razorpayPaymentId || order.razorpay_payment_id === razorpayPaymentId)) {
      return order;
    }

    const timestampFormatted = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedOrder: Order = {
      ...order,
      payment_status: paymentStatus,
      order_status: paymentStatus === 'Paid' ? 'Confirmed' : order.order_status,
      razorpay_payment_id: razorpayPaymentId || order.razorpay_payment_id,
      timeline: [
        ...order.timeline,
        {
          status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
          timestamp: timestampFormatted,
          note: `Payment status updated to ${paymentStatus}${razorpayPaymentId ? ` (ID: ${razorpayPaymentId})` : ''}`,
        },
      ],
    };

    orders[index] = updatedOrder;
    setStored(STORAGE_KEYS.ORDERS, orders);
    memoryStore.orders = orders;

    // Sync status change to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          order_status: paymentStatus === 'Paid' ? 'Confirmed' : order.order_status,
          razorpay_payment_id: razorpayPaymentId || order.razorpay_payment_id,
        })
        .eq('id', order.id)
        .then(({ error }) => {
          if (error) console.error('Supabase update order payment status:', error.message);
        });
    }

    return updatedOrder;
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return undefined;

    const order = orders[index];
    const timestampFormatted = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedTimeline = [
      ...order.timeline,
      {
        status: newStatus,
        timestamp: timestampFormatted,
        note: note || `Order updated to ${newStatus}`,
      },
    ];

    const updatedOrder: Order = {
      ...order,
      order_status: newStatus,
      timeline: updatedTimeline,
    };

    orders[index] = updatedOrder;
    setStored(STORAGE_KEYS.ORDERS, orders);
    memoryStore.orders = orders;
    return updatedOrder;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, memoryStore.coupons);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.is_active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive promo code.' };
    }

    if (subtotal < coupon.min_order_amount) {
      return {
        valid: false,
        discount: 0,
        message: `Add items worth ₹${coupon.min_order_amount - subtotal} more to use code ${coupon.code}.`,
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount_value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `Coupon ${coupon.code} applied! You save ₹${discount}.`,
      coupon,
    };
  },

  saveCoupon(coupon: Coupon): Coupon {
    const coupons = this.getCoupons();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    let updated: Coupon[];

    if (index >= 0) {
      updated = [...coupons];
      updated[index] = coupon;
    } else {
      updated = [coupon, ...coupons];
    }

    setStored(STORAGE_KEYS.COUPONS, updated);
    memoryStore.coupons = updated;
    return coupon;
  },

  deleteCoupon(id: string): boolean {
    const coupons = this.getCoupons().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.COUPONS, coupons);
    memoryStore.coupons = coupons;
    return true;
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, memoryStore.reviews);
    if (productId) {
      return reviews.filter((r) => r.product_id === productId && r.is_approved);
    }
    return reviews;
  },

  getAllReviewsAdmin(): Review[] {
    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, memoryStore.reviews);
  },

  addReview(reviewData: Omit<Review, 'id' | 'created_at'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
    };

    const reviews = [newReview, ...this.getAllReviewsAdmin()];
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    memoryStore.reviews = reviews;
    return newReview;
  },

  moderateReview(id: string, isApproved: boolean): boolean {
    const reviews = this.getAllReviewsAdmin();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return false;

    reviews[index].is_approved = isApproved;
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    memoryStore.reviews = reviews;
    return true;
  },

  deleteReview(id: string): boolean {
    const reviews = this.getAllReviewsAdmin().filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    memoryStore.reviews = reviews;
    return true;
  },

  // CUSTOMERS
  getCustomers(): Customer[] {
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, memoryStore.customers);
  },

  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  },

  // SETTINGS
  getStoreSettings(): StoreSettings {
    const s = getStored<StoreSettings>(STORAGE_KEYS.SETTINGS, memoryStore.settings);
    return {
      ...s,
      gst_percentage: typeof s.gst_percentage === 'number' ? s.gst_percentage : 5,
      gst_enabled: typeof s.gst_enabled === 'boolean' ? s.gst_enabled : true,
    };
  },

  updateStoreSettings(settings: StoreSettings): StoreSettings {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    memoryStore.settings = settings;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kp_settings_changed', { detail: settings }));
    }
    return settings;
  },

  // FLASH UPDATES (TICKER / ANNOUNCEMENTS)
  getFlashUpdates(): FlashUpdate[] {
    return getStored<FlashUpdate[]>(STORAGE_KEYS.FLASH_UPDATES, memoryStore.flashUpdates);
  },

  getActiveFlashUpdates(): FlashUpdate[] {
    return this.getFlashUpdates()
      .filter((item) => item.is_active)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },

  getFlashUpdateById(id: string): FlashUpdate | undefined {
    return this.getFlashUpdates().find((u) => u.id === id);
  },

  saveFlashUpdates(updates: FlashUpdate[]): void {
    setStored(STORAGE_KEYS.FLASH_UPDATES, updates);
    memoryStore.flashUpdates = updates;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kp_flash_updates_changed', { detail: updates }));
    }
  },

  updateFlashUpdate(id: string, updates: Partial<FlashUpdate>): FlashUpdate | null {
    const list = this.getFlashUpdates();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updated: FlashUpdate = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    list[index] = updated;
    this.saveFlashUpdates(list);
    return updated;
  },

  addFlashUpdate(data: Omit<FlashUpdate, 'id' | 'created_at' | 'updated_at'>): FlashUpdate {
    const list = this.getFlashUpdates();
    const newUpdate: FlashUpdate = {
      ...data,
      id: `flash-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newUpdate);
    this.saveFlashUpdates(list);
    return newUpdate;
  },

  deleteFlashUpdate(id: string): boolean {
    const list = this.getFlashUpdates();
    const filtered = list.filter((u) => u.id !== id);
    if (filtered.length === list.length) return false;
    this.saveFlashUpdates(filtered);
    return true;
  },

  // ADMIN ANALYTICS & KPIS
  getAdminKPIs() {
    const orders = this.getOrders();
    const products = this.getProducts();
    const customers = this.getCustomers();

    const totalSales = orders
      .filter((o) => o.payment_status === 'Paid')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const pendingOrders = orders.filter((o) => o.order_status === 'Pending' || o.order_status === 'Processing').length;
    const lowStockProducts = products.filter((p) => p.stock_quantity <= 20).length;

    return {
      totalSales,
      totalOrders: orders.length,
      pendingOrders,
      totalCustomers: customers.length,
      totalProducts: products.length,
      lowStockProducts,
    };
  },

  // Reset to seed data
  resetToDefaults() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.COUPONS);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.FLASH_UPDATES);
    }
    memoryStore = {
      products: [...INITIAL_PRODUCTS],
      categories: [...INITIAL_CATEGORIES],
      orders: [...INITIAL_ORDERS],
      coupons: [...INITIAL_COUPONS],
      reviews: [...INITIAL_REVIEWS],
      customers: [...INITIAL_CUSTOMERS],
      settings: { ...INITIAL_STORE_SETTINGS },
      flashUpdates: [...INITIAL_FLASH_UPDATES],
    };
  },
};
