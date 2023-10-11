import React, { useState, useEffect } from 'react';
import './PESTLE.css'; // Import your CSS file

const PESTLE = () => {
  const [pestleData, setPestleData] = useState([]);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Fetch data from your API
    fetch('/api/pestle')
      .then((response) => response.json())
      .then((data) => setPestleData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prevFlipped) => !prevFlipped); // Toggle the flipped state
    }, 5000); // Flip the card every 5 seconds (5000 milliseconds)

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const renderPestleData = () => {
    if (pestleData.length === 0) {
      return <p>Loading...</p>;
    }

    return (
      <div className={`card ${flipped ? 'flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
            {pestleData.slice(flipped ? 5 : 0, flipped ? 10 : 5).map((item) => (
              <div key={item._id}>
                <h3>{item._id}</h3>
                <p>Count: {item.count}</p>
              </div>
            ))}
          </div>
          <div className="card-back">
            {pestleData.slice(flipped ? 0 : 5, flipped ? 5 : 10).map((item) => (
              <div key={item._id}>
                <h3>{item._id}</h3>
                <p>Count: {item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <h2>Pestle Data</h2>
      <div className="dashboard-boxes">
        {renderPestleData()}
      </div>
    </div>
  );
};

export default PESTLE;
