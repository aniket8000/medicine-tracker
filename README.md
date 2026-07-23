### 🌐 MedFinder

A modern web platform designed to help users discover nearby pharmacies, check medicine availability, and purchase medicines seamlessly.
Admins get full control over pharmacy inventory, while customers enjoy a fast and intuitive medicine search experience.

---

### 🚀 Overview

- MedFinder combines location-based search, inventory management, and smart medicine discovery into one clean UI.

- Customers can search for medicines across multiple pharmacies

- The platform detects nearby pharmacies automatically using GPS + OpenStreetMap

- Real-time cart, checkout, and order confirmation flow (with email receipts)

- Admins can add/edit/delete pharmacies and manage all medicine stock

- The goal is to create a smooth medical discovery experience while giving pharmacy owners a simple management dashboard.

---

### ⭐ Key Features

#### 🔎 Smart Medicine Finder

- Fuzzy search for medicine names

- Filter by pharmacy, price range, stock status

- Quick view of pharmacy address & contact details

- Paginated results (12 per page) for browsing large catalogs



#### 🏪 Pharmacy Management (Admin)

- Add new pharmacies

- Update details and manage inventory

- Add/Remove medicines

- Delete pharmacy with confirmation flow

- All write actions require an authenticated admin (JWT + role check)



#### 🛒 Customer Shopping Flow

- Add medicines to cart with custom quantity

- Real-time cart total

- Remove items / clear cart

- Full checkout flow backed by a real `Order` model — orders are saved, not just simulated

- Order confirmation screen shows a real order ID, plus an emailed receipt



#### 📍 Location-Based Pharmacy Detection

- Auto-detects user's location

- Loads pharmacies within a 5km radius via OpenStreetMap Overpass API

- Sorts by distance

- Click to open directions in Google Maps, using your real GPS coordinates as the route origin

- Interactive map using Leaflet + OpenStreetMap


#### 👤 Authentication & Security

- Login & Register with JWT-based sessions

- Role-based UI and route protection (Admin vs Customer) — core pages require login, Map/Contact stay public

- Session is verified against the backend on every app load (a stale/invalid token is silently logged out, not trusted blindly)

- Forgot/Reset password flow with real email delivery (Nodemailer + Gmail SMTP)

- Backend input validation (`express-validator`) on all auth, pharmacy, and order routes

- CORS restricted to the configured frontend origin, plus API rate limiting (with a stricter cap on auth endpoints to slow brute-force attempts)

#### 📩 Contact & Info Pages

- About Us, Contact Support, and Privacy Policy pages, linked from both the navbar and footer

- Contact form sends a real email to the site admin via the same Gmail SMTP integration

#### 🎨 Clean UI/UX

- Modern animations, hover effects, transitions

- Full landing-page style Dashboard (features, how-it-works, live stats pulled from the database, CTA)

- Light/dark theme toggle (persisted per browser)

- Accessible modals: Escape-to-close and focus-trapping

- Responsive layout

---

### 🛠 Tech Stack

#### Frontend

- React (Create React App / `react-scripts`)

- React Router

- Context API (Auth, Cart, Map)

- Axios (single shared instance with auth-token interceptor)

- Leaflet + React-Leaflet (Maps)

- Fuse.js (fuzzy search)

- Tailored CSS design system (custom properties for light/dark theming, animations, transitions)

#### Backend

- Node.js + Express

- MongoDB (Atlas or local) via Mongoose

- JWT auth (`jsonwebtoken`, `bcryptjs`)

- `express-validator` for request validation

- `express-rate-limit` for abuse protection

- `nodemailer` for password-reset, order-confirmation, and contact-form emails

---

### 🧩 Getting Started

#### 1️⃣ Clone the repository
```
git clone https://github.com/aniket8000/medicine-tracker.git
cd medicine-tracker
```


#### 2️⃣ Backend Setup
```
cd medicine-tracker-backend
npm install
npm start
```

Default URL:
http://localhost:5000

#### Environment variables (`medicine-tracker-backend/.env`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

`EMAIL_USER`/`EMAIL_PASS` power password-reset, order-confirmation, and contact-form emails via Gmail SMTP — generate an App Password at https://myaccount.google.com/apppasswords (requires 2-Step Verification on the account).

#### Optional: Seed demo data
```
npm run seed
```
Wipes existing pharmacies and inserts 100+ demo pharmacies stocked with 100+ real-sounding medicines across Delhi-NCR, for a realistic browsing experience.


#### 3️⃣ Frontend Setup
```
cd medicine-tracker-frontend
npm install
npm start
```

Frontend runs on:
http://localhost:3000

#### Environment variables (`medicine-tracker-frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 📌 Additional Design Notes

- Role-based UI: Customer sees cart; admin sees management tools

- Local caching: Cart + Auth stored in localStorage; auth session is re-verified against the backend on load

- Error-safe UX: Toasts and inline messages for login, logout, cart, and CRUD actions

- Reusable components: `PharmacyCard`, `AddToCartModal`, `Modal` (accessible dialog wrapper), `Pagination`, `MapContext`

- Scalable architecture: Easy to expand into order history views, payment gateway integration, or pharmacy onboarding flows

---

### 🏁 Conclusion

MedFinder delivers a complete, polished solution for medicine discovery, pharmacy management, and location-based services, built with clean code and a professional architecture suitable for real-world deployment.
