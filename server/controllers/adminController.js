const Car = require('../models/Car');
const User = require('../models/User');
const Booking = require('../models/Booking');

const getDashboardStats = async (req, res) => {
  try {
    const [totalCars, totalUsers, totalBookings, availableCars] = await Promise.all([
      Car.countDocuments(), User.countDocuments(), Booking.countDocuments(), Car.countDocuments({ available: true }),
    ]);
    return res.json({ totalCars, totalUsers, totalBookings, availableCars });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getAllUsers = async (req, res) => {
  try { return res.json(await User.find({}).select('-password').sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ message: error.message }); }
};

module.exports = { getDashboardStats, getAllUsers };
