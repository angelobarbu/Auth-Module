# Authentication-Module
### © Angelo-Gabriel Barbu - angelo.barbu123@gmail.com - 2025

## Table of Contents

- [Authentication-Module](#authentication-module)
    - [© Angelo-Gabriel Barbu - angelo.barbu123@gmail.com - 2025](#-angelo-gabriel-barbu---angelobarbu123gmailcom---2025)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Folder Structure](#folder-structure)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Architecture](#architecture)
    - [MVC Pattern](#mvc-pattern)
    - [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
    - [JWT Authentication](#jwt-authentication)
  - [Security](#security)
    - [Helmet Security Headers](#helmet-security-headers)
    - [Rate Limiting](#rate-limiting)
  - [Authentication Methods](#authentication-methods)
    - [Email/Password Login](#emailpassword-login)
    - [Google OAuth Integration](#google-oauth-integration)
  - [Forms \& Validation](#forms--validation)
  - [Admin Dashboard](#admin-dashboard)
  - [User Dashboard](#user-dashboard)
  - [Frontend Styling](#frontend-styling)
  - [Setup Instructions](#setup-instructions)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
  - [Testing](#testing)
  - [Planned Improvements](#planned-improvements)
  - [License](#license)

---

## Project Overview

A secure, full-featured authentication module supporting both traditional email/password login and Google OAuth. Includes user and admin dashboards, role-based access, password setting for Google users, and user management.

## Features

- JWT-based session management
- Google OAuth login
- Role-Based Access Control (RBAC)
- Admin user management (CRUD)
- Responsive form validations
- Set password for Google-registered users
- Rate limiting & Helmet for security
- Toast-based user feedback

## Tech Stack

- **Frontend**: React, React Router, React Toastify, Google Identity Services
- **Backend**: Node.js, Express, Sequelize (PostgreSQL), JWT
- **Security**: Helmet, express-rate-limit, bcrypt

## Folder Structure

### Backend
```bash
backend/
│
├── config/               # Environment config loading
├── controllers/          # Business logic (auth, admin, Google OAuth)
├── middlewares/          # JWT and Role authentication
├── models/               # Sequelize models
├── routes/               # Express route definitions
├── scripts/              # Seed script for admin
├── utils/                # JWT & password helpers
├── .env                  # Backend environment variables
├── app.js                # Express app setup
└── server.js             # Server entry point
```

### Frontend
```bash
frontend/
│
├── public/
├── src/
│   ├── components/       # Shared components (Forms, Dashboards)
│   ├── pages/            # Page views (Login, Register)
│   ├── api.js            # Axios instance with JWT
│   ├── AppRoutes.jsx     # Protected routing logic
│   ├── styles.css        # App-wide styling
│   └── App.js            # Root component
└── .env                  # Frontend environment variables
```

## Architecture

### MVC Pattern

The backend follows a clean separation of concerns:
- **Models**: Sequelize models define data structure.
- **Views**: (Handled by React frontend)
- **Controllers**: Encapsulate business logic.
- **Routes**: Map HTTP endpoints to controllers.

### Role-Based Access Control (RBAC)

- User roles are defined in the database (`user`, `admin`)
- Middleware checks access per route using JWT payload role.
- Regular users are routed to `/dashboard`
- Admin users are routed to `/admin`
- Admins can:
  - View all users
  - Create new users or admins
  - Update or delete existing accounts

### JWT Authentication

- Tokens issued upon login (or Google OAuth)
- Sent in `Authorization` headers
- Used to protect routes and manage sessions

## Security

### Helmet Security Headers

```js
app.use(helmet());
```
Adds secure HTTP headers to protect from well-known web vulnerabilities.

### Rate Limiting

```js
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```
Mitigates brute-force attacks and abuse by limiting repeated requests.

## Authentication Methods

### Email/Password Login

- Register with required fields + password
- Login sets JWT token in `localStorage`

### Google OAuth Integration

- Login/registration via Google Identity Services
- Prompts user to optionally set password for manual login

## Forms & Validation

- All forms have client-side validation
- Password confirmation fields in registration and update
- Error messages displayed via `toast.error()`

## Admin Dashboard

- Create, update, delete users/admins
- View user list in a styled responsive table
- Edit form pre-filled with selected user

## User Dashboard

- View and update personal info
- Optional password change with validation
- Ability to delete account after confirming password

## Frontend Styling

- Clean and modern design
- Uniform form components
- Responsive behavior with layout safety

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Fill in DB, JWT_SECRET, etc.
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Include REACT_APP_API_BASE_URL, GOOGLE_CLIENT_ID
npm start
```

## Environment Variables

**Backend `.env`**
```
DATABASE_URL=
PORT=
JWT_SECRET=
TOKEN_EXPIRATION_SECONDS=
GOOGLE_CLIENT_ID=
```

**Frontend `.env`**
```
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_GOOGLE_CLIENT_ID=<your_google_id>
```

## Scripts

- `seedAdmin.js`: Seeds an initial admin user
```bash
node scripts/seedAdmin.js
```

## Testing
This repository ships with a zero-config, fully isolated test harness for both the Node/Express backend and the React frontend.
Follow the steps below (copy-paste friendly) and you will obtain deterministic test runs on any machine or CI runner.
Testing done using `jest`.
```bash
cd frontend/
npm ci
npm test

cd backend/
npm ci
npm test
```

## Planned Improvements

- Email confirmation after registration
- Forgot password flow
- 2FA (Two-Factor Authentication)
- Dark mode UI theme
- Deployment strategy
- Low-level & high-level architecture diagrams
- Unit tests & e2e testing
- UI refinement overall

## License

This project is licensed under the MIT License.
