const express = require('express');
const authenticate = require('../middleware/authenticate');
const {
    registerUser,
    getAllUsers,
    updateUserDetails,
    deleteUser,
    getSpecificUserColumns,
    filterUsersByEmail,
    filterUserById
} = require('../controllers/usersController');

const router = express.Router();

// Route to get all users
router.get('/', authenticate, getAllUsers);

// Route to update user details
router.put('/:id', authenticate, updateUserDetails); 

// Route to delete a user
router.delete('/:id', authenticate, deleteUser);

// Route to get specific user columns (e.g., name and email)
router.get('/specific', authenticate, getSpecificUserColumns);

// Route to filter users by email
router.get('/filter', authenticate, filterUsersByEmail);

// Route to get a user by their ID
router.get('/:id', authenticate, filterUserById);

module.exports = router;
