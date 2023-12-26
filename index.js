const express = require('express');
const bcrypt = require('bcrypt');
const supabase = require('./db/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Improved error response function
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Create a new user account
app.post('/register', async (req, res) => {
    try {
      const { name, email, password, phone_number, date_of_birth, preferences } = req.body;
  
      // Input validation
      if (!email || !password || !name) {
        return sendErrorResponse(res, 400, 'Missing required fields');
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Insert into the database and return the inserted data
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
        ])
        .select(); // Include the select method here
  
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
  
      // Check if data is returned and is an array with at least one element
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data returned from database insert operation');
      }
  
      // Exclude sensitive data from the response
      const { password_hash, ...userData } = data[0];
      res.status(201).json(userData);
    } catch (err) {
      console.error('Server error:', err);
      sendErrorResponse(res, 500, 'Server error');
    }
  });
  

// Get all user registrations
app.get('/users', async (req, res) => {
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
});

// Update user details
app.put('/users/:id', async (req, res) => {
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
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
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
});

// Read specific user columns
app.get('/users/specific', async (req, res) => {
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
});

// Filter users by email
app.get('/users/filter', async (req, res) => {
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
});

// Filter users by userId
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;  // Use params to get the user ID from the URL path
  
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId);  // Ensure the column name matches your database schema
  
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      sendErrorResponse(res, 500, 'Server error');
    }
    });


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
