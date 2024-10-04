const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins in development
app.use(cors());

app.use(bodyParser.json());
app.use(express.static('public'));

// Test route - no database required
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// PostgreSQL connection
let pool;
try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} catch (error) {
    console.error('Failed to create pool:', error);
}

// Database test route
app.get('/api/test-db', async (req, res) => {
    if (!pool) {
        return res.status(500).json({ error: 'Database connection not initialized' });
    }
    
    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT NOW()');
            res.json({
                status: 'Database connection successful',
                timestamp: result.rows[0].now
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            error: 'Database connection failed',
            details: error.message
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Online Quiz API!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
