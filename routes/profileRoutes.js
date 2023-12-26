const express = require('express');
const router = express.Router();
const profileController = require('/media/edward-elric/files/Languages/X/backend/controllers/profileController.js')

// Get all user profiles
router.get('/profiles', profileController.getAllUserProfiles);

// Get a specific user profile
router.get('/profiles/:userId', profileController.getUserProfile);

// Create a new user profile
router.post('/profiles', profileController.createUserProfile);

// Update an existing user profile
router.put('/profiles/:profileId', profileController.updateUserProfile);

// Delete a user profile
router.delete('/profiles/:profileId', profileController.deleteUserProfile);

module.exports = router;
