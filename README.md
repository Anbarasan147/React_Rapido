# Rapido Mobile App Clone (Educational Frontend Mockup)

A pixel-perfect, high-fidelity frontend clone of the **Rapido** mobile application, built using React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion, and React Leaflet. 

This project is built strictly for **educational and portfolio demonstration purposes**. It uses simulated data services, mock routing, and local storage persistence. It does not connect to any official Rapido backend servers or collect real financial/payment data.

---

## 🚀 Key Features

### 1. High-Fidelity Onboarding & Auth Flow
*   **Splash Screen:** Animated loading screen with a custom vector logo and auto-routing.
*   **Onboarding Slider:** A swipeable tutorial carousel demonstrating core services (Bike, Auto, Delivery) with micro-animations.
*   **Mobile Login:** Numeric validation for phone numbers (standard $+91$ prefix).
*   **SMS OTP Mock:** Simulated push notification that pops up showing the verification code `123456`. Typing is auto-focused across 6 fields.
*   **Profile Creation:** Styled registration form capturing Name, Email, and Gender chips.

### 2. Interactive Map Dashboard & Location Search
*   **Responsive Leaflet Map:** Custom dark-mode styling applied to OpenStreetMap tiles, showing local drivers around Indiranagar, Bengaluru.
*   **Sidebar Drawer:** Slides in from the left to access secondary menus (Wallet, History, Settings, Help).
*   **Address Shortcuts:** One-click shortcuts for Home, Work, and customized addresses.
*   **Linked Location Search:** Dual pickup and drop-off search fields with autocomplete suggestions and swap controls.

### 3. Ride Booking & Matching Simulation
*   **Ride Selector Sheet:** Lists vehicle categories (Bike, Auto, Cab, Parcel) with calculated fares (using the Haversine formula) and live ETAs.
*   **Coupons & Discounts:** Coupon application sheet to apply promo codes (e.g. `BIKE50` for 50% off).
*   **Payment Methods:** Select from Cash, Rapido Wallet, Google Pay, or Paytm.
*   **Pulsing Radar Search:** Implements a radar search animation while simulated matching is active.

### 4. Assigned Captain & Chat Simulator
*   **Driver Assigned Panel:** Shows driver photo, rating, vehicle name, plate number, and a secure trip PIN OTP.
*   **SMS Calling Mock:** High-fidelity simulated calling overlay with ringing states.
*   **Active Captain Chat:** Tap pre-written message chips (e.g., *"I've arrived"*, *"Please bring a helmet"*) to send messages, and receive automated, context-aware driver responses.

### 5. Live Tracking, Invoices & Ratings
*   **Route Plotting:** Renders route paths dynamically on the map.
*   **Driver Movement:** Animates the driver marker heading along the route in real-time.
*   **Trip Completion Receipt:** Displays the final fare, payment mode, and route info.
*   **Driver Rating & Reviews:** 5-star interactive rating, feedback tags, and comments box.

### 6. Secondary Application Sections
*   **My Rides:** Lists past rides read from local storage, with a modal invoice sheet showing full details.
*   **Wallet & Payments:** Top-up simulated wallet money, check transaction statements, and copy coupon codes.
*   **Help & Support:** Toggleable accordions for FAQs and a live support chatbot drawer.
*   **Settings & Edit Profile:** Manage custom saved addresses and update account details.

---

## 🛠️ Tech Stack & Utilities

*   **Core:** React 18, Vite, TypeScript
*   **Styling:** Tailwind CSS v4, CSS Custom Variables, Lucide Icons
*   **Map System:** Leaflet, React Leaflet (custom dark theme filters)
*   **Animations:** Framer Motion (page transitions, drag gestures, loaders)
*   **Persistence:** HTML5 `localStorage` for profile, address, and ride history updates
*   **Responsive Container:** Custom `MobileFrame` wrapper that displays the application inside an interactive smartphone frame on desktops, and scales fluidly on mobile devices.

---

## 📂 Project Architecture

```
src/
├── assets/             # Branding assets, vector logos
├── components/         # Reusable atomic UI components (Button, Input, BottomSheet, MapContainer, StarRating)
├── context/            # AuthContext (login state, profile, addresses) & BookingContext (fares, driver tracking)
├── mock-data/          # Core mock records (payment methods, promo codes, driver profiles, locations)
├── pages/              # Page layouts (Splash, Onboarding, Login, OTP, Home, Booking, Tracking, History, etc.)
├── types/              # Global TypeScript interfaces
├── index.css           # Tailwind v4 configuration, map filters, custom scrollbars
└── main.tsx            # Application entrypoint
```

---

## 📦 Getting Started

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   npm (v9.0.0 or higher)

### Setup Instructions
1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the local development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 🔧 Developer Testing Shortcuts
To help test the ride booking flow without waiting for the natural timers to finish, we've built-in floating **Dev Controls** on the map screens:
1.  **On the Assigned Driver Screen:** Click `Start Ride` to bypass the driver's arrival phase and immediately launch the transit phase.
2.  **On the Live Tracking Screen:** Click `Force Arrive` to instantly reach the destination, bypass the transit timer, and show the receipt page.
3.  **On the OTP Verification Screen:** Tap the simulated message banner at the top to automatically populate the verification code `123456`.
