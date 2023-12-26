const express = require('express');
const ticketController = require('/media/edward-elric/files/Languages/X/backend/controllers/ticketController.js'); // Adjust the path according to your project structure
const router = express.Router();

// POST endpoint to create a new ticket
router.post('/tickets', ticketController.createTicket);

// GET endpoint to retrieve all tickets
router.get('/tickets', ticketController.getAllTickets);

// GET endpoint to retrieve a specific ticket by ID
router.get('/tickets/:ticketId', ticketController.getTicketById);

// PUT endpoint to update a ticket
router.put('/tickets/:ticketId', ticketController.updateTicket);

// DELETE endpoint to delete a ticket
router.delete('/tickets/:ticketId', ticketController.deleteTicket);

module.exports = router;
