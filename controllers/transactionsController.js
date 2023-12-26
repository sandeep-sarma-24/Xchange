const supabase = require('../db/db');
const sendErrorResponse = require('../utils/sendErrorResponse');

// Create a transaction
const createTransaction = async (req, res) => {
    const transactionData = req.body;

    try {
        // Insert the transaction and return the inserted data
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();  // Ensure the inserted data is returned

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        if (!data || data.length === 0) {
            // Handle the case where no data is returned
            return sendErrorResponse(res, 500, 'Transaction creation failed');
        }

        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating transaction:', err);
        sendErrorResponse(res, 500, `Server error: ${err.message}`);
    }
};


// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Get a specific transaction by ID
const getTransactionById = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('transaction_id', transactionId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching transaction:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

const updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const updates = req.body;

    try {
        // Update the transaction and return the updated data
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('transaction_id', transactionId)
            .select();  // Add this to fetch the updated row

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        if (!data || data.length === 0) {
            // Handle the case where no data is returned
            return sendErrorResponse(res, 404, 'Transaction not found or update failed');
        }

        res.json(data);
    } catch (err) {
        console.error('Error updating transaction:', err);
        sendErrorResponse(res, 500, `Server error: ${err.message}`);
    }
};


// Delete a transaction
const deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('transaction_id', transactionId);

        if (error) throw error;
        res.send('Transaction deleted successfully');
    } catch (err) {
        console.error('Error deleting transaction:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// gets all transactions by userId
const getTransactionsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

        if (error) {
            console.error('Database error:', error);
            return sendErrorResponse(res, 500, `Server error: ${error.message}`);
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching transactions by user ID:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};


module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionsByUserId
};
