const express = require('express');
const { 
    addLab, 
    removeLab, 
    getUsers, 
    getLabs,
    deleteUser,
    editLab,
    getLab,
    forceLabReset
} = require('../controllers/adminController');
const { isLogin, isAdmin } = require('../middleware/auth_middleware');
const { editUser } = require('../controllers/userController');
const router = express.Router();

// Add a new lab
router.post('/labs', isLogin, isAdmin, addLab);

// Remove a lab
router.delete('/labs/:labCode', isLogin, removeLab);

// Edit a lab
router.post('/labs/:labId', isLogin, isAdmin, editLab);

// Get all labs
router.get('/labs', isLogin, getLabs);

// Get a specific lab by ID
router.get('/labs/:labId', isLogin, getLab);

// Get all users for management
router.get('/users', isLogin, getUsers);

// Delete a user
router.delete('/users/:userId', isLogin, deleteUser);

// Force reset a lab
router.post('/resetlabs', isLogin, isAdmin, forceLabReset);

module.exports = router;
