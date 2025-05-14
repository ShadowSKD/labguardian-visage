const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports.isLogin = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
module.exports.isAdmin = async (req, res, next) => {
    let isAdmin = await User.findById(req.user.id);

    isAdmin = isAdmin?.toObject().isAdmin || null;
    if (req.user && isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: 'Access Denied. Admins only.' });
    }
};
