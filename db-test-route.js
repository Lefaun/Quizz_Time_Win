// Add this to your server.js
app.get('/api/test-db', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('SELECT NOW()');
        res.json({ status: 'Database connection successful' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    } finally {
        client.release();
    }
});
