import React from 'react';
import Sector from '../DataAnalytics/SectorData/Sector'; // Update the path to the Sector component based on your folder structure
import './Dashboard.css'; // Import your CSS file for styling
import PESTLE from '../DataAnalytics/TopicsData/PESTLE'; // Update the path to the TopicsData component based on your folder structure

const Dashboard = () => {
  return (
    <div className="dashboard-box">
      <div className="topics-component">
        <PESTLE />
        </div>
      <div className="sector-component">
        <Sector />
      </div>
      
    </div>
  );
};

export default Dashboard;
