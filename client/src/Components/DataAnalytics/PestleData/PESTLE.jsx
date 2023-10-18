import React, { useState, useEffect, useRef } from 'react';
import config from '../../../config';
import piechart from '../../../assests/img/piechart_3d.png';
import barchart from '../../../assests/img/barchart_3d.png';
import network from '../../../assests/img/network_3d.png';
import styles from './PESTLE.module.css';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

const PESTLE = () => {
  const [pestleData, setPestleData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const delay = 4000;
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    setLoading(true);
    // Fetch data from your API
    fetch(`${config.API_URL}/api/pestle`)
      .then((response) => response.json())
      .then((data) => {
        setPestleData(data);
        setLoading(false); // Set loading to false after data is fetched and set
      })
      .catch((error) => {
        console.error('Error fetching data:', error);

      });
  }, []);


  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
    }, delay);

    return () => {
      resetTimeout();
    };
  }, [index]);

  const images = [piechart, barchart, network];

  const dataSlices = [
    pestleData.slice(0, 4),
    pestleData.slice(4, 8),
    pestleData.slice(6, 10),
  ];

  const colors = [' #2d4739', '#09814a', '#f7e99a'];
  const cardBoxIds = ['cardBoxesOne', 'cardBoxesTwo', 'cardBoxesThree'];

  const handleDotClick = (dotIndex) => {
    resetTimeout();
    setIndex(dotIndex);
  };

  return (
    <div className={styles.slideShow} style={{ backgroundColor: colors[index] }}>
      <div className={styles.slideshowDots}>
        {Array.from({ length: images.length }).map((_, idx) => (
          <div
            key={idx}
            className={`${styles.slideshowDot} ${index === idx ? styles.active : ''}`}
            onClick={() => handleDotClick(idx)}
          ></div>
        ))}
      </div>
      <div className={styles.mainBox} style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {images.map((image, idx) => (
          <div className={styles[cardBoxIds[idx]]} key={idx}>
            <div className={styles.cardTitle}>
              <div>
                <h1>Pestle Analysis</h1>
                <span>Insight Counts</span>
              </div>
              <div>
                <img src={image} style={{ marginTop: '20px', marginLeft: '30px' }} alt="chart" />
              </div>
            </div>
            {loading ? (
              <Grid container spacing={1} style={{marginTop: '10px', marginLeft: '20px'}}>
                {[0, 1, 2, 3].map((index) => (
                  <Grid item xs={6} key={index}>
                    <Skeleton variant="rounded" animation="wave" width="80%" height={60} />
                  </Grid>
                ))}
              </Grid>) : (
              <div className={styles.cardItem}>
                {dataSlices[idx].map((data, dataIndex) => (
                  <div className={styles.cardBoxContent} key={dataIndex}>
                    <h2 className={`${styles.cardBoxText} ${styles.cardBoxCount}`}>{data.count}</h2>
                    <div className={`${styles.cardBoxTitle} ${styles.cardBoxCount}`}>
                      <p>{data._id ? data._id : 'Others'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
            }

          </div>
        ))}
      </div>

    </div>
  );
};

export default PESTLE;
