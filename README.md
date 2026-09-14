# ShortURL

A full-stack URL shortener built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

The application allows users to:
- Create an account and sign in.
- Create custom short URLs.
- Set an expiry time for each short URL.
- View their saved URLs.
- Track the number of times a short URL is accessed.
- Delete their URLs.
- Automatically expire URLs using MongoDB's TTL index.
- Redirect visitors from a short URL to the original URL.

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- CORS
- dotenv

## Project Structure

```text
shortURL/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── urlModel.js
│   │   └── usersModel.js
│   ├── routers/
│   │   ├── authRoutes.js
│   │   └── dataRoute.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── shortURL-frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── homepage.jsx
    │   ├── signin.jsx
    │   ├── signup.jsx
    │   ├── logout.jsx
    │   ├── App.css
    │   └── index.css
    ├── package.json
    └── index.html
```

## Prerequisites

Install:

- Node.js 18+ recommended
- npm
- A MongoDB database, such as MongoDB Atlas

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd shortURL
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside `backend/`:

```env
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_strong_jwt_secret
BASE_URL=http://localhost:3000
```

**Never commit your real `.env` file or database credentials to GitHub.**

### 4. Install frontend dependencies

Open another terminal:

```bash
cd shortURL-frontend
npm install
```

## Running the Application

### Start the backend

From `backend/`:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

### Start the frontend

From `shortURL-frontend/`:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

Open that URL in your browser.

## Authentication

Authentication uses JWT.

1. Create an account using **Sign Up**.
2. Sign in using the account.
3. The JWT token is stored in browser `localStorage`.
4. Authenticated requests send the token through the `Authorization` header.
5. The backend verifies the token before allowing users to manage their URLs.

Passwords are hashed using bcrypt before being stored in MongoDB.

## URL Shortening Flow

When a user creates a short URL:

1. The frontend sends the original URL, custom short code, and expiry time.
2. The backend validates the request.
3. The backend checks whether the short code already exists.
4. An expiry timestamp is calculated.
5. The URL is stored in MongoDB.
6. The generated short URL is returned to the frontend.

When someone opens the short URL:

```text
http://localhost:3000/<short-code>
```

the backend:
1. Looks up the short URL.
2. Checks whether it exists.
3. Checks whether it has expired.
4. Increments its access counter.
5. Redirects the visitor to the original URL.

## Expiry System

The URL model uses a MongoDB TTL index:

```js
expireAt: {
    type: Date,
    required: true,
    expires: 0
}
```

This allows MongoDB to automatically remove expired URL documents.

The frontend also removes expired entries from the displayed list as their remaining time reaches zero.

## API Overview

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/signup` | Create a user account |
| POST | `/signin` | Authenticate a user and receive a JWT |

### URL Management

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/` | Required | Get the signed-in user's URLs |
| POST | `/` | Required | Create a short URL |
| DELETE | `/` | Required | Delete a user's URL |
| GET | `/:b` | No | Redirect using a short URL |

## Development Notes

The current frontend uses `http://localhost:3000` directly for API requests, while the backend allows the local Vite origin:

```text
http://localhost:5173
```

If deploying the project, update the frontend API URLs, backend CORS configuration, and `BASE_URL` environment variable to match the deployed services.

## Security Notes

Before publishing this project:

- Remove any real MongoDB credentials from `.env`.
- Generate a strong random `SECRET_KEY`.
- Keep `.env` out of version control.
- Configure CORS for the production frontend domain.
- Use HTTPS in production.
- Move API URLs into frontend environment variables instead of hardcoding localhost URLs.

## License

This project is available for personal and educational use. Add your preferred license before publishing it publicly.
