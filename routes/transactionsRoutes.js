const express = require('express');
const authenticate = require('../middleware/authenticate'); 
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionsByUserId
} = require('../controllers/transactionsController');

const router = express.Router();

// Route to create a new transaction
router.post('/', authenticate, createTransaction);

// Route to get all transactions
router.get('/', authenticate, getAllTransactions);

// Route to get a single transaction by its ID
router.get('/:id', authenticate, getTransactionById);

// Route to update a transaction's details
router.put('/:id', authenticate, updateTransaction);

// Route to delete a transaction
router.delete('/:id', authenticate, deleteTransaction);

// Route to get transactions by user ID
router.get('/user/:userId', authenticate, getTransactionsByUserId);

module.exports = router;
