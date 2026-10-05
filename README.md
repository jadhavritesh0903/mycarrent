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

To open the development app on a phone, connect the phone and computer to the same Wi-Fi and visit `http://<computer-local-ip>:5173` on the phone. The Vite development server forwards `/api` requests to the backend. If Windows Firewall prompts you, allow Node.js on your private network.

## Android APK

1. Install Android Studio and its Android SDK, then use a JDK supported by the installed Android Gradle Plugin (JDK 17 is recommended).
2. From `client/`, run `npm run android:add` once to create the Android project.
3. Connect the phone and computer to the same Wi-Fi. Keep the backend running and allow Node.js through Windows Firewall on private networks.
4. From `client/`, run `npm run android:apk`. The script uses the computer's Wi-Fi address and creates `client/DriveNow-Car-Rental.apk`.
5. Transfer that APK to the phone and install it. If the backend uses a different address or port, pass it explicitly with `npm run android:apk -- -ApiUrl http://<computer-local-ip>:<port>/api`.

The APK uses the local backend URL embedded at build time, so rebuild it if the computer's Wi-Fi address changes. The debug APK is for testing on the same Wi-Fi, not public release.

## Production build

```bash
cd client
npm run build
```

## Notes

- Frontend and backend are separated.
- Backend uses JWT authentication.
- Admin account is auto-created on backend startup if missing.
