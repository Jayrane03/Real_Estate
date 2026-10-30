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
   CLIENT_ORIGIN=http://localhost:5173,https://real-estate-frontend-9fkk.onrender.com
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

   If port 5000 is already in use, choose a different port:

   ```powershell
   $env:PORT = '5001'
   npm run dev
   ```

5. Start the website in a second terminal:

   ```powershell
   cd client
   $env:VITE_API_PROXY_TARGET = 'http://localhost:5001'
   npm run dev
   ```

   The frontend auto-detects a healthy API on ports 5000–5009 if no proxy target is configured. An explicit `VITE_API_PROXY_TARGET` takes precedence.

## Open the app

- Website and admin dashboard: http://localhost:5173
- Admin sign-in: http://localhost:5173/admin/sign-in
- API health check: http://localhost:5000/api/health

Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.

## Deployment

The deployed API is available at:

- API: https://real-estate-6q4b.onrender.com
- Health check: https://real-estate-6q4b.onrender.com/api/health

The frontend API service uses `http://localhost:5000/api` in local Vite development and `https://real-estate-6q4b.onrender.com/api` in production builds. Ensure the local API is running on port 5000 before using the local frontend.

In the Render backend environment, set `CLIENT_ORIGIN` to the deployed frontend origin (`https://real-estate-frontend-9fkk.onrender.com`). Separate multiple origins with commas, for example `http://localhost:5173,https://real-estate-frontend-9fkk.onrender.com`. Keep `MONGODB_URI` and a random `JWT_SECRET` configured there. Production admin login uses secure cross-site cookies, so the frontend must use HTTPS and the origin must match `CLIENT_ORIGIN`.
