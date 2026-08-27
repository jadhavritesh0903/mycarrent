# Car Rental

A full-stack MERN car rental website with a React + Vite frontend and Express + MongoDB backend.

## Project structure

- client/
- server/

## Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Backend setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Environment variables

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

### server/.env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/car-rental
JWT_SECRET=change_this_secret_key
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=admin123
```

## MongoDB setup

1. Install MongoDB locally or use MongoDB Atlas.
2. Start MongoDB.
3. Keep the connection string in `server/.env`.

## Admin login

- Email: admin@carrental.com
- Password: admin123

## Run project

Open two terminals:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```

## Production build

```bash
cd client
npm run build
```

## Notes

- Frontend and backend are separated.
- Backend uses JWT authentication.
- Admin account is auto-created on backend startup if missing.
