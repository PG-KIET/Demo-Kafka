const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'log-producer',
    brokers: ['localhost:9093','localhost:9094'], // Địa chỉ Kafka broker
});

const producer = kafka.producer();

const sendLog = async (logMessage) => {
    await producer.connect();      // Kết nối tới Kafka
    await producer.send({          // Gửi log tới topic 'logs'
        topic: 'logs',
        messages: [
            { value: logMessage },
        ],
    });
    await producer.disconnect();   // Ngắt kết nối sau khi gửi
};

sendLog('Log message test').catch(console.error);
