const express = require('express');
const { isLogin, isAdmin } = require('../middleware/auth_middleware');
const { registerUser, loginUser, editUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', isLogin, isAdmin, registerUser);
router.post('/login', loginUser);
router.get('/:userId',isLogin,  getUser);       

router.post('/:userId',isLogin, editUser); // isLogin,

module.exports = router;
