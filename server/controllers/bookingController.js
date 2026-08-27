const Booking = require('../models/Booking');
const Car = require('../models/Car');

const getUserDashboardStats = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    return res.json({ totalBookings: bookings.length, activeBookings: bookings.filter((item) => ['pending', 'confirmed'].includes(item.status)).length, totalSpent: bookings.reduce((sum, item) => sum + item.totalAmount, 0), upcomingTrips: bookings.filter((item) => item.pickupDate >= new Date() && item.status !== 'cancelled').length, cancelledBookings: bookings.filter((item) => item.status === 'cancelled').length });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, phoneNumber } = req.body;
    if (!carId || !pickupDate || !returnDate) return res.status(400).json({ message: 'Pick-up and return dates are required' });
    if (!phoneNumber || !String(phoneNumber).trim()) return res.status(400).json({ message: 'Phone number is required to book a car' });
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.available) return res.status(400).json({ message: 'This car is unavailable' });
    const start = new Date(pickupDate); const end = new Date(returnDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return res.status(400).json({ message: 'Return date must be after pickup date' });
    const booking = await Booking.create({ user: req.user._id, car: car._id, phoneNumber: String(phoneNumber).trim(), pickupDate: start, returnDate: end, totalAmount: Math.max(1, Math.ceil((end - start) / 86400000)) * car.pricePerDay });
    await booking.populate('car');
    return res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getUserBookings = async (req, res) => { try { return res.json(await Booking.find({ user: req.user._id }).populate('car').sort({ createdAt: -1 })); } catch (error) { return res.status(500).json({ message: error.message }); } };
const getAllBookings = async (req, res) => { try { return res.json(await Booking.find({}).populate('user', 'name email phone role').populate('car').sort({ createdAt: -1 })); } catch (error) { return res.status(500).json({ message: error.message }); } };
const updateBookingStatus = async (req, res) => { try { const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name email phone role').populate('car'); if (!booking) return res.status(404).json({ message: 'Booking not found' }); return res.json({ message: 'Booking status updated', booking }); } catch (error) { return res.status(500).json({ message: error.message }); } };
const cancelBooking = async (req, res) => { try { const booking = await Booking.findById(req.params.id); if (!booking) return res.status(404).json({ message: 'Booking not found' }); if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed to cancel this booking' }); if (['confirmed', 'completed', 'cancelled'].includes(booking.status)) return res.status(400).json({ message: 'Only pending bookings can be cancelled' }); booking.status = 'cancelled'; await booking.save(); return res.json({ message: 'Booking cancelled successfully' }); } catch (error) { return res.status(500).json({ message: error.message }); } };

module.exports = { createBooking, getUserBookings, getAllBookings, updateBookingStatus, cancelBooking, getUserDashboardStats };
