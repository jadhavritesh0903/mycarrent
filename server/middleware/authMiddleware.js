const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { users } = require('../controllers/authController');

const JWT_SECRET = process.env.JWT_SECRET || 'car-rental-super-secret-key';

const findUserById = async (id) => {
  const inMemoryUser = Array.from(users.values()).find((user) => user._id.toString() === id.toString());
  if (inMemoryUser) {
    const { password, ...safeUser } = inMemoryUser;
    return safeUser;
  }

  try {
    return await User.findById(id).select('-password');
  } catch (error) {
    return null;
  }
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await findUserById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

module.exports = { protect, adminOnly };
