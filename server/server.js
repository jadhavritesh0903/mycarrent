require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const { seedCars } = require('./controllers/carController');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const seedAdminUser = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@carrental.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  if (!await User.findOne({ email })) {
    await User.create({ name: 'System Admin', email, password, role: 'admin' });
    console.log('Default admin user created in MongoDB');
  }
};

const startServer = async () => {
  try {
    const connected = await connectDB();
    if (!connected) throw new Error('MongoDB connection failed. Check MONGO_URI in server/.env.');
    await seedAdminUser();
    await seedCars();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => res.json({ message: 'Car Rental API is running' }));
    app.use('/api/auth', authRoutes);
    app.use('/api/cars', carRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/admin', adminRoutes);
    app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ message: 'Something went wrong' }); });
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
