const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

// Create a message
const createMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    // Ensure the authenticated user is the sender
    if (req.user.userId !== sender_id) {
        return sendErrorResponse(res, 403, 'Unauthorized to send message on behalf of another user');
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ sender_id, receiver_id, message }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating message:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};


// Get all messages
const getAllMessages = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching messages:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Get a specific message by ID
const getMessageById = async (req, res) => {
    const messageId = req.params.id;

    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('message_id', messageId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching message:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Update a message
const updateMessage = async (req, res) => {
    const messageId = req.params.id;
    const updates = req.body;

    try {
        // Update the message and return the updated data
        const { data, error } = await supabase
            .from('messages')
            .update(updates)
            .eq('message_id', messageId)
            .select();  // Add this to fetch the updated row

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        if (!data || data.length === 0) {
            // Handle the case where no data is returned
            return sendErrorResponse(res, 404, 'Message not found or update failed');
        }

        res.json(data);
    } catch (err) {
        console.error('Error updating message:', err);
        sendErrorResponse(res, 500, `Server error: ${err.message}`);
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const messageId = req.params.id;

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('message_id', messageId);

        if (error) throw error;
        res.send('Message deleted successfully');
    } catch (err) {
        console.error('Error deleting message:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// get all messages by userId
const getMessagesByUserId = async (req, res) => {
    const userId = req.params.userId;

    // Ensure the authenticated user is requesting their own messages
    if (req.user.userId !== parseInt(userId, 10)) {
        return sendErrorResponse(res, 403, 'Unauthorized to access messages for this user');
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching messages for user:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};


module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    getMessagesByUserId
};
