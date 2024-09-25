const sql = require('mssql');

const sqlConfig = {
    user: 'sa',
    password: 'HenryFouR_123',
    database: 'kafka',
    server: 'localhost',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const connectDB = async () => {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

module.exports = { connectDB, sql };
