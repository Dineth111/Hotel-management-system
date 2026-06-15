# 🏨 Hotel Lanka Pro — Hotel Management System

A full-featured Hotel Booking & Management System built with the **MERN Stack** (MongoDB, Express, React, Node.js).

![Hotel Lanka Pro](https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

### Customer Portal
- 🔐 **Session-Based Authentication** — Secure login/register using `express-session` and `connect-mongo`
- 🛏️ **Room Browsing** — Browse all available rooms with photos, amenities, and pricing
- 📅 **Real-time Availability** — Check availability by dates and guest count with overlap validation
- 📋 **My Bookings** — Track personal booking history and status (Pending → Approved → Checked In → Checked Out)
- 💬 **Contact & Inquiries** — Submit messages to the hotel management
- ❓ **FAQ Page** — Frequently asked questions
- 📄 **Terms of Service & Privacy Policy** pages

### Admin Dashboard
- 📊 **Live Metrics** — Today's check-ins, monthly revenue, occupancy statistics
- ✅ **Booking Management** — Approve/reject bookings with date collision detection
- 🏠 **Room Management** — Full CRUD for room listings with multiple photo uploads
- 📩 **Contact Messages** — Read/unread message inbox for customer inquiries
- 🎟️ **Coupon System** — Create and manage discount coupons
- ⭐ **Reviews Management** — Manage customer reviews
- ⚙️ **Global Settings** — Modify hotel-wide settings

### Notification System
- 📱 **Automated WhatsApp Notifications** — Sends real WhatsApp messages to customers using `whatsapp-web.js` for booking confirmations, approvals, check-in, and check-out
- 📧 **Email Alerts** — Nodemailer-powered email notifications for bookings (requires Gmail App Password)
- 🗑️ **Automatic File Cleaning** — Purges unlinked room or settings images from disk when listings are deleted or edited

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Chrome browser installed (required for WhatsApp notifications)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Dineth111/Hotel-management-system.git
cd Hotel-management-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_random_secret_string

# Email Notifications (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Twilio SMS (Optional — WhatsApp will be used if not set)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
```

> **📌 Gmail App Password Setup** (Required to fix email errors):
> 1. Go to your [Google Account](https://myaccount.google.com/) → **Security**
> 2. Make sure **2-Step Verification** is **ON**
> 3. Search for **App Passwords**
> 4. Create a new App Password (name it "NodeJS App")
> 5. Paste the generated 16-character password into `EMAIL_PASS` in your `.env`

---

### 3. Seed the Database
Populate the database with a default admin account, settings, and 6 sample rooms:

```bash
node seed.js
```

**Default Admin Credentials:**
- **Email**: `admin@gmail.com`
- **Password**: `123`

---

### 4. Start the Backend Server

```bash
npm run dev
```

The server starts on **port 5000**.

---

### 5. 📱 WhatsApp Notifications Setup

When the server starts for the first time, a **QR code** will appear in your terminal:

```
========================================
  📱 WHATSAPP SETUP - SCAN QR CODE BELOW
========================================
```

**To link WhatsApp:**
1. Open **WhatsApp** on your phone
2. Go to **Settings → Linked Devices → Link a Device**
3. Scan the QR code shown in the terminal
4. You'll see: `✅ [WhatsApp] Client is ready!`

All future booking notifications (Pending, Approved, Check-in, Check-out) will now be sent as **real WhatsApp messages** automatically!

> **Note:** The WhatsApp session is saved locally. You won't need to scan the QR code every time unless you remove the linked device.

---

### 6. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The React client will start at **http://localhost:5173**

---

## 🔑 Default Access

| Role     | URL                                        | Email              | Password |
|----------|--------------------------------------------|--------------------|----------|
| Customer | http://localhost:5173/register             | *(register yourself)* | —     |
| Admin    | http://localhost:5173/admin/login          | admin@gmail.com    | 123      |

---

## 🧰 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React, Vite, Tailwind CSS, Lucide Icons |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB Atlas + Mongoose                |
| Auth      | express-session + connect-mongo         |
| Emails    | Nodemailer (Gmail)                      |
| WhatsApp  | whatsapp-web.js + qrcode-terminal       |
| File Upload | Multer                               |

---

## 📁 Project Structure

```
hotel-lanka/
├── backend/
│   ├── config/         # Database connection
│   ├── models/         # Mongoose data models
│   ├── routes/         # Express API routes
│   ├── utils/          # Email, WhatsApp & SMS services
│   ├── uploads/        # Uploaded room images
│   ├── server.js       # Main Express server
│   └── seed.js         # Database seeder
│
└── frontend/
    └── src/
        ├── components/ # Reusable UI components (Navbar, Footer, etc.)
        ├── context/    # Auth context
        └── pages/      # All page components (Home, Rooms, Admin, etc.)
```

---

## 📄 License

This project is for educational and demonstration purposes.

**Crafted with ❤️ for Hotel Lanka Pro — Luxury Getaways in Sri Lanka**
