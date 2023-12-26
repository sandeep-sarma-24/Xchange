const supabase = require('../db/db'); 

const ticketController = {
    // Create a new ticket
    async createTicket(req, res) {
        const { type_id, /* other fields */ } = req.body;
        try {
            const { data, error } = await supabase
                .from('tickets')
                .insert([{ type_id, /* other fields */ }]);
            if (error) throw error;
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all tickets
    async getAllTickets(req, res) {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*');
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a specific ticket by ID
    async getTicketById(req, res) {
        const { ticketId } = req.params;
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('ticket_id', ticketId)
                .single();
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a ticket
    async updateTicket(req, res) {
        const { ticketId } = req.params;
        const updateData = req.body;
        try {
            const { data, error } = await supabase
                .from('tickets')
                .update(updateData)
                .eq('ticket_id', ticketId);
            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a ticket
    async deleteTicket(req, res) {
        const { ticketId } = req.params;
        try {
            const { data, error } = await supabase
                .from('tickets')
                .delete()
                .eq('ticket_id', ticketId);
            if (error) throw error;
            res.json({ message: 'Ticket deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ticketController;
