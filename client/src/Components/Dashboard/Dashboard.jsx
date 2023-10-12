import React from 'react';
import styles from './Dashboard.module.css';
import Sector from '../DataAnalytics/SectorData/Sector'; 
import PESTLE from '../DataAnalytics/PestleData/PESTLE';
import Country from '../DataAnalytics/CountryData/country';
import Topic from '../DataAnalytics/TopicsData/topic';
import Relevance from '../DataAnalytics/RelevanceData/relevance';

const Dashboard = () => {
  return (
    <div className={styles.dashboardBox}>
     
        <div className={styles.relevanceComponent}>
          <Relevance />
        </div>
      <div className={styles.dashboardFirstItem}>
        <div className={styles.topicsComponent}>
          <PESTLE />
          </div>
          <div className={styles.topicsComponent}>
          <Topic />
          </div>
      </div>
      <div className={styles.dashboardSecondItem}>
        <div className={styles.sectorComponent}>
          <Sector />
        </div>
        <div className={styles.countryComponent}>
          <Country />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
