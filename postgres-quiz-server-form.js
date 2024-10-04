const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Submit multiple questions
app.post('/api/submit-questions', async (req, res) => {
    const { questions } = req.body;
    
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'No questions provided' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const queryText = 'INSERT INTO questions (question, option1, option2, correct_answer) VALUES ($1, $2, $3, $4)';
        
        for (const q of questions) {
            await client.query(queryText, [q.question, q.option1, q.option2, q.correctAnswer]);
        }
        
        await client.query('COMMIT');
        res.status(201).json({ message: `${questions.length} questions added successfully` });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting questions:', error);
        res.status(500).json({ error: 'Failed to add questions' });
    } finally {
        client.release();
    }
});

// Get random questions
app.get('/api/questions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 10');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ error: 'Failed to retrieve questions' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
