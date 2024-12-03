const express = require('express');
const pool = require('../db');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
    const { userId, menuItemId, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, menu_item_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, menuItemId, quantity]
        );
        res.status(201).json({ cartItem: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update item in cart
router.put('/update', async (req, res) => {
    const { cartItemId, quantity } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, cartItemId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ cartItem: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    const { cartItemId } = req.body;
    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE id = $1 RETURNING *',
            [cartItemId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ message: 'Item removed from cart', cartItem: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's cart
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;