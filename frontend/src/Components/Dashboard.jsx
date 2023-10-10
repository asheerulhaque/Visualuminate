import React from 'react';
import Sector from './DataAnalytics/Sector'; // Update the path to the Sector component based on your folder structure
import './Dashboard.css'; // Import your CSS file for styling


const Dashboard = () => {
  return (
    <div className="dashboard-box">
      <div className="sector-component">
        <Sector />
      </div>
    </div>
  );
};

export default Dashboard;
