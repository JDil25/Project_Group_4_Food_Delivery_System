const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',     
    database: 'restaurant_db',  
    password: 'postgres', 
    port: 5432,      
});

// Test the db connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;