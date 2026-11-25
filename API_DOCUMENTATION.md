# Production International Winter Fashion & Lifestyle E-Commerce Platform
## API Documentation & Server Action Specifications

**Document Version:** 1.0.0  
**Runtime:** Next.js 15+ App Router (Node.js & Edge Runtimes)  
**Security Model:** Type-Safe Zod Schemas, Supabase Auth Session Validation, Stripe Webhook HMAC Signatures

---

## 1. Architectural Overview of the API Layer

The application utilizes a hybrid API strategy combining **Next.js Server Actions** (for first-party UI mutations and form handling) and **Route Handlers** (for external webhooks, automated jobs, and binary file streams).

### 1.1 Standard Response Envelopes

#### Server Action Response Envelope
```typescript
export type ActionResult<T = unknown> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string; validationErrors?: Record<string, string[]> };
```

#### REST Route Handler Envelope
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-25T12:00:00Z",
    "version": "1.0.0"
  }
}
```

---

## 2. Customer & Storefront Server Actions

### 2.1 Shopping Bag & Cart Actions (`actions/cart.actions.ts`)

#### `addToCart`
Adds a product variant to the active cart (guest or authenticated). Validates real-time available inventory before modifying the cart.

- **Signature:** `addToCart(input: AddToCartInput): Promise<ActionResult<Cart>>`
- **Input Schema (Zod):**
  ```typescript
  export const AddToCartSchema = z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
    sessionToken: z.string().min(16), // Guest cookie token
  });
  ```
- **Execution Logic:**
  1. Inspects active Supabase session. If logged in, associates with `user_id`; otherwise, binds to `sessionToken`.
  2. Queries `product_variants.stock_quantity`. If `stock_quantity < requested_quantity`, returns error: `'INSUFFICIENT_STOCK'`.
  3. Upserts into `cart_items`. If item already exists, increments quantity up to available stock limit.
  4. Triggers Next.js `revalidateTag('cart')`.
- **Response Example:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c7a8e2b1-591b-417b-990a-2849182390a1",
      "itemsCount": 2,
      "subtotal": 595.00,
      "currency": "USD"
    }
  }
  ```

#### `updateCartQuantity`
Modifies the quantity of a specific cart line item.

- **Signature:** `updateCartQuantity(input: UpdateCartInput): Promise<ActionResult<Cart>>`
- **Input Schema:**
  ```typescript
  export const UpdateCartSchema = z.object({
    itemId: z.string().uuid(),
    quantity: z.number().int().min(0).max(10), // 0 implies removal
  });
  ```

#### `mergeGuestCart`
Invoked upon customer login or registration. Seamlessly migrates all items from the anonymous guest session into the customer's persistent database cart.

- **Signature:** `mergeGuestCart(sessionToken: string): Promise<ActionResult<Cart>>`

---

### 2.2 Checkout & Stripe Intent Actions (`actions/checkout.actions.ts`)

#### `createCheckoutPaymentIntent`
Initiates the secure checkout session, locks inventory prices, applies discounts, calculates international shipping, and returns a Stripe `client_secret` for frontend Stripe Elements.

- **Signature:** `createCheckoutPaymentIntent(input: CheckoutInput): Promise<ActionResult<CheckoutResponse>>`
- **Input Schema:**
  ```typescript
  export const CheckoutInputSchema = z.object({
    cartId: z.string().uuid(),
    currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
    email: z.string().email(),
    shippingAddress: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      addressLine1: z.string().min(3),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      stateProvince: z.string().min(1),
      postalCode: z.string().min(2),
      countryCode: z.string().length(2), // ISO-2
      phone: z.string().min(7),
    }),
    shippingRateId: z.string().uuid(),
    discountCode: z.string().optional(),
  });
  ```
- **Execution Flow:**
  1. Validates all inputs and checks that the selected shipping rate matches the destination country.
  2. Queries all variant records with `FOR UPDATE` row locking to ensure stock has not been exhausted.
  3. Computes authoritative total:
     $$\text{Total} = \text{Subtotal} + \text{Shipping} + \text{Tax} - \text{Discount}$$
  4. Calls Stripe API `stripe.paymentIntents.create({ amount, currency, metadata })`.
  5. Inserts an order in `orders` table with status `'pending'`.
  6. Returns `clientSecret`, `orderId`, and `orderNumber`.

---

### 2.3 Promotions & Discounts (`actions/discount.actions.ts`)

#### `validateDiscountCode`
Verifies whether a promo code is active, within valid start/end dates, meets the minimum order threshold, and has remaining global uses.

- **Signature:** `validateDiscountCode(code: string, subtotal: number): Promise<ActionResult<DiscountResult>>`
- **Output:**
  ```json
  {
    "success": true,
    "data": {
      "code": "WINTER20",
      "type": "percentage",
      "value": 20,
      "calculatedSavings": 79.00
    }
  }
  ```

---

### 2.4 Customer Account & Address Actions (`actions/account.actions.ts`)

#### `saveCustomerAddress`
Adds or updates a shipping/billing address in the customer's address book.

- **Signature:** `saveCustomerAddress(address: AddressInput): Promise<ActionResult<Address>>`
- **Authentication:** Requires valid Supabase Auth session.

#### `toggleWishlist`
Adds or removes a winter garment from the customer's personal wishlist.

- **Signature:** `toggleWishlist(productId: string): Promise<ActionResult<{ bookmarked: boolean }>>`

---

## 3. Administrator & Operations Server Actions

All actions in `actions/admin.*` strictly enforce RBAC via the `assertAdmin()` guard, throwing `UNAUTHORIZED` if the calling user does not possess the `admin` or `super_admin` role.

### 3.1 Product & Catalog Operations (`actions/admin.product.actions.ts`)

#### `createProductWithVariants`
Creates a base product along with its multi-currency price matrix, multi-size/color variants, and technical winter performance specifications in a single atomic database transaction.

- **Signature:** `createProductWithVariants(payload: CreateProductInput): Promise<ActionResult<Product>>`
- **Input Schema:**
  ```typescript
  export const CreateProductSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    categoryId: z.string().uuid(),
    description: z.string().min(10),
    shortDescription: z.string().optional(),
    gender: z.enum(['men', 'women', 'unisex', 'kids']),
    basePrice: z.number().positive(),
    temperatureRating: z.object({
      minTempC: z.number(),
      maxTempC: z.number(),
      ratingLabel: z.string(),
    }),
    weatherProtection: z.object({
      hydrostaticHeadMm: z.number().optional(),
      dwrFinish: z.boolean().default(false),
      breathabilityGM2: z.number().optional(),
    }),
    insulationSpecs: z.object({
      type: z.string(),
      fillPower: z.number().optional(),
      downToFeather: z.string().optional(),
      weightGsm: z.number().optional(),
    }),
    materials: z.array(z.string()),
    careInstructions: z.array(z.string()),
    sustainabilityCertifications: z.array(z.string()),
    prices: z.array(z.object({
      currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
      amount: z.number().positive(),
      compareAtAmount: z.number().positive().optional(),
    })),
    variants: z.array(z.object({
      sku: z.string(),
      size: z.string(),
      colorName: z.string(),
      colorHex: z.string(),
      stockQuantity: z.number().int().min(0),
      weightGrams: z.number().int().positive(),
    })),
    images: z.array(z.object({
      imageUrl: z.string().url(),
      altText: z.string().optional(),
      isPrimary: z.boolean().default(false),
      displayOrder: z.number().int().default(0),
    })),
  });
  ```

#### `updateVariantStock`
Performs an audit-logged inventory adjustment for a specific SKU.

- **Signature:** `updateVariantStock(input: StockAdjustmentInput): Promise<ActionResult<void>>`
- **Input Schema:**
  ```typescript
  export const StockAdjustmentSchema = z.object({
    variantId: z.string().uuid(),
    quantityDelta: z.number().int(), // e.g. +50 for restock, -2 for damaged
    reason: z.string().min(3),
  });
  ```

---

### 3.2 Order Management & Fulfillment (`actions/admin.order.actions.ts`)

#### `updateFulfillmentStatus`
Updates an order's status to `'shipped'`, records tracking credentials, and dispatches a customer shipping notification with tracking URL via Resend.

- **Signature:** `updateFulfillmentStatus(input: FulfillmentInput): Promise<ActionResult<Order>>`
- **Input Schema:**
  ```typescript
  export const FulfillmentSchema = z.object({
    orderId: z.string().uuid(),
    carrier: z.enum(['DHL Express', 'FedEx', 'UPS', 'Royal Mail', 'DPD']),
    trackingNumber: z.string().min(5),
    trackingUrl: z.string().url(),
  });
  ```

#### `issueOrderRefund`
Processes a full or partial refund via the Stripe API, logs the financial event, and optionally replenishes inventory counts in PostgreSQL.

- **Signature:** `issueOrderRefund(input: RefundInput): Promise<ActionResult<Payment>>`
- **Input Schema:**
  ```typescript
  export const RefundSchema = z.object({
    orderId: z.string().uuid(),
    amount: z.number().positive(), // In order's currency
    reason: z.string().min(5),
    restockItems: z.boolean().default(true),
  });
  ```

---

## 4. REST Route Handlers (`app/api/*`)

### 4.1 Stripe Webhook Handler (`/api/webhooks/stripe/route.ts`)

- **Method:** `POST`
- **Purpose:** Ingests asynchronous payment lifecycle events from Stripe Cloud.
- **Security:**
  - Reads raw request body buffer.
  - Verifies signature header `stripe-signature` against `STRIPE_WEBHOOK_SECRET`.
  - Enforces database idempotency check via `stripe_events` table. If the event ID was already recorded, immediately returns `200 OK`.

```typescript
// Core Webhook Event Matrix Handled
switch (event.type) {
  case 'payment_intent.succeeded': {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentIntentSucceeded(paymentIntent);
    break;
  }
  case 'payment_intent.payment_failed': {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentIntentFailed(paymentIntent);
    break;
  }
  case 'charge.refunded': {
    const charge = event.data.object as Stripe.Charge;
    await handleChargeRefunded(charge);
    break;
  }
}
```

---

### 4.2 Dynamic Currency Rates Sync (`/api/currency/rates/route.ts`)

- **Method:** `GET` / `POST` (Protected via `CRON_SECRET` authorization header)
- **Purpose:** Synchronizes daily foreign exchange rates against base currency (USD) to recalculate dynamic fallback prices for non-pegged global visitors.
- **Headers:** `Authorization: Bearer <CRON_SECRET>`

---

### 4.3 Digital PDF Invoice Stream (`/api/invoices/[id]/route.ts`)

- **Method:** `GET`
- **Purpose:** Generates on-the-fly, localized PDF commercial invoices compliant with EU/UK VAT and US sales tax requirements.
- **Security:** Requires valid user session matching `order.user_id` or an active `admin` session.
- **Content-Type:** `application/pdf`

---

### 4.4 Health & System Readiness Probe (`/api/health/route.ts`)

- **Method:** `GET`
- **Purpose:** Cloud monitoring and uptime heartbeat. Verifies active connection to Supabase PostgreSQL pool and Stripe API availability.
- **Response:**
  ```json
  {
    "status": "healthy",
    "services": {
      "database": "connected",
      "stripe": "available",
      "storage": "connected"
    },
    "timestamp": "2026-11-25T12:00:00.000Z"
  }
  ```

---

## 5. Security, Error Handling & Status Codes

### Standard HTTP Status Codes
| Code | Identifier | Trigger Scenario |
| :--- | :--- | :--- |
| `200` | `OK` | Successful query or idempotent webhook acknowledgement. |
| `201` | `CREATED` | Resource successfully created. |
| `400` | `BAD_REQUEST` | Zod schema validation failure or invalid payload format. |
| `401` | `UNAUTHORIZED` | Unauthenticated request on protected route. |
| `403` | `FORBIDDEN` | Authenticated user lacks required role (e.g. non-admin accessing `/admin/*`). |
| `404` | `NOT_FOUND` | Product, variant, or order record does not exist. |
| `409` | `CONFLICT` | Concurrent stock race condition or duplicate unique SKU/slug. |
| `429` | `TOO_MANY_REQUESTS` | Rate limiter triggered on auth or checkout endpoints. |
| `500` | `INTERNAL_SERVER_ERROR` | Unhandled runtime exception. |

---

## 6. Implemented REST API Route Handlers Specification

All route handlers adhere to standard REST semantics, enforce strict input validation with Zod, and return uniform JSON response envelopes. Never expose service-role keys or sensitive credentials to the browser.

### 6.1 Products API
- **Endpoint:** `GET /api/products`
- **Query Parameters:**
  - `page` (default `1`): Pagination page index.
  - `limit` (default `12`, max `50`): Garments returned per page.
  - `category` (`jackets-coats`, `sweaters-hoodies`, `boots-accessories`, or `all`).
  - `gender` (`men`, `women`, `unisex`, or `all`).
  - `minPrice` & `maxPrice`: Numerical price boundaries.
  - `inStockOnly` (`true` / `false`): Filter out exhausted variants.
  - `search` / `q`: Keyword search across titles, technical subtitles, and materials.
  - `sortBy` (`popularity`, `price-asc`, `price-desc`, `newest`, `rating`).
- **Response Format:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "prod-001",
        "slug": "nordic-expedition-down-parka",
        "title": "Nordic Expedition Down Parka",
        "price": 685.00,
        "temperatureRating": "-30°C",
        "stockCount": 8
      }
    ],
    "meta": {
      "page": 1,
      "limit": 12,
      "total": 12,
      "totalPages": 1,
      "hasNextPage": false
    }
  }
  ```

### 6.2 Product Detail by Slug
- **Endpoint:** `GET /api/products/[slug]`
- **Description:** Returns a single product by slug, including full gallery, colorway variants, size availability, thermal ratings, care, and verified reviews.
- **Error Codes:** `404 Not Found` if slug does not exist.

### 6.3 Categories API
- **Endpoint:** `GET /api/categories`
- **Description:** Returns hierarchical category departments, hero imagery, subcategories, and real-time product counts.

### 6.4 Shopping Cart API
- **Endpoints:**
  - `GET /api/cart?sessionToken={token}`: Retrieves active shopping bag.
  - `POST /api/cart`: Adds a variant to the cart. Performs real-time inventory checks (`stock_quantity >= requested_quantity`).
  - `PATCH /api/cart`: Modifies line item quantity or removes it when quantity is `0`.

### 6.5 Checkout & Idempotent Transactions API
- **Endpoint:** `POST /api/checkout`
- **Security:** Requires `idempotencyKey` to eliminate double-billing from retry submissions.
- **Request Body:**
  ```json
  {
    "currency": "USD",
    "email": "client@cold-horizon.com",
    "shippingAddress": { ... },
    "items": [
      {
        "productSlug": "nordic-expedition-down-parka",
        "variantSku": "WIN-NEP-M-BLK",
        "size": "M",
        "color": "Obsidian",
        "quantity": 1,
        "unitPrice": 685.00
      }
    ],
    "discountCode": "WINTER2026",
    "idempotencyKey": "idem_1740000000_client_nonce_88"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "orderNumber": "WIN-2026-84912",
      "clientSecret": "pi_winter_..._secret_...",
      "subtotal": 685.00,
      "discountAmount": 102.75,
      "shippingAmount": 0.00,
      "taxAmount": 46.58,
      "totalAmount": 628.83,
      "shippingCarrier": "DHL Express Alpine Priority",
      "trackingNumber": "DHL-CH-9482710491"
    }
  }
  ```

### 6.6 Coupon Code Validation API
- **Endpoint:** `POST /api/coupons/validate`
- **Request Body:** `{ "code": "WINTER2026", "subtotal": 500.00, "currency": "USD" }`
- **Response:** Returns discount type, calculated savings, and adjusted order subtotal.

### 6.7 Verified Reviews API
- **Endpoints:**
  - `GET /api/reviews?productSlug={slug}`: Retrieves verified customer reviews with star ratings and fit assessments.
  - `POST /api/reviews`: Submits a customer review validated against `CreateReviewSchema`.

### 6.8 Newsletter & Alerts API
- **Endpoint:** `POST /api/newsletter`
- **Description:** Registers customer email with notification preferences (archival drops, private sales, and frequency).

### 6.9 Homepage Banners & Advertisements API
- **Endpoint:** `GET /api/banners`
- **Description:** Returns active campaign banners, promotional placement tags, and dynamic advertisements.

### 6.10 Administrator Audit Logs API
- **Endpoint:** `GET /api/admin/audit-logs`
- **Security:** Role-gated via Supabase session (`admin` / `super_admin` only). Returns chronological immutable log of admin mutations, stock adjustments, and refunds.
