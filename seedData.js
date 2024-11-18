const express = require('express');
const router = express.Router();
const pool = require('../db');

// Seed mock data for restaurants and menu items
router.post('/seed', async (req, res) => {
    try {
        // Insert mock data for restaurants
        await pool.query(`
            INSERT INTO restaurants (name, address, phone, email) 
            VALUES
            ('DurBurger', '321 Salty Springs Ave', '434-422-1243', 'durburger@burgies.com'),
            ('Pizza Planet', '322 Pizza Rd', '430-998-8675', 'PizzaPlanet.com')
        `);

        // Insert mock data for menu items
        await pool.query(`
            INSERT INTO menu_items (restaurant_id, name, description, price) 
            VALUES
            (1, 'Bacon Burger', 'Burger with beef patty, wheat buns, crispy bacon, and bbq sauce', 12.99),
            (1, 'Double Cheese Burger', 'Classic burger with two slices of American cheese', 11.99),
            (1, 'Milkshake', '12 oz milkshake available in strawberry, vanilla, or chocolate.', 8.99),
            (2, 'Margherita Pizza', 'Classic pizza topped with tomatoes, basil, and house special mozzarella', 12.99),
            (2, 'Pepperoni Pizza', 'Classic pizza pie with pepperonis on top', 11.99),
            (2, 'Chicken Alfredo Pasta', 'Classic pasta topped with rich Alfredo sauce and house-made crispy chicken', 10.99)
        `);

        res.status(200).json({ message: 'Mock data was seeded successfully' });
    } catch (err) {
        console.error('Error seeding data:', err.message);
        res.status(500).json({ error: 'Mock data failed to seed' });
    }
});

module.exports = router;