const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'car-rental-super-secret-key';
const users = new Map();
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
const hashPassword = async (password) => bcrypt.hash(password, await bcrypt.genSalt(10));
const toPublicUser = (user) => ({ _id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all required fields' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email: normalizedEmail, password, phone: phone || '', role: 'user' });
    return res.status(201).json({ message: 'User registered successfully', token: generateToken(user._id), user: toPublicUser(user) });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    return res.json({ message: 'Login successful', token: generateToken(user._id), user: toPublicUser(user) });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getUserProfile = async (req, res) => res.json({ user: req.user });

module.exports = { registerUser, loginUser, getUserProfile, users, hashPassword, toPublicUser };
