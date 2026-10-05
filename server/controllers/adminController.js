const Car = require('../models/Car');
const User = require('../models/User');
const Booking = require('../models/Booking');

const getDashboardStats = async (req, res) => {
  try {
    const [totalCars, totalUsers, totalBookings, availableCars, pendingBookings] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
      Car.countDocuments({ available: true }),
      Booking.countDocuments({ status: 'pending' }),
    ]);
    return res.json({ totalCars, totalUsers, totalBookings, availableCars, pendingBookings });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getBookingNotifications = async (req, res) => {
  try {
    const checkedAt = new Date();
    const since = req.query.since;
    let newBookings = [];

    if (since !== undefined) {
      const sinceDate = new Date(since);
      if (Number.isNaN(sinceDate.getTime())) {
        return res.status(400).json({ message: 'Invalid notification timestamp' });
      }

      newBookings = await Booking.find({ createdAt: { $gte: sinceDate } })
        .select('user car pickupDate returnDate totalAmount status createdAt')
        .populate('user', 'name email')
        .populate('car', 'brand model')
        .sort({ createdAt: 1 });
    }

    const [pendingBookings, totalBookings] = await Promise.all([
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments(),
    ]);

    return res.json({ checkedAt, newBookings, pendingBookings, totalBookings });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getAllUsers = async (req, res) => {
  try { return res.json(await User.find({}).select('-password').sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ message: error.message }); }
};

module.exports = { getDashboardStats, getBookingNotifications, getAllUsers };
