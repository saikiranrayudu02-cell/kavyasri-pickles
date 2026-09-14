# Razorpay Payment Gateway Integration Documentation — Kavyasri Pickles

This document provides a production-grade guide to the Razorpay Payment Gateway integration in the **Kavyasri Pickles** application.

---

## 1. Architecture Overview

The payment system follows a strict **Server-Authoritative Payment Architecture**:

```
[ Customer Browser ]
        │
        │ 1. Submits Cart & Address
        ▼
[ Server: POST /api/razorpay/create-order ]
        │
        ├─► Validates Cart Items & Stock
        ├─► Fetches Authoritative Product Prices & Variant Costs
        ├─► Applies Coupon Discount & Calculates GST (5%) + Shipping
        ├─► Creates Order on Razorpay API (POST https://api.razorpay.com/v1/orders)
        ▼
[ Returns Razorpay Order ID & Amount (in Paise) ]
        │
        ▼
[ Razorpay Checkout Modal (SDK) ]
        │
        │ 2. Customer Completes Payment (UPI / Card / NetBanking)
        ▼
[ Server: POST /api/razorpay/verify-payment ]
        │
        ├─► Performs HMAC SHA-256 Signature Verification (timingSafeEqual)
        ├─► Checks Order Idempotency & Prevents Double Processing
        ├─► Updates Order State to 'Paid' & Reduces Inventory Idempotently
        ▼
[ Order Confirmed & Receipt Generated ]
```

---

## 2. Webhook Architecture

In addition to frontend checkout payment verification, Razorpay sends asynchronous Webhook events directly to the server to handle asynchronous events (e.g. user closing browser right after payment, network dropped before redirect).

```
[ Razorpay Server ]
        │
        │ Webhook Notification (POST)
        ▼
[ Server Endpoint: /api/razorpay/webhook ]
        │
        ├─► Reads Raw Body Text (req.text())
        ├─► Verifies `x-razorpay-signature` using RAZORPAY_WEBHOOK_SECRET
        ├─► Deduplicates Event ID (In-Memory / Store Event Cache)
        ├─► Updates Order Status & Payment Status ('Paid', 'Failed')
        ▼
[ Responds 200 OK to Razorpay ]
```

---

## 3. Environment Variables

Configure the following environment variables in your deployment environment (e.g., Vercel, Netlify, AWS, Docker):

```env
# Client-Side (Public Key)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx

# Server-Side (Strictly Private - NEVER EXPOSED TO CLIENT)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Security Warning**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` must **never** be prefixed with `NEXT_PUBLIC_` or exposed in frontend JS bundles, git commits, or API outputs.

---

## 4. Razorpay Dashboard & Webhook Configuration

### Step A: API Keys Generation
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings** ➔ **API Keys**.
3. Click **Generate Key** (or use existing Live/Test Keys).
4. Copy the **Key ID** to `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
5. Copy the **Key Secret** to `RAZORPAY_KEY_SECRET`.

### Step B: Webhook Endpoint Setup
1. In Razorpay Dashboard, navigate to **Settings** ➔ **Webhooks**.
2. Click **Add New Webhook**.
3. Set **Webhook URL**:
   ```
   https://yourdomain.com/api/razorpay/webhook
   ```
4. Enter a strong random string for **Secret** and copy it into your server's `RAZORPAY_WEBHOOK_SECRET`.
5. Select the following **Active Events**:
   - `payment.captured`
   - `payment.authorized`
   - `order.paid`
   - `payment.failed`
6. Click **Save Webhook**.

---

## 5. Security Safeguards

| Threat | Safeguard Implemented |
| :--- | :--- |
| **Amount Tampering** | Amounts are computed on the server from DB product prices, stock, and coupon logic. Client-sent amounts are ignored. |
| **Signature Spoofing** | Payment signatures (`razorpay_order_id\|razorpay_payment_id`) are verified using `crypto.timingSafeEqual` with `RAZORPAY_KEY_SECRET`. |
| **Webhook Spoofing** | Webhooks parse raw request body text before JSON decoding to compute exact HMAC-SHA256 digest against `RAZORPAY_WEBHOOK_SECRET`. |
| **Double Stock Deduction** | Order creation & payment state updates use idempotent transaction guards. Once `payment_status` is `'Paid'`, re-delivery skips stock updates. |
| **Secret Leakage** | All secrets live only in Node.js server environments (`route.ts`). `.env` files are ignored by git. |

---

## 6. Testing & Troubleshooting

### Local Testing with Test Credentials
1. Populate `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` with Razorpay Test Keys (`rzp_test_...`).
2. Run `npm run dev` and navigate to `/checkout`.
3. Select **Razorpay Secure Online Checkout** and click **Pay Online**.
4. Razorpay Test Modal will open allowing simulated UPI, NetBanking (Success/Failure testing), and Card testing.

### Testing Webhooks Locally
Use ngrok or Razorpay CLI to forward webhooks to localhost:
```bash
ngrok http 3000
```
Set Webhook URL in Razorpay Dashboard to `https://<ngrok-id>.ngrok-free.app/api/razorpay/webhook`.

### Troubleshooting Matrix
- **`Cryptographic payment signature verification failed`**: Ensure `RAZORPAY_KEY_SECRET` on server matches the Razorpay Dashboard key secret.
- **`Invalid webhook signature`**: Ensure `RAZORPAY_WEBHOOK_SECRET` matches the Webhook Secret string entered in Razorpay Dashboard.
- **`Insufficient Stock Error`**: Check `DataStore` product stock quantities.

---

## 7. API Reference Summary

- `POST /api/razorpay/create-order`: Calculates order total server-side and creates Razorpay Order.
- `POST /api/razorpay/verify-payment`: Verifies payment signature and finalizes order.
- `POST /api/razorpay/webhook`: Processes Razorpay webhook events asynchronously and idempotently.
