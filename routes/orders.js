const express = require('express');
const pool = require('../db'); // PostgreSQL pool connection
const router = express.Router();

// Order-related routes

// Place an order
router.post('/place', async (req, res) => {
    const { userId, items } = req.body;

    // Validate input
    if (!userId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO orders (user_id, items) VALUES ($1, $2) RETURNING *',
            [userId, JSON.stringify(items)] // Save items as JSON
        );
        res.status(201).json({
            message: 'Order placed successfully',
            order: result.rows[0],
        });
    } catch (err) {
        console.error(`Error placing order for user ${userId}:`, err.message);

        // Handle specific errors if necessary
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;