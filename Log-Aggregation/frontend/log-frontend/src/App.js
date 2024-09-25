import React, { useEffect, useState } from 'react';

function App() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Lấy log từ API backend
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/logs');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLogs(data); // Cập nhật logs với dữ liệu nhận được
            } catch (error) {
                console.error('Error fetching logs:', error); // Hiển thị lỗi trong console
            }
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <h1>Log Viewer</h1>
            <ul>
                {logs.map((log) => (
                    <li key={log.Id}>{log.Message} - {new Date(log.Timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
