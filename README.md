# Backend 02 - RESTful API

A backend authentication system built with Node.js, Express.js, MongoDB, and JWT.

## Features

- User Registration
- User Login
- JWT Authentication
- Refresh Token Flow
- Logout
- Get User Profile
- Request Validation using Joi
- Password Hashing using bcrypt
- Role-based Authorization Middleware
- Cookie-based Authentication

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi
- Cookie Parser

## Project Structure

```
src
├── common
│   ├── config
│   ├── constants
│   ├── dto
│   ├── middleware
│   └── utils
│
└── modules
    └── auth
```

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

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

## Current Progress

- ✅ Authentication Module
- ✅ JWT Access & Refresh Tokens
- ✅ Cookie-based Authentication
- ✅ Protected Routes
- ✅ User Profile Endpoint
- 🚧 Forgot Password
- 🚧 Email Verification

## Author

Priyank Patel
