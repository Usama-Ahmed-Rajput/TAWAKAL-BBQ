# DEEP INVESTIGATION REPORT: P2 AUDIT FINDINGS

**Project Name:** Tawakal Bar B.Q  
**Date of Investigation:** August 21, 2026  
**Scope:** Deep-dive read-only investigation of findings P2-01 (Coupon Rate Limiting), P2-02 (Admin Orders Pagination), and P2-03 (Float Currency Precision).  
**Execution Mode:** Strictly Read-Only (0 files modified, 0 DB migrations, 0 source edits).  

---

## 1. EXECUTIVE SUMMARY

A comprehensive, read-only investigation was conducted into the three P2 findings identified in `COMPLETE_FINAL_BUG_AUDIT.md`. All three findings were cross-checked against the active codebase, schema definitions, and API route handlers.

### Key Summary Table

| Finding ID | Title | Verified Classification | Severity | DB Migration Required? | Production Blocking? |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **P2-01** | Coupon Rate Limiting Omission | **CONFIRMED SECURITY VULNERABILITY** | P2 (Medium) | No | No |
| **P2-02** | Admin Orders API Pagination | **FUTURE SCALABILITY RISK** | P2 (Medium) | No | No |
| **P2-03** | Money Using Float in Schema | **REAL PRODUCTION RISK** | P2 (Medium) | Yes (if schema modified) | No |

---

## 2. DEEP DIVE: P2-01 — COUPON VALIDATION RATE LIMITING

### 2.1 Code & Route Inspection
- **File:** [`app/api/coupons/validate/route.ts`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/app/api/coupons/validate/route.ts)
- **Handler:** `export async function POST(request: Request)`

### 2.2 Detailed Answers & Investigation Findings
- **Is the endpoint publicly accessible?** **YES.** Anyone can send HTTP POST requests to `/api/coupons/validate`.
- **Does it require authentication?** **NO.** There are no admin tokens or customer session checks.
- **Can an attacker brute-force coupon codes?** **YES.** An automated attacker can test thousands of code combinations (`SAVE10`, `FREE`, `TAWAKAL20`) per minute.
- **Can coupon validation be abused for API/DB exhaustion?** **YES.** Every request executes `db.coupon.findUnique({ where: { code } })`. Flooding this endpoint will exhaust PostgreSQL database connection pool slots.
- **Is there existing rate limiting elsewhere?** **YES.** [`lib/rateLimit.ts`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/lib/rateLimit.ts) provides `checkRateLimit()`, which is used in `/api/orders/track/route.ts`, but was omitted from `/api/coupons/validate`.
- **Does validation reveal whether a coupon exists?** **YES.** The API returns distinct error messages (`Invalid or inactive coupon code` vs `Minimum order amount of Rs. X required` vs `Coupon code usage limit has been reached`). This enables accurate coupon code dictionary enumeration.
- **Frontend Disconnect Finding:** [`app/checkout/PublicCheckoutClient.tsx:102`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/app/checkout/PublicCheckoutClient.tsx#L102) currently hardcodes client-side coupon check for `'TAWAKAL10'` and does not call `/api/coupons/validate`. However, the server-side API endpoint remains live and exposed.

### 2.3 Attack Scenario & Exploitability
- **Attack Scenario:** Attacker runs a dictionary script guessing potential promo codes. On discovering an unadvertised 50% discount coupon, the attacker applies it to large orders. Alternatively, an attacker spams invalid coupon requests to cause high CPU/DB load.
- **Exploitability:** High (Public POST route, zero protection).
- **Classification:** **CONFIRMED SECURITY VULNERABILITY**

### 2.4 Recommended Safest Fix
Import `checkRateLimit` into `app/api/coupons/validate/route.ts`:
```typescript
const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
const rateLimit = checkRateLimit(`coupon_val_${ip}`, 5, 60 * 1000); // 5 attempts per min
if (!rateLimit.success) {
  return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
}
```

---

## 3. DEEP DIVE: P2-02 — ADMIN ORDERS API PAGINATION

### 3.1 Code & Route Inspection
- **File:** [`app/api/orders/route.ts:29-36`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/app/api/orders/route.ts#L29-L36)
- **UI:** [`app/admin/orders/page.tsx:20`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/app/admin/orders/page.tsx#L20)

### 3.2 Detailed Answers & Investigation Findings
- **Does the API return all orders without pagination?** **YES.** Executes `prisma.order.findMany({ where, include: { orderItems: true, branch: true }, orderBy: { createdAt: 'desc' } })` with no limit/skip constraints.
- **Is there a maximum result limit?** **NO.** 100% of matching order records in the database are returned in a single query payload.
- **Can an authorized admin request cause an excessively large DB query?** **YES.** Selecting the "ALL" tab in the admin dashboard fetches all historical orders.
- **Can an unauthorized user access this endpoint?** **NO.** Protected by `await requireAdminPermission('orders.view')` and middleware JWT verification in `proxy.ts`.
- **What happens with 10k, 100k, or 1M orders?** Severe latency, high RAM usage on Node server, potential Out-Of-Memory (OOM) process crash, and browser UI freezes while trying to render tens of thousands of table rows.
- **Does the frontend currently support pagination?** **NO.** `AdminOrdersPage` expects a flat array of orders.

### 3.3 Risk & Exploitability
- **Current Real-World Impact:** Low in dev/launch phase with few orders; Critical as business order volume grows over months.
- **Classification:** **FUTURE SCALABILITY RISK**

### 3.4 Recommended Safest Fix Strategy
1. Modify `app/api/orders/route.ts` to accept `page` (default 1) and `limit` (default 50) query parameters.
2. Return metadata `{ orders, pagination: { totalCount, totalPages, currentPage } }`.
3. Add pagination controls (Previous / Next page buttons) to `app/admin/orders/page.tsx`.

---

## 4. DEEP DIVE: P2-03 — FLOAT CURRENCY PRECISION

### 4.1 Schema & Code Inspection
- **Schema File:** [`prisma/schema.prisma`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/prisma/schema.prisma)
- **Order Creation File:** [`app/api/orders/route.ts:87-160`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/app/api/orders/route.ts#L87-L160)
- **Cart Context:** [`context/CartContext.tsx:185`](file:///d:/Personal%20Projects/Tawakal%20Bar%20B.Q/context/CartContext.tsx#L185)

### 4.2 Detailed Answers & Investigation Findings
- **Which database fields use Float?**  
  All 21 monetary and discount fields across the schema:
  - `MenuItem.price`, `MenuItem.compareAtPrice`
  - `MenuItemVariant.price`
  - `MenuAddon.price`
  - `Deal.originalPrice`, `Deal.dealPrice`, `Deal.discountValue`
  - `Order.subtotal`, `Order.discountAmount`, `Order.deliveryFee`, `Order.totalAmount`
  - `OrderItem.price`, `OrderItemAddon.price`
  - `Payment.amount`
  - `Offer.discountValue`, `Offer.minOrder`
  - `Coupon.discountValue`, `Coupon.minOrder`, `Coupon.maxDiscount`
  - `DeliveryArea.deliveryFee`, `DeliveryArea.minOrder`
- **Where are calculations performed?**  
  In JS server logic (`app/api/orders/route.ts`) and client React state (`CartContext.tsx`).
- **Can IEEE-754 precision produce incorrect customer totals?** **YES.** When percentage discounts or non-integer amounts are evaluated, floating-point arithmetic can produce precision noise (e.g. `318.74999999999994`).
- **Are values rounded before persistence?** **NO.** `totalAmount` is calculated as `Math.max(0, calculatedSubtotal - discountAmount + finalDeliveryFee)` without applying `Math.round()` or rounding helper prior to `prisma.order.create()`.
- **Is Float a confirmed bug or theoretical risk?** It is a **REAL PRODUCTION RISK**. While menu items in PKR are generally whole integers, fractional percentage discounts introduce precision noise into order total columns.

### 4.3 Migration Considerations (Float -> Decimal / Int)
- **Prisma Migration Required?** **YES.** Changing `Float` to `Decimal` in `schema.prisma` requires running `npx prisma migrate dev`.
- **Prisma Decimal Serialization Challenge:** Prisma returns `Decimal` as `Decimal.js` objects. Standard JSON serialization (`NextResponse.json()`) or passing objects to React Client Components will fail unless numbers are converted via `.toNumber()` or serialized to strings.
- **Pragmatic Non-Breaking Safeguard (Alternative to Schema Migration):** Enforce strict server-side rounding in `app/api/orders/route.ts`:
  ```typescript
  const totalAmount = Math.round(calculatedSubtotal - discountAmount + finalDeliveryFee);
  ```

---

## 5. CROSS-FINDING RISK ASSESSMENT & PRIORITY MATRIX

| Finding ID | Real-World Impact | Fix Complexity | DB Migration Needed? | Priority Order |
| :--- | :--- | :--- | :---: | :---: |
| **P2-01** (Coupon Rate Limit) | High (Enumeration & DoS risk) | **Low** (5 mins) | No | **Priority 1** |
| **P2-02** (Admin Order Pagination) | High (At scale: OOM / UI lockup) | **Medium** (30 mins) | No | **Priority 2** |
| **P2-03** (Float Currency Precision) | Medium (Decimal artifacts) | **Medium-High** | Optional (Can round in JS) | **Priority 3** |

---

## 6. PRODUCTION BLOCKING ASSESSMENT

- **Are any of these 3 findings production blockers?**  
  **NO.** None of these findings prevent a successful initial production launch. However, P2-01 should be patched before launching public promo marketing campaigns.

---

## 7. CONCISE TERMINAL SUMMARY

P2-01: CONFIRMED  
P2-02: CONFIRMED  
P2-03: CONFIRMED  

Total confirmed issues: 3  
Production blockers: 0  

---
*Report generated strictly in read-only mode. Zero files modified.*
