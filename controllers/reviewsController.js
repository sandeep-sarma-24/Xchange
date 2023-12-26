const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

// Create a review
const createReview = async (req, res) => {
    const { event_id, rating, review_text } = req.body;
    const reviewed_by = req.user.userId; // Get user ID from the authenticated user

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ event_id, reviewed_by, rating, review_text }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating review:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Update a review
const updateReview = async (req, res) => {
    const reviewId = req.params.id;
    const updates = req.body;

    // Fetch the existing review to check if the user is authorized to update it
    const existingReview = await supabase
        .from('reviews')
        .select('*')
        .eq('review_id', reviewId)
        .single();

    if (existingReview.error) {
        return sendErrorResponse(res, 500, 'Error fetching review');
    }

    if (existingReview.data.reviewed_by !== req.user.userId) {
        return sendErrorResponse(res, 403, 'Unauthorized to update this review');
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .update(updates)
            .eq('review_id', reviewId)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error updating review:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('review_id', reviewId);

        if (error) throw error;
        res.send('Review deleted successfully');
    } catch (err) {
        console.error('Error deleting review:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const getReviewsByUserId = async (req, res) => {
    const userId = req.params.userId;

    if (req.user.userId !== parseInt(userId, 10)) {
        return sendErrorResponse(res, 403, 'Unauthorized to access these reviews');
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('reviewed_by', userId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching reviews for user:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};



module.exports = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByUserId
};
