# Aurelia Real Estate CMS

A React website and admin dashboard backed by an Express API and MongoDB.

## Requirements

- Node.js 20 or newer
- MongoDB running locally, or a MongoDB connection string

## Setup

1. Install the two apps from the project root:

   ```powershell
   npm install --prefix server
   npm install --prefix client
   ```

2. Create `server/.env` with your MongoDB connection and local admin details:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/aurelia-estates
   JWT_SECRET=put-a-random-secret-of-at-least-32-characters-here
   JWT_EXPIRES_IN=8h
   CLIENT_ORIGIN=http://localhost:5173
   ADMIN_NAME=Site Administrator
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=use-a-password-of-at-least-12-characters
   ```

   If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Keep `server/.env` private and do not commit it.

3. Make sure MongoDB is running, then create the admin account:

   ```powershell
   npm --prefix server run seed:admin
   ```

4. Start the API in one terminal:

   ```powershell
   cd server
   npm run dev
   ```

5. Start the website in a second terminal:

   ```powershell
   cd client
   npm run dev
   ```

## Open the app

- Website and admin dashboard: http://localhost:5173
- Admin sign-in: http://localhost:5173/admin/sign-in
- API health check: http://localhost:5000/api/health

Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.
