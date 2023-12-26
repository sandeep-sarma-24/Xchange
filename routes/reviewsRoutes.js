const express = require('express');
const authenticate = require('../middleware/authenticate');
const {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByUserId
} = require('../controllers/reviewsController');

const router = express.Router();

// Route to create a new review
router.post('/', authenticate, createReview);

// Route to get all reviews
router.get('/', authenticate, getAllReviews);

// Route to get reviews by a specific user
router.get('/user/:userId', authenticate, getReviewsByUserId);

// Route to update a review's details
router.put('/:id', authenticate, updateReview);

// Route to delete a review
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
