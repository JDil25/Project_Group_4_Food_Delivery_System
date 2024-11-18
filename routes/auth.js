const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('../db')

const router = express.Router()

// Handles user sign-up
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10) // Generates a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt) // Hashes the password with the generated salt

        const result = await pool.query( // Inserts user data into the database
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        )

        res.status(201).json({ user: result.rows[0] }) // Sends the new user's data as a response
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Server error' }) // Sends an error response in case of failure
    }
})

// Handles user sign-in
router.post('/signin', async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]) // Queries the database for user data

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' }) // Responds with an error if the user is not found
        }

        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password) // Compares the provided password with the stored hash

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' }) // Responds with an error if passwords do not match
        }

        res.json({ user }) // Sends the user data as a response
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Server error' }) // Sends an error response in case of failure
    }
})

module.exports = router