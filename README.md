# Backend 02 - RESTful API

A RESTful Authentication API built with **Node.js**, **Express.js**, **MongoDB**, and **JWT**. This project implements secure user authentication using access and refresh tokens, cookie-based authentication, email verification, password reset, and role-based authorization.

---

## Features

- User Registration
- Email Verification
- Secure User Login
- JWT Access & Refresh Token Authentication
- Cookie-based Authentication
- Logout
- Get Current User Profile
- Forgot Password
- Reset Password
- Password Hashing using bcrypt
- Request Validation using Joi
- Authentication Middleware
- Role-based Authorization Middleware

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi
- Cookie Parser

---

## Project Structure

```text
src
├── common
│   ├── config
│   ├── constants
│   ├── dto
│   ├── middleware
│   └── utils
│
├── modules
│   └── auth
│       ├── dto
│       ├── auth.controller.js
│       ├── auth.model.js
│       ├── auth.routes.js
│       └── auth.service.js
│
└── server.js
```

---

## API Endpoints

| Method | Endpoint                      | Description               |
| ------ | ----------------------------- | ------------------------- |
| POST   | `/auth/register`              | Register a new user       |
| POST   | `/auth/login`                 | Login user                |
| POST   | `/auth/logout`                | Logout user               |
| POST   | `/auth/refresh`               | Refresh access token      |
| GET    | `/auth/me`                    | Get current user          |
| POST   | `/auth/forgot-password`       | Send password reset email |
| POST   | `/auth/reset-password/:token` | Reset user password       |
| GET    | `/auth/verify-email/:token`   | Verify user email         |

---

## Security Features

- Password hashing using bcrypt
- JWT Access & Refresh Tokens
- Hashed Refresh Tokens stored in database
- HttpOnly Cookie Authentication
- Request Validation using Joi
- Role-based Authorization
- Password Reset Token Expiration

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Installation

```bash
npm install
```

---

## Run

```bash
npm run dev
```

---

## Current Status

- ✅ Authentication Module
- ✅ Email Verification
- ✅ JWT Authentication
- ✅ Refresh Token Rotation
- ✅ Cookie-based Authentication
- ✅ Protected Routes
- ✅ User Profile Endpoint
- ✅ Forgot Password
- ✅ Reset Password

---

## Future Improvements

- OAuth Authentication (Google/GitHub)
- Rate Limiting
- API Documentation (Swagger)
- Docker Support
- Unit & Integration Testing

---

## Author

**Priyank Patel**
