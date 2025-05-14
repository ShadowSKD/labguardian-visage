const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    // console.log("User registered:", user);
    res.status(201).json({ message: 'User registered successfully', user: {...user._doc, password: null} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // console.log("Login attempt with email:", email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: {...user._doc, password: null}});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { id, name, email } = req.body;
  const userId = id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user: {...user._doc, password: null} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // console.log("Fetching user with ID:", userId);
    const user = await User.findById(userId); 
    // console.log("User found:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: {...user._doc, password: null} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}