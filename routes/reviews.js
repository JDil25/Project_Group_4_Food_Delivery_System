const express = require('express');
const router = express.Router();

// In-memory reviews
let reviews = [];z

// Submit a review
router.post('/submit', (req, res) => {
    const { userId, restaurantId, rating, comment } = req.body;

    const newReview = {
        id: Math.floor(Math.random() * 10000), // Random review ID
        userId,
        restaurantId,
        rating,
        comment,
    };

    reviews.push(newReview);
    res.status(200).json({ message: 'Review submitted successfully', review: newReview });
});

// Get reviews for a specific restaurant
router.get('/restaurant/:restaurantId', (req, res) => {
    const { restaurantId } = req.params;

    const restaurantReviews = reviews.filter(review => review.restaurantId === restaurantId);

    res.status(200).json({ reviews: restaurantReviews });
});

module.exports = router;
