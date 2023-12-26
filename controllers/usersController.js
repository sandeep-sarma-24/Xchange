const bcrypt = require('bcrypt');
const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('user_id', userId)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error updating user:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        res.send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const getSpecificUserColumns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('name, email');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching specific user data:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const filterUsersByEmail = async (req, res) => {
    const emailToFilter = req.query.email;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', emailToFilter);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error applying filter:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const filterUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching user:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

module.exports = {
    getAllUsers,
    updateUserDetails,
    deleteUser,
    getSpecificUserColumns,
    filterUsersByEmail,
    filterUserById
};
