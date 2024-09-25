const { Kafka } = require('kafkajs');
const sql = require('mssql');

const kafka = new Kafka({
    clientId: 'log-consumer',
    brokers: ['localhost:9093','localhost:9094'], // Kafka broker
});

const consumer = kafka.consumer({ groupId: 'log-group' });

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

const saveLogToDB = async (logMessage) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('log', sql.VarChar, logMessage)
            .query('INSERT INTO Logs (Message) VALUES (@log)');
        console.log('Log saved to DB!');
    } catch (err) {
        console.error('Database error: ', err);
    }
};

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'logs', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const logMessage = message.value.toString();
            console.log(`Received log: ${logMessage}`);
            await saveLogToDB(logMessage);
        },
    });
};

run().catch(console.error);
