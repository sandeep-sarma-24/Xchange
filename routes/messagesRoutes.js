const express = require('express');
const authenticate = require('../middleware/authenticate'); 
const {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    getMessagesByUserId
} = require('../controllers/messagesController');

const router = express.Router();

// Route to create a new message
router.post('/', authenticate, createMessage);

// Route to get all messages
router.get('/', authenticate, getAllMessages);

// Route to get a single message by its ID
router.get('/:id', authenticate, getMessageById); 

// Route to update a message's details
router.put('/:id', authenticate, updateMessage); 

// Route to delete a message
router.delete('/:id', authenticate, deleteMessage);

// Route to get messages by user ID
router.get('/user/:userId', authenticate, getMessagesByUserId);

module.exports = router;
