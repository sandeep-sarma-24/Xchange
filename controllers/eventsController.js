const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

// Create an event
const createEvent = async (req, res) => {
    const { title, description, category, event_date, price } = req.body;
    const created_by = req.user.userId; // Assuming user ID is included in JWT payload

    try {
        const { data, error } = await supabase
            .from('events')
            .insert([{ title, description, category, event_date, price, created_by }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating event:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching events:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    const eventId = req.params.id;
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('event_id', eventId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching event:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Update an event
const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('event_id', eventId)
            .select();  // Add this to ensure updated data is returned

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, 'Server error - database issue');
        }

        if (data && data.length === 0) {
            return sendErrorResponse(res, 404, 'No event found with the provided ID');
        }

        res.json(data);
    } catch (err) {
        console.error('Error updating event:', err);
        sendErrorResponse(res, 500, 'Server error - exception');
    }
};


// Delete an event
const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('event_id', eventId);

        if (error) throw error;
        res.send('Event deleted successfully');
    } catch (err) {
        console.error('Error deleting event:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Additional functions based on the Supabase documentation

// Get specific columns of events
const getSpecificEventColumns = async (req, res) => {
    const columns = req.query.columns; // expecting a query parameter 'columns', e.g., 'title,description'

    if (!columns) {
        return sendErrorResponse(res, 400, 'No columns specified');
    }

    try {
        const { data, error } = await supabase
            .from('events')
            .select(columns); // Use the columns specified in the query

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching specific event columns:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};


// Get events with pagination
const getEventsWithPagination = async (req, res) => {
    const start = parseInt(req.query.start, 10);
    const end = parseInt(req.query.end, 10);

    if (isNaN(start) || isNaN(end)) {
        return sendErrorResponse(res, 400, 'Invalid start or end parameters');
    }

    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .range(start, end);

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching events with pagination:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getSpecificEventColumns,
    getEventsWithPagination
};
