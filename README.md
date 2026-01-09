🚀 SwiftLink — Full Stack URL Shortener

SwiftLink is a production-grade URL shortening service built with a Layered Architecture (N-Tier). It features a robust Node.js/TypeScript backend and a modern React/Vite frontend, focusing on security, scalability, and clean code.

🏗️ Architecture Overview

The system is designed with strict Separation of Concerns:

API Layer: Express routes and security middleware.

Controller Layer: Orchestrates HTTP requests and responses.

Service Layer: Core business logic (Short-code generation, validation).

Persistence Layer: Data models and MongoDB interaction via Mongoose.

✨ Features

Anonymous & Authenticated Shortening: Create links with or without an account.

Link Management: Users can list, track, and delete their own links.

JWT Security: Short-lived access tokens with Refresh Token Rotation.

Hardened Security: Protected by Helmet, CORS, and Rate Limiting.

Responsive UI: Modern dashboard built with React and TailwindCSS.

🛠️ Tech Stack

Layer

Technology

Backend

Node.js, Express, TypeScript

Database

MongoDB (Mongoose ODM)

Frontend

React, Vite, TypeScript, TailwindCSS

Security

JWT, Bcrypt, Helmet.js, Express-Rate-Limit

API Client

Axios (with Interceptors for Auto-Refresh)

🚀 Installation & Setup

1. Backend Setup

# Navigate to backend
cd swiftlink-backend

# Install dependencies
npm install

# Configure Environment (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/swiftlink
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=900s        # 15 minutes
REFRESH_TOKEN_EXPIRES_IN=7d


2. Frontend Setup

# Navigate to frontend
cd swiftlink-frontend

# Install dependencies
npm install

# Configure Environment (.env)
VITE_API_BASE_URL=http://localhost:5000/api/v1


📡 API Documentation

Auth Endpoints (/api/v1/auth)

Method

Route

Description

POST

/register

Register a new user account

POST

/login

Authenticate and receive JWT tokens

POST

/refresh

Rotate Access & Refresh tokens

POST

/logout

Revoke Refresh Token and logout

Link Endpoints (/api/v1/links)

Method

Route

Auth Required

Description

POST

/

Optional

Create a short link

GET

/:code

No

Resolve and redirect to original URL

GET

/me/links

Yes

List all links for the current user

DELETE

/:code

Yes

Delete a specific link (Owner only)

🔒 Security Implementation

XSS Protection: Comprehensive input sanitization to prevent script injection.

Rate Limiting: Throttles requests to prevent Brute Force and DoS attacks.

Token Rotation: If a Refresh Token is compromised, the entire token family is invalidated.

Helmet.js: Hardens HTTP headers against common web vulnerabilities.

CORS: Restricts API access to authorized frontend origins only.

💻 Frontend Usage (Axios Interceptors)

The frontend automatically handles expired tokens using interceptors:

// Auto-refresh logic on 401 response
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      // Trigger /auth/refresh logic here
    }
  }
);


📝 License

Distributed under the MIT License.