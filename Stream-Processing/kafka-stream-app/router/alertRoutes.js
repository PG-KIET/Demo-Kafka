const express = require('express');
const { sql, connectDB } = require('../database/db');
const { Kafka } = require('kafkajs');
const router = express.Router();

const kafka = new Kafka({
    clientId: 'stream-processing-app',
    brokers: ['localhost:9093', 'localhost:9094'],
});
const producer = kafka.producer();

router.post('/data', async (req, res) => {
    const { data } = req.body;

    try {
        await producer.connect();
        await producer.send({
            topic: 'stream-data',
            messages: [{ value: data }],
        });

        // Kết nối đến SQL Server
        await connectDB(); // Gọi hàm kết nối trước khi sử dụng request
        const request = new sql.Request();
        await request.query(`INSERT INTO ProcessedData (data) VALUES ('${data}')`);
        console.log('Data saved to database');

        res.status(200).send('Data sent to Kafka');
    } catch (err) {
        console.error('Error sending data:', err);
        res.status(500).send('Error sending data');
    } finally {
        await producer.disconnect();
    }
});

router.get('/data', async (req, res) => {
    const request = new sql.Request();
    try {
        const result = await request.query('SELECT * FROM ProcessedData');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});


module.exports = router;
