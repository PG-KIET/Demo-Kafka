const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
app.use(cors());
// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',
    password: 'HenryFouR_123',
    server: 'localhost',
    database: 'LogDatabase',
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

app.get('/api/logs', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Logs');
        res.json(result.recordset); // Trả về danh sách log cho React
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error retrieving logs');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
