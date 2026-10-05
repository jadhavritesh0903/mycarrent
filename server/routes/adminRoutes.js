const express = require('express');
const { getDashboardStats, getBookingNotifications, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/booking-notifications', protect, adminOnly, getBookingNotifications);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
