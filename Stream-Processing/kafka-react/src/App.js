import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/data');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:3000/api/data', { data: inputValue });
          setInputValue('');
          setMessage('Data sent to Kafka');
          fetchData(); // Refresh the data after submitting
      } catch (err) {
          console.error(err);
          setMessage('Error sending data');
      }
  };
  

  return (
    <div>
        <h1>Processed Data</h1>
        {message && <p>{message}</p>} {/* Hiển thị thông báo nếu có */}
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter data"
            />
            <button type="submit">Send Data</button>
        </form>
        <ul>
            {data.map(item => (
                <li key={item.id}>{item.data} - {item.processedAt}</li>
            ))}
        </ul>
    </div>
);
};

export default App;
