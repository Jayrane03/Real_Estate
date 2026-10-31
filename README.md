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
   PORT=5002
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

5. Start the website in a second terminal:

   ```powershell
   cd client
   npm run dev
   ```

   Local development uses port 5002 for the API and port 5173 for the frontend. If port 5002 is already occupied, stop the other process using it before starting the API.

## Open the app

- Website and admin dashboard: http://localhost:5173
- Admin sign-in: http://localhost:5173/admin/sign-in
- API health check: http://localhost:5002/api/health

Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.

## Deployment

The deployed API is available at:

- API: https://real-estate-6q4b.onrender.com
- Health check: https://real-estate-6q4b.onrender.com/api/health

The frontend API service uses the Vite `/api` proxy to reach `http://localhost:5002/api` in local development and calls `https://real-estate-6q4b.onrender.com/api` in production builds.

### Fix direct navigation and refresh on Render

The frontend uses React Router, so the Render static site must rewrite unknown application routes to `index.html`. In the frontend static site's Render Dashboard, open **Settings → Redirects/Rewrites** and add:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | **Rewrite** |

Use **Rewrite**, not Redirect, so the browser stays on the requested route. Render serves existing static files before applying this fallback.

The local `server/.env` file is not deployed. In the Render API service's Environment settings, configure `MONGODB_URI`, a random `JWT_SECRET` (at least 32 characters), and `CLIENT_ORIGIN` with the exact deployed frontend origin (`https://real-estate-frontend-9fkk.onrender.com`). Separate multiple origins with commas, for example `http://localhost:5173,https://real-estate-frontend-9fkk.onrender.com`. Render provides the service `PORT`.

Admin authentication uses an HttpOnly, Secure, SameSite=None cookie; no JWT is stored in browser localStorage. The frontend and API must both use HTTPS in deployment. Redeploy the API and frontend after pulling changes.
