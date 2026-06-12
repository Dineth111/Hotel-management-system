# Hotel Lanka Pro - Hotel Booking System

A complete Hotel Booking System built using the MERN Stack. 

## Features
- **Session-Based Authentication**: Implemented using `express-session` and `connect-mongo` (No JWT).
- **Public Customer Portal**: Browse rooms, check availability by dates and guest counts, submit contact inquiries, and track personal booking histories.
- **Admin Dashboard Portal**: Inspect live metrics (today's check-ins, monthly revenue), approve/reject bookings with date overlap collision validation, CRUD room listings (multiple photo uploads), read/unread message drawers, and modify global settings.
- **Automatic File Cleaning**: Purges unlinked room or settings images from the local disk when room listings are deleted or edited.

---

## Installation & Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create the uploads directory:
   ```bash
   mkdir uploads
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. 
   ```

### 2. Database Seeding
Seed the database with the default admin credentials, settings, and 6 sample rooms:
```bash
node seed.js
```
*Note: Seeding creates the admin account:*
- **Email**: `admin@gmail.com`
- **Password**: `123`

### 3. Start Backend Server
```bash
npm run dev
```
The server will start running on port `5000`.

---

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React client dev server:
   ```bash
   npm run dev
   ```
The client application will start running on `http://localhost:5173`.

---

## Default Portal Credentials
- **Customer Registration**: Available on the public header links `/register`.
- **Admin Portal Access**: Navigate to `http://localhost:5173/admin/login`
  - **Email**: `admin@gmail.com`
  - **Password**: `123`
