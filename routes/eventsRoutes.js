const express = require('express');
const authenticate = require('../middleware/authenticate');
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getSpecificEventColumns,
    getEventsWithPagination
} = require('../controllers/eventsController');

const router = express.Router();

// Route to create a new event
router.post('/', authenticate, createEvent);

// Route to get all events
router.get('/', authenticate, getAllEvents);

// Route to get specific events columns for a specific event
router.get('/specific', authenticate, getSpecificEventColumns);

// Route to get events with pagination
router.get('/pagination', authenticate, getEventsWithPagination);

// Route to get a single event by its ID
router.get('/:id', authenticate, getEventById);

// Route to update an event's details
router.put('/:id', authenticate, updateEvent);

// Route to delete an event
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;
