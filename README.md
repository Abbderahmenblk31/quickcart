# QuickCart — High-Performance Headless E-Commerce Platform 🛒⚡

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

QuickCart is an enterprise-grade headless e-commerce storefront designed for sub-second shopping experiences, instant faceted filtering, persistent stateful cart drawers, and an idempotent checkout engine with real-time package logistics tracking and store fulfillment management.

---

## 🏗️ Architecture & System Design

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|                                                                                 |
|   +--------------------+     +---------------------+     +------------------+   |
|   | Storefront Catalog |     | Dynamic Cart Drawer |     | Checkout Gateway |   |
|   | (Faceted Filters)  |     | (Local Persistence) |     | (Card, Apple, COD)|  |
|   +--------------------+     +---------------------+     +------------------+   |
|            |                            |                          |            |
+------------|----------------------------|--------------------------|------------+
             |                            |                          |
             v                            v                          v
+---------------------------------------------------------------------------------+
|                                APPLICATION TIER                                 |
|                                                                                 |
|   +-------------------------------------------------------------------------+   |
|   |                          Next.js App Router                             |   |
|   |  - GET   /api/products          : Filter, search & sort items           |   |
|   |  - GET   /api/products/[id]     : Detailed SKU specs & stock            |   |
|   |  - POST  /api/checkout          : Atomic stock reservation & checkout   |   |
|   |  - GET   /api/orders/[id]       : Real-time logistics telemetry lookup  |   |
|   |  - PATCH /api/orders/[id]       : Fulfillment state machine updater     |   |
|   |  - GET   /api/admin/stats       : Executive KPIs & revenue metrics      |   |
|   +-------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------+
|                                  DATA ENGINE                                    |
|                                                                                 |
|   +--------------------------+                   +--------------------------+   |
|   | Catalog & Stock State    |                   | Orders & Fulfillment DB  |   |
|   | - Atomic stock mutation  |                   | - Unique Tracking ID gen |   |
|   | - Category segmentation  |                   | - 4-stage State Machine  |   |
|   +--------------------------+                   +--------------------------+   |
+---------------------------------------------------------------------------------+
```

---

## ✨ Key Features & Engineering Highlights

1. **Sub-Second Headless Catalog:**
   - Instant multi-faceted filtering by category (Audio, Wearables, Electronics, Accessories).
   - Real-time search by keywords, specifications, and manufacturer models.
   - Dynamic sorting: Price (Low to High / High to Low), Top Rated, and Curated Featured.
   - "In Stock Only" toggle with optimistic client-side caching.

2. **Persistent Interactive Cart Drawer:**
   - Slide-over glassmorphic UI with zero layout shifts.
   - `localStorage` synchronization preserving shopping carts across sessions and tab reloads.
   - Real-time dynamic math: Subtotal, Free Shipping threshold calculation (`>$200`), and promotional discount logic.
   - Interactive coupon engine (`SAVE15` grants an instant 15% discount).

3. **Production-Ready Idempotent Checkout:**
   - Multi-step validation preventing race conditions or inventory double-booking.
   - Atomic stock reservation: decrements remaining units in real-time.
   - Multi-payment support:
     - Credit / Debit Card (Interactive card input simulation)
     - Apple Pay / Biometric authorization
     - Cash on Delivery (COD)

4. **Real-Time Logistics Telemetry (`/track`):**
   - 4-stage visual progress stepper: `PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`.
   - Dual query lookup: by Order ID (e.g., `QC-1092`) or carrier tracking number (`QC-TRK-771092`).
   - One-click clipboard copy, recipient destination breakdown, and itemized manifest.

5. **Store Fulfillment & Inventory Admin (`/admin`):**
   - Executive telemetry cards: Gross Revenue, Total Orders, Active Catalog SKUs, Low Stock warnings.
   - Interactive fulfillment table: switch statuses with live `PATCH` API requests.
   - Inventory health audit: identifies low-stock items (<10 units) and out-of-stock items.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### Quick Installation & Launch

```bash
# Clone the repository
git clone https://github.com/your-username/quickcart.git
cd quickcart

# Install dependencies
npm install

# Start development server
npm run dev
# The store will be live at http://localhost:3000

# Or build for production
npm run build
npm run start -p 3002
```

---

## 🧪 Testing & Demo Credentials

| Feature | Input / Code | Result |
| :--- | :--- | :--- |
| **Discount Coupon** | `SAVE15` | Deducts 15% from cart subtotal |
| **Free Shipping Tier** | Cart Total &ge; `$200` | Shipping switches from `$15.00` to **FREE** |
| **Order Tracking Demo #1** | `QC-1092` | Shows Delivered package |
| **Order Tracking Demo #2** | `QC-1093` | Shows Dispatched package |
| **Carrier Tracking Demo** | `QC-TRK-771092` | Direct courier lookup |

---

## 🛠️ Tech Stack & Patterns

- **Framework:** Next.js 16 (Turbopack, App Router, React Server Components)
- **Language:** TypeScript 5.0 (Strict mode enabled)
- **Styling:** Tailwind CSS v4 + Glassmorphism UI
- **Icons:** Lucide React
- **Patterns:**
  - Repository Pattern for store data isolation
  - Context Provider pattern for global cart lifecycle
  - Idempotent API endpoints with HTTP status semantic codes
