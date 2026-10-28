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
â”œâ”€â”€ frontend/                     # Next.js Frontend with Inline Tailwind CSS
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â””â”€â”€ favicon.svg           # Nexachain AI branded vector icon
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ app/                  # Next.js App Router Pages
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.jsx        # Root Layout with AuthProvider & Toaster
â”‚   â”‚   â”‚   â”œâ”€â”€ globals.css       # Base Tailwind styling & scrollbars
â”‚   â”‚   â”‚   â”œâ”€â”€ page.jsx          # Root Entry (redirects to /dashboard or /login)
â”‚   â”‚   â”‚   â”œâ”€â”€ login/page.jsx    # Split-screen Auth Page (UI Design #1)
â”‚   â”‚   â”‚   â”œâ”€â”€ register/page.jsx # Registration with sponsor referral validation
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard/page.jsx# Main Overview Dashboard (UI Design #2)
â”‚   â”‚   â”‚   â”œâ”€â”€ investments/page.jsx# Investment Plans & History (UI Design #3)
â”‚   â”‚   â”‚   â”œâ”€â”€ roi-history/page.jsx# Daily ROI Tracking & Charts (UI Design #4)
â”‚   â”‚   â”‚   â”œâ”€â”€ referral-income/page.jsx# Level Income & Charts (UI Design #5)
â”‚   â”‚   â”‚   â”œâ”€â”€ referral-tree/page.jsx  # Interactive Tree Visualizer (UI Design #6)
â”‚   â”‚   â”‚   â”œâ”€â”€ wallet/page.jsx   # Wallet & Settlement View
â”‚   â”‚   â”‚   â”œâ”€â”€ profile/page.jsx  # User Profile Details
â”‚   â”‚   â”‚   â””â”€â”€ settings/page.jsx # Notification & Security Preferences
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ common/           # Reusable UI Components
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ Button.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ Input.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ Modal.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ StatusBadge.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ Pagination.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ LoadingState.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ EmptyState.jsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ ErrorState.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ layout/           # Shared Navigation & Shell
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ AppLayout.jsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ Sidebar.jsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ Header.jsx
â”‚   â”‚   â”‚   â””â”€â”€ dashboard/
â”‚   â”‚   â”‚       â””â”€â”€ StatCard.jsx  # Configurable KPI Card Component
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â””â”€â”€ AuthContext.jsx   # Global User Session & Balance Store
â”‚   â”‚   â”œâ”€â”€ features/             # Feature-specific API Clients
â”‚   â”‚   â”‚   â”œâ”€â”€ auth/authApi.js
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard/dashboardApi.js
â”‚   â”‚   â”‚   â”œâ”€â”€ investments/investmentsApi.js
â”‚   â”‚   â”‚   â”œâ”€â”€ roi/roiApi.js
â”‚   â”‚   â”‚   â””â”€â”€ referrals/referralsApi.js
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ apiClient.js      # Central Axios client with JWT interceptor
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”‚   â”œâ”€â”€ currency.js       # Indian Rupee (INR) formatters
â”‚   â”‚   â”‚   â”œâ”€â”€ date.js           # Date and timestamp formatters
â”‚   â”‚   â”‚   â””â”€â”€ errorHandler.js   # Unified API error extractor
â”‚   â”‚   â””â”€â”€ constants/
â”‚   â”‚       â”œâ”€â”€ routes.js         # Centralized route definitions
â”‚   â”‚       â””â”€â”€ navigation.js     # Sidebar menu configuration
â”‚   â”œâ”€â”€ next.config.js            # Next.js configuration & API reverse proxy
â”‚   â”œâ”€â”€ tailwind.config.js        # Brand color extensions & font definitions
â”‚   â”œâ”€â”€ .env                      # Frontend environment settings
â”‚   â””â”€â”€ package.json
â”‚
â”œâ”€â”€ backend/                      # Layered Express.js Backend Architecture
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”‚   â”œâ”€â”€ env.js            # Environment validation
â”‚   â”‚   â”‚   â”œâ”€â”€ database.js       # MongoDB Atlas connection manager
â”‚   â”‚   â”‚   â””â”€â”€ cors.js           # CORS whitelisting & security
â”‚   â”‚   â”œâ”€â”€ models/               # The 4 Core Mongoose Models
â”‚   â”‚   â”‚   â”œâ”€â”€ User.js           # Users & wallet balances
â”‚   â”‚   â”‚   â”œâ”€â”€ Investment.js     # Investments & plan details
â”‚   â”‚   â”‚   â”œâ”€â”€ ROIHistory.js     # Daily credited returns (idempotent key)
â”‚   â”‚   â”‚   â””â”€â”€ ReferralIncome.js # Multi-level referral commission ledger
â”‚   â”‚   â”œâ”€â”€ controllers/          # HTTP Request/Response Handlers
â”‚   â”‚   â”‚   â”œâ”€â”€ authController.js
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboardController.js
â”‚   â”‚   â”‚   â”œâ”€â”€ investmentController.js
â”‚   â”‚   â”‚   â”œâ”€â”€ roiController.js
â”‚   â”‚   â”‚   â””â”€â”€ referralController.js
â”‚   â”‚   â”œâ”€â”€ services/             # Core Business Logic & Calculations
â”‚   â”‚   â”‚   â”œâ”€â”€ authService.js
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboardService.js
â”‚   â”‚   â”‚   â”œâ”€â”€ investmentService.js
â”‚   â”‚   â”‚   â”œâ”€â”€ roiService.js     # Daily ROI execution & idempotency
â”‚   â”‚   â”‚   â””â”€â”€ referralService.js# Hierarchy traversal & level commission
â”‚   â”‚   â”œâ”€â”€ routes/               # Express Endpoint Routers
â”‚   â”‚   â”‚   â”œâ”€â”€ authRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboardRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ investmentRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ roiRoutes.js
â”‚   â”‚   â”‚   â””â”€â”€ referralRoutes.js
â”‚   â”‚   â”œâ”€â”€ middleware/           # Reusable Middlewares
â”‚   â”‚   â”‚   â”œâ”€â”€ authenticate.js   # JWT verification & active status check
â”‚   â”‚   â”‚   â”œâ”€â”€ authorize.js      # Account authorization
â”‚   â”‚   â”‚   â”œâ”€â”€ validateRequest.js# Express-validator error pipeline
â”‚   â”‚   â”‚   â”œâ”€â”€ rateLimiter.js    # Auth & API abuse prevention
â”‚   â”‚   â”‚   â”œâ”€â”€ notFound.js       # 404 handler
â”‚   â”‚   â”‚   â””â”€â”€ errorHandler.js   # Centralized error handler
â”‚   â”‚   â”œâ”€â”€ validators/           # Request input validators
â”‚   â”‚   â”‚   â”œâ”€â”€ authValidator.js
â”‚   â”‚   â”‚   â””â”€â”€ investmentValidator.js
â”‚   â”‚   â”œâ”€â”€ jobs/
â”‚   â”‚   â”‚   â””â”€â”€ roiScheduler.js   # Automated node-cron 12:00 AM scheduler
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”‚   â”œâ”€â”€ AppError.js       # Operational error class
â”‚   â”‚   â”‚   â”œâ”€â”€ asyncHandler.js   # Async controller wrapper
â”‚   â”‚   â”‚   â””â”€â”€ logger.js         # Structured logger
â”‚   â”‚   â”œâ”€â”€ constants/
â”‚   â”‚   â”‚   â””â”€â”€ businessRules.js  # Centralized business parameters & rates
â”‚   â”‚   â”œâ”€â”€ app.js                # Express Application Setup
â”‚   â”‚   â””â”€â”€ server.js             # HTTP Server & DB bootstrap
â”‚   â”œâ”€â”€ tests/
â”‚   â”‚   â””â”€â”€ nexachain.test.js     # Complete Automated Test Suite (Jest)
â”‚   â”œâ”€â”€ seedAtlas.js              # Atlas seeder script
â”‚   â”œâ”€â”€ .env                      # Backend environment settings
â”‚   â””â”€â”€ package.json
â”‚
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ api.md                    # Detailed REST API Documentation
â”‚   â””â”€â”€ business-rules.md         # Financial formulas & idempotency rules
â”œâ”€â”€ postman/
â”‚   â””â”€â”€ collection.json           # Ready-to-import Postman collection
â”œâ”€â”€ UiDesign/                     # The 6 approved UI Design Screenshots
â”œâ”€â”€ package.json                  # Root scripts
â””â”€â”€ README.md
```

---

## 4. Database Setup (MongoDB Atlas)

The project is connected to the **MongoDB Atlas Cluster** database `naxachain`:

```text
mongodb+srv://<username>:<password>@cluster0.sf919.mongodb.net/naxachain?retryWrites=true&w=majority
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
- **Growth Plan A**: 1.0% Daily ROI | 90 Days Duration | Min Investment: â‚¹ 1,000
- **Growth Plan B** (Most Popular): 1.5% Daily ROI | 120 Days Duration | Min Investment: â‚¹ 5,000
- **Wealth Plan**: 2.0% Daily ROI | 180 Days Duration | Min Investment: â‚¹ 10,000
- **Premium Plan**: 2.5% Daily ROI | 365 Days Duration | Min Investment: â‚¹ 25,000

### B. Daily ROI Calculation Formula
```text
Daily ROI = (Investment Amount Ã— Daily ROI Percentage) / 100
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
    âˆš should register a new user successfully and return JWT (792 ms)
    âˆš should reject registration with duplicate email (172 ms)
    âˆš should authenticate user and return valid token (198 ms)
    âˆš should protect private routes from unauthenticated access (26 ms)
  Nexachain AI - Investment & Referral Multi-Level Commission Tests
    âˆš should create investment and distribute Level 1 (5%) commission to referrer (305 ms)
    âˆš should reject investment if amount is below plan minimum (217 ms)
    âˆš should retrieve complete referral tree hierarchy for parent (255 ms)
  Nexachain AI - Daily ROI Calculation & Idempotency Safeguards
    âˆš should process daily ROI and prevent duplicate execution for the same day (168 ms)

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
#   N e x a c h a i n A I - P r o j  
 
