# Aurelia API

Express and MongoDB REST API used by the React client.

## Local setup

1. Start MongoDB locally, or set `MONGODB_URI` to your MongoDB connection string.
2. Copy `server/.env.example` to `server/.env` and set a unique `JWT_SECRET` (at least 32 characters) and `ADMIN_PASSWORD` (at least 12 characters).
3. Install each app from the repository root: `npm install --prefix server` and `npm install --prefix client`.
4. Create the first admin account with `npm --prefix server run seed:admin`.
5. Start the API with `npm --prefix server run dev` and the client with `npm --prefix client run dev` in separate terminals.

The frontend API service calls `http://localhost:5000/api` during local Vite development and `https://real-estate-6q4b.onrender.com/api` in production builds. Configure `CLIENT_ORIGIN` on the API to allow the deployed frontend origin.

## API layout

Requests are mounted in `src/routes/index.js`. Route files attach validation and authentication middleware before calling controllers. Controllers handle HTTP behavior and persistence through Mongoose models. `src/middleware/errorHandler.js` formats uncaught API errors in one place.

Public routes: `GET /api/health`, `GET /api/properties`, `GET /api/properties/:slug`, and `POST /api/inquiries`.

Authentication routes: `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`.

Admin routes require an active JWT session: `GET /api/admin/dashboard`, property CRUD and publish routes under `/api/admin/properties`, inquiry list/status routes under `/api/admin/inquiries`, `GET|PUT /api/admin/content`, and `GET /api/admin/activity`.