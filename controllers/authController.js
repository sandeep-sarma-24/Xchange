const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

// Function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User registration
const registerUser = async (req, res) => {
    const { name, email, password, phone_number, date_of_birth, preferences } = req.body;

    if (!email || !password || !name) {
        return sendErrorResponse(res, 400, 'Missing required fields');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password_hash: hashedPassword,
                    phone_number,
                    date_of_birth,
                    preferences
                }
            ]);

        if (error) throw error;

        // Remove sensitive data before sending response
        const { password_hash, ...userData } = data[0];
        const token = generateToken(userData);

        res.status(201).json({ ...userData, token });
    } catch (err) {
        console.error('Registration error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from the database
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        // Check password
        const validPassword = await bcrypt.compare(password, data.password_hash);
        if (!validPassword) {
            return sendErrorResponse(res, 401, 'Invalid password');
        }

        // Generate JWT token
        const token = generateToken(data);

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

module.exports = {
    registerUser,
    loginUser
};
