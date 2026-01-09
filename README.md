# SwiftLink — Full Stack URL Shortener

**SwiftLink** is a modern URL shortening application built with a **Node.js + Express backend** and a **React + TypeScript frontend**. The app allows users to shorten URLs, manage them, and automatically handle authentication using JWTs with refresh token rotation. You can create short links anonymously or as a registered user, list all your links, and delete links you own.

---

## Features

* Create short links (anonymous or authenticated)
* Redirect or resolve short links
* User-specific link management (list, delete)
* JWT-based authentication with automatic token refresh
* Secure backend with CORS, Helmet headers, and rate limiting
* Frontend built with React, TypeScript, TailwindCSS, and Axios for API requests

---

## Tech Stack

* **Backend:** Node.js, Express, TypeScript, MongoDB, JWT
* **Frontend:** React, TypeScript, TailwindCSS, Axios, Vite

---

## Installation

### Backend

1. Clone the repository:

* Example: `git clone https://github.com/yourusername/swiftlink-backend.git`
* Navigate into the folder: `cd swiftlink-backend`

2. Install dependencies: run `npm install`.

3. Create a `.env` file in the root directory with the following example values:

* `PORT=5000` — server port
* `MONGO_URI=mongodb://localhost:27017/swiftlink` — MongoDB connection
* `JWT_SECRET=your_jwt_secret_here` — secret for signing JWTs
* `JWT_EXPIRES_IN=900s` — access token lifetime (15 minutes)
* `REFRESH_TOKEN_EXPIRES_IN=7d` — refresh token lifetime (7 days)

4. Start the backend server in development mode: `npm run dev`
   The backend will be available at `http://localhost:5000`.

---

### Frontend

1. Navigate to the frontend folder: `cd swiftlink-frontend`.

2. Install dependencies: run `npm install`.

3. Create a `.env` file in the frontend root with:

* `VITE_API_BASE_URL=http://localhost:5000/api/v1`

4. Start the frontend development server: `npm run dev`
   Open your browser at `http://localhost:8080`.

---

## Backend API

### Authentication Routes

1. **Register:** POST `/api/v1/auth/register`

   * Body: JSON `{ "email": "user@example.com", "password": "securePassword" }`
   * Response: JSON with `accessToken` and `refreshToken`.

2. **Login:** POST `/api/v1/auth/login`

   * Body: JSON `{ "email": "user@example.com", "password": "securePassword" }`
   * Response: JSON with `accessToken` and `refreshToken`.

3. **Refresh Token:** POST `/api/v1/auth/refresh`

   * Body: JSON `{ "refreshToken": "<refreshToken>" }`
   * Response: JSON with a new `accessToken` and a rotated `refreshToken`.

4. **Logout:** POST `/api/v1/auth/logout`

   * Body: JSON `{ "refreshToken": "<refreshToken>" }`
   * Response: 204 No Content, revokes refresh token.

---

### Links Routes

1. **Create Short Link:** POST `/api/v1/links`

   * Body: JSON `{ "url": "https://www.example.com/some-page" }`
   * Authorization: optional. If user is logged in, attach `Authorization: Bearer <accessToken>`.
   * Response: JSON with the shortened link information.

2. **Resolve Short Link:** GET `/api/v1/links/:code`

   * URL parameter: `:code` is the short link code (e.g., `abc123`)
   * Response: JSON with original URL and link metadata or a redirect.

3. **Get User Links:** GET `/api/v1/links/me/links`

   * Authorization: `Bearer <accessToken>` required
   * Response: JSON array of all links owned by the authenticated user.

4. **Delete Link:** DELETE `/api/v1/links/:code`

   * Authorization: `Bearer <accessToken>` required
   * URL parameter: `:code` of the link to delete
   * Response: JSON message confirming deletion.

---

## Frontend API Integration

The frontend uses **Axios** with interceptors to handle access tokens and automatic refresh:

* `authApi` handles login, register, logout, and refresh token calls.
* `linksApi` handles link creation, resolution, fetching user links, and deletion.

The Axios instance automatically attaches the `Authorization` header for authenticated requests and refreshes expired tokens using the refresh token stored in `localStorage`.

---

## Example API Usage

* **Register User:** POST `http://localhost:5000/api/v1/auth/register` with body `{ "email": "user@example.com", "password": "securePassword" }`
* **Login User:** POST `http://localhost:5000/api/v1/auth/login` with same body
* **Create Link:** POST `http://localhost:5000/api/v1/links` with body `{ "url": "https://www.example.com/pro" }` and optional `Authorization` header
* **Get User Links:** GET `http://localhost:5000/api/v1/links/me/links` with `Authorization: Bearer <accessToken>`
* **Resolve Short Link:** GET `http://localhost:5000/api/v1/links/abc123`
* **Delete Link:** DELETE `http://localhost:5000/api/v1/links/abc123` with `Authorization: Bearer <accessToken>`
* **Refresh Token:** POST `http://localhost:5000/api/v1/auth/refresh` with `{ "refreshToken": "<refreshToken>" }`

---

## Security

* **Helmet:** HTTP header hardening to prevent XSS, clickjacking, and MIME sniffing
* **CORS:** Only allows requests from the frontend origin
* **Rate Limiting:** Prevents brute-force attacks
* **JWT Tokens:** Short-lived access tokens with refresh token rotation
* **Restricted HTTP Methods:** Only GET, POST, DELETE allowed globally

---

## Notes

* The backend listens on `http://localhost:5000` and frontend on `http://localhost:8080`. Adjust environment variables if deploying.
* Short links are unique codes (e.g., `abc123`) and resolve to the original URL.
* Access tokens are stored in memory; refresh tokens are stored in `localStorage`.
* All endpoints and examples use placeholder domains (`example.com`) to make it easier to test.

---

## License

MIT License

---


