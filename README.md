### 🌐 MedFinder

A modern web platform designed to help users discover nearby pharmacies, check medicine availability, and purchase medicines seamlessly.
Admins get full control over pharmacy inventory, while customers enjoy a fast and intuitive medicine search experience.

---

### 🚀 Overview

- MedFinder combines location-based search, inventory management, and smart medicine discovery into one clean UI.

- Customers can search for medicines across multiple pharmacies

- The platform detects nearby pharmacies automatically using GPS + OpenStreetMap

- Real-time cart & checkout flow

- Admins can add/edit/delete pharmacies and manage all medicine stock

- The goal is to create a smooth medical discovery experience while giving pharmacy owners a simple management dashboard.

---

### ⭐ Key Features

#### 🔎 Smart Medicine Finder

- Fuzzy search for medicine names

- Filter by pharmacy, price range, stock status

- Quick view of pharmacy address & contact details



#### 🏪 Pharmacy Management (Admin)

- Add new pharmacies

- Update details and manage inventory

- Add/Remove medicines

- Delete pharmacy with confirmation flow



#### 🛒 Customer Shopping Flow

- Add medicines to cart with custom quantity

- Real-time cart total

- Remove items / clear cart

- Smooth checkout experience



#### 📍 Location-Based Pharmacy Detection

- Auto-detects user's location

- Loads pharmacies within a 5km radius

- Sorts by distance

- Click to open directions in Google Maps

- Interactive map using Leaflet + OpenStreetMap


#### 👤 Authentication

- Login & Register

- Role-based UI (Admin vs Customer)

- Persistent session stored in localStorage

#### 🎨 Clean UI/UX

- Modern animations, hover effects, transitions

- Dashboard landing page

- Responsive layout

---

### 🛠 Tech Stack

#### Frontend

- React (Vite)

- Context API (Auth, Cart, Map)

- Axios

- Leaflet (Maps)

- Tailored CSS animations & transitions

#### Backend

- Node.js

- Express

- MongoDB (Atlas / Local)

---

### 🧩 Getting Started

#### 1️⃣ Clone the repository
```
git clone https://github.com/your-username/medfinder.git
cd medfinder
```


#### 2️⃣ Backend Setup
```
cd backend
npm install
npm start
```


Default URL:
http://localhost:5000


#### Environment variables (backend/.env):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```


#### 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```


Frontend runs on:
http://localhost:5173

---

### 📌 Additional Design Notes

- Role-based UI: Customer sees cart; admin sees management tools

- Local caching: Cart + Auth stored in localStorage

- Error-safe UX: Toasts for login, logout, cart, CRUD actions

- Reusable components: PharmacyCard, AddToCartModal, MapContext

- Scalable architecture: Easy to expand into ordering, delivery, or pharmacy onboarding flows

---

### 🏁 Conclusion

MedFinder delivers a complete, polished solution for medicine discovery, pharmacy management, and location-based services, built with clean code and a professional architecture suitable for real-world deployment.