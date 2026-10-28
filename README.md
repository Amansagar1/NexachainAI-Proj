# Nexachain AI - MERN Stack Investment and Referral Platform

[![Fullstack Tests](https://img.shields.io/badge/Tests-8%2F8%20Passed-emerald.svg)](#17-testing-instructions)
[![Next.js](https://img.shields.io/badge/Next.js-v16-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-naxachain-forestgreen.svg)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Inline%20Utilities-blue.svg)](https://tailwindcss.com/)

A full-stack, enterprise-grade investment and multi-level referral platform built for **Nexachain AI** in accordance with the official Technical Assessment specifications and UI designs.

---

## 1. Project Overview

**Nexachain AI** is a financial technology platform that allows users to:
- Invest in tiered growth plans with fixed daily ROI payouts.
- Earn multi-level referral commissions across 3 levels (5% direct, 3% level 2, 2% level 3).
- Monitor live earnings and analytics through a modern fintech dashboard.
- Explore their multi-level downline using an interactive, zoomable, and collapsible referral tree hierarchy.
- Benefit from an automated, idempotent `node-cron` scheduler running daily at 12:00 AM.

---

## 2. Technology Stack

### Frontend
- **Framework**: **Next.js** (React 18/19 App Router) with client-side hydration
- **Styling**: **Inline Tailwind CSS** (`className="..."` utility classes)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (interactive Line charts, Stacked Bar charts, Donut distribution charts)
- **Form Management & Validation**: React Hook Form with Zod schemas
- **HTTP Client**: Axios with interceptors, JWT authorization headers, and 401 handling
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js (v24+)
- **Framework**: Express.js
- **Database & ODM**: MongoDB Atlas (`naxachain` database) with Mongoose v8
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Security**: Helmet, CORS with strict origin validation, Express Rate Limiter, input sanitization
- **Automated Scheduler**: `node-cron` (configured for 12:00 AM daily execution)
- **Testing**: Jest + Supertest + in-memory MongoDB runner

---

## 3. Project Folder Structure

```text
d:/MYMOBILEPROJECTS/
├── frontend/                     # Next.js Frontend with Inline Tailwind CSS
│   ├── public/
│   │   └── favicon.svg           # Nexachain AI branded vector icon
│   ├── src/
│   │   ├── app/                  # Next.js App Router Pages
│   │   │   ├── layout.jsx        # Root Layout with AuthProvider & Toaster
│   │   │   ├── globals.css       # Base Tailwind styling & scrollbars
│   │   │   ├── page.jsx          # Root Entry (redirects to /dashboard or /login)
│   │   │   ├── login/page.jsx    # Split-screen Auth Page (UI Design #1)
│   │   │   ├── register/page.jsx # Registration with sponsor referral validation
│   │   │   ├── dashboard/page.jsx# Main Overview Dashboard (UI Design #2)
│   │   │   ├── investments/page.jsx# Investment Plans & History (UI Design #3)
│   │   │   ├── roi-history/page.jsx# Daily ROI Tracking & Charts (UI Design #4)
│   │   │   ├── referral-income/page.jsx# Level Income & Charts (UI Design #5)
│   │   │   ├── referral-tree/page.jsx  # Interactive Tree Visualizer (UI Design #6)
│   │   │   ├── wallet/page.jsx   # Wallet & Settlement View
│   │   │   ├── profile/page.jsx  # User Profile Details
│   │   │   └── settings/page.jsx # Notification & Security Preferences
│   │   ├── components/
│   │   │   ├── common/           # Reusable UI Components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── LoadingState.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── ErrorState.jsx
│   │   │   ├── layout/           # Shared Navigation & Shell
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   └── dashboard/
│   │   │       └── StatCard.jsx  # Configurable KPI Card Component
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global User Session & Balance Store
│   │   ├── features/             # Feature-specific API Clients
│   │   │   ├── auth/authApi.js
│   │   │   ├── dashboard/dashboardApi.js
│   │   │   ├── investments/investmentsApi.js
│   │   │   ├── roi/roiApi.js
│   │   │   └── referrals/referralsApi.js
│   │   ├── services/
│   │   │   └── apiClient.js      # Central Axios client with JWT interceptor
│   │   ├── utils/
│   │   │   ├── currency.js       # Indian Rupee (INR) formatters
│   │   │   ├── date.js           # Date and timestamp formatters
│   │   │   └── errorHandler.js   # Unified API error extractor
│   │   └── constants/
│   │       ├── routes.js         # Centralized route definitions
│   │       └── navigation.js     # Sidebar menu configuration
│   ├── next.config.js            # Next.js configuration & API reverse proxy
│   ├── tailwind.config.js        # Brand color extensions & font definitions
│   ├── .env                      # Frontend environment settings
│   └── package.json
│
├── backend/                      # Layered Express.js Backend Architecture
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js            # Environment validation
│   │   │   ├── database.js       # MongoDB Atlas connection manager
│   │   │   └── cors.js           # CORS whitelisting & security
│   │   ├── models/               # The 4 Core Mongoose Models
│   │   │   ├── User.js           # Users & wallet balances
│   │   │   ├── Investment.js     # Investments & plan details
│   │   │   ├── ROIHistory.js     # Daily credited returns (idempotent key)
│   │   │   └── ReferralIncome.js # Multi-level referral commission ledger
│   │   ├── controllers/          # HTTP Request/Response Handlers
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── investmentController.js
│   │   │   ├── roiController.js
│   │   │   └── referralController.js
│   │   ├── services/             # Core Business Logic & Calculations
│   │   │   ├── authService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── investmentService.js
│   │   │   ├── roiService.js     # Daily ROI execution & idempotency
│   │   │   └── referralService.js# Hierarchy traversal & level commission
│   │   ├── routes/               # Express Endpoint Routers
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── investmentRoutes.js
│   │   │   ├── roiRoutes.js
│   │   │   └── referralRoutes.js
│   │   ├── middleware/           # Reusable Middlewares
│   │   │   ├── authenticate.js   # JWT verification & active status check
│   │   │   ├── authorize.js      # Account authorization
│   │   │   ├── validateRequest.js# Express-validator error pipeline
│   │   │   ├── rateLimiter.js    # Auth & API abuse prevention
│   │   │   ├── notFound.js       # 404 handler
│   │   │   └── errorHandler.js   # Centralized error handler
│   │   ├── validators/           # Request input validators
│   │   │   ├── authValidator.js
│   │   │   └── investmentValidator.js
│   │   ├── jobs/
│   │   │   └── roiScheduler.js   # Automated node-cron 12:00 AM scheduler
│   │   ├── utils/
│   │   │   ├── AppError.js       # Operational error class
│   │   │   ├── asyncHandler.js   # Async controller wrapper
│   │   │   └── logger.js         # Structured logger
│   │   ├── constants/
│   │   │   └── businessRules.js  # Centralized business parameters & rates
│   │   ├── app.js                # Express Application Setup
│   │   └── server.js             # HTTP Server & DB bootstrap
│   ├── tests/
│   │   └── nexachain.test.js     # Complete Automated Test Suite (Jest)
│   ├── seedAtlas.js              # Atlas seeder script
│   ├── .env                      # Backend environment settings
│   └── package.json
│
├── docs/
│   ├── api.md                    # Detailed REST API Documentation
│   └── business-rules.md         # Financial formulas & idempotency rules
├── postman/
│   └── collection.json           # Ready-to-import Postman collection
├── UiDesign/                     # The 6 approved UI Design Screenshots
├── package.json                  # Root scripts
└── README.md
```

---

## 4. Database Setup (MongoDB Atlas)

The project is connected to the **MongoDB Atlas Cluster** database `naxachain`:

```text
mongodb+srv://sagarsharmaofficial0:%40Developer%400531@cluster0.sf919.mongodb.net/naxachain?retryWrites=true&w=majority
```

All 4 collections are provisioned with unique indexes and seeded with demo evaluation data:
- **`users`**
- **`investments`**
- **`roihistories`**
- **`referralincomes`**

### Pre-configured Demo Login Credentials:
- **Email**: `john@nexachain.ai`
- **Password**: `password123`
- **Referral Code**: `NXA123456`

---

## 5. Quick Start Instructions

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### 1. Start the Backend API & Scheduler
```bash
cd backend
npm install
npm run dev
```
> The backend will connect to MongoDB Atlas database `naxachain`, verify indexes, start the Daily ROI scheduler, and listen on **`http://localhost:5000`**.

### 2. Start the Next.js Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
> The Next.js dashboard will start on **`http://localhost:3000`**.

### 3. Build Frontend for Production
```bash
cd frontend
npm run build
npm run start
```

---

## 6. Seed Demo Data (Optional)

To re-seed the MongoDB Atlas database with the baseline data matching all 6 UI screenshots:
```bash
cd backend
node seedAtlas.js
```

---

## 7. Business Logic & Calculation Policies

### A. Investment Plans
Configured in `backend/src/constants/businessRules.js`:
- **Growth Plan A**: 1.0% Daily ROI | 90 Days Duration | Min Investment: ₹ 1,000
- **Growth Plan B** (Most Popular): 1.5% Daily ROI | 120 Days Duration | Min Investment: ₹ 5,000
- **Wealth Plan**: 2.0% Daily ROI | 180 Days Duration | Min Investment: ₹ 10,000
- **Premium Plan**: 2.5% Daily ROI | 365 Days Duration | Min Investment: ₹ 25,000

### B. Daily ROI Calculation Formula
```text
Daily ROI = (Investment Amount × Daily ROI Percentage) / 100
```
- Credited once daily for every active investment between `startDate` and `endDate`.
- Upon reaching `endDate`, status automatically transitions to `Completed`.

### C. Multi-Level Referral Commissions
When any user creates an investment, commissions are distributed up the sponsor hierarchy:
- **Level 1 (Direct Referrer)**: **5%** of investment amount (`Direct Income`)
- **Level 2 (Grandparent Referrer)**: **3%** of investment amount (`Level Income`)
- **Level 3 (Great-Grandparent Referrer)**: **2%** of investment amount (`Level Income`)
- Recipient wallets and cumulative totals are updated atomically.

---

## 8. Idempotency Safeguards

To prevent double-crediting in case of network retries, scheduler overlapping, or concurrent runs:

1. **Daily ROI Idempotency**:
   - Each ROI transaction is tagged with an `earningDateStr` (e.g. `2024-10-30`).
   - The `ROIHistory` schema enforces a **unique compound index**:
     ```javascript
     { investment: 1, earningDateStr: 1 } (unique)
     ```
   - If the cron job runs multiple times on the same date, existing credits are identified and safely skipped.

2. **Referral Commission Idempotency**:
   - The `ReferralIncome` schema enforces a **unique compound index**:
     ```javascript
     { user: 1, fromUser: 1, investment: 1, referralLevel: 1 } (unique)
     ```
   - Each upline sponsor is guaranteed to receive commission exactly once per investment.

---

## 9. Automated Scheduler (node-cron)

- **Schedule**: Daily at 12:00 AM (`0 0 * * *`)
- **Timezone**: `Asia/Kolkata`
- **Overlap Guard**: In-memory `isJobRunning` lock prevents concurrent executions.
- **Manual Trigger for Testing**: Evaluators can trigger processing at any time via:
  ```http
  POST /api/roi-history/process-daily
  Authorization: Bearer <token>
  ```

---

## 10. Automated Tests

The backend includes a comprehensive Jest test suite verifying:
- User registration, duplicate email rejection, and password hashing.
- JWT generation and private route protection.
- Investment creation and multi-level referral commission payout (5% Level 1).
- Minimum investment amount enforcement.
- Referral hierarchy traversal (Level 1, 2, 3 tree).
- Daily ROI calculation and **strict idempotency verification** (verifying balances do not double when the scheduler is invoked twice on the same day).

To run the automated tests:
```bash
cd backend
npm test
```

**Results**:
```text
PASS tests/nexachain.test.js
  Nexachain AI - Authentication & Security Tests
    √ should register a new user successfully and return JWT (792 ms)
    √ should reject registration with duplicate email (172 ms)
    √ should authenticate user and return valid token (198 ms)
    √ should protect private routes from unauthenticated access (26 ms)
  Nexachain AI - Investment & Referral Multi-Level Commission Tests
    √ should create investment and distribute Level 1 (5%) commission to referrer (305 ms)
    √ should reject investment if amount is below plan minimum (217 ms)
    √ should retrieve complete referral tree hierarchy for parent (255 ms)
  Nexachain AI - Daily ROI Calculation & Idempotency Safeguards
    √ should process daily ROI and prevent duplicate execution for the same day (168 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        5.206 s
```

---

## 11. Postman Collection & API Docs

- **Postman Collection**: Located at [`postman/collection.json`](file:///d:/MYMOBILEPROJECTS/postman/collection.json)
- **API Documentation**: Located at [`docs/api.md`](file:///d:/MYMOBILEPROJECTS/docs/api.md)
- **Business Rules**: Located at [`docs/business-rules.md`](file:///d:/MYMOBILEPROJECTS/docs/business-rules.md)

---

## 12. Verification & UI Alignment

All 6 screens from the `UiDesign` folder have been faithfully reproduced using **Next.js** and **inline Tailwind CSS**:
1. **Login & Registration**: Split-screen hero layout with platform highlights, login/register forms, and demo autofill.
2. **Main Dashboard**: 4 KPI cards, dual-line earnings overview chart (ROI vs Referral), recent tables, and mini referral widget.
3. **Investments Management**: 4 plan cards with duration, minimums, investment modal with projected returns calculator, and filterable history table.
4. **ROI History**: Metric cards, ROI earnings area trend chart, plan distribution donut chart, and credited returns ledger.
5. **Referral Income**: Metric cards, stacked bar chart (Direct vs Level), level-wise donut chart, and transaction history table.
6. **Referral Tree**: Zoomable and collapsible visual tree canvas with root, Level 1, Level 2, and Level 3 nodes, shareable referral link, and tree summary matrix.
