const express = require('express');
const { Kafka } = require('kafkajs');
const { connectDB, sql } = require('./database/db');
const alertRoutes = require('./router/alertRoutes');

const app = express();
app.use(express.json());
app.use('/api', alertRoutes); 

const kafka = new Kafka({
    clientId: 'stream-processing-app',
    brokers: ['localhost:9093', 'localhost:9094'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'stream-group' });

const runKafka = async () => {
    await producer.connect();
    await consumer.connect();

    consumer.subscribe({ topic: 'stream-data', fromBeginning: true });

    consumer.run({
        eachMessage: async ({ message }) => {
            const data = message.value.toString();
            console.log(`Received message: ${data}`);

            // Lưu vào SQL Server
            try {
                // Kiểm tra kết nối trước khi thực hiện truy vấn
                const request = new sql.Request();
                await request.query(`INSERT INTO ProcessedData (data) VALUES ('${data}')`);
                console.log('Data saved to database');
            } catch (err) {
                console.error('Database insert error:', err);
            }
        }
    });
};

const startApp = async () => {
    await connectDB(); // Kết nối đến SQL Server một lần
    await runKafka();
};

startApp();

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
