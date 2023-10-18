import React, { useEffect, useState } from 'react';
import config from '../../../config';
import ReactApexChart from 'react-apexcharts';
import styles from './topic.module.css';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function Topic() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${config.API_URL}/api/topic-data`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        // Filter out topics with empty values
        const filteredData = responseData.filter((item) => item.topic.trim() !== ''); // Only non-empty topics

        // Find topics with counts below 10
        const topicsWithLowCount = filteredData.filter((item) => item.count < 10);
        
        // Calculate the sum of counts for topics with low counts
        const sumOfLowCounts = topicsWithLowCount.reduce((sum, item) => sum + item.count, 0);

        // Add an "Others" category with the aggregated count
        const aggregatedData = [
          ...filteredData.filter((item) => item.count >= 10), // Topics with counts >= 10
          { topic: 'Others', count: sumOfLowCounts }, // "Others" category
        ];

        setData(aggregatedData);
       setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const colors = ['#121619', '#2D4739', '#09814a', '#f7e99a', '#E5C687'];

  const chartOptions = {
    labels: data.map((item) => item.topic),
    
    colors: colors,
  };

  const chartSeries = data.map((item) => item.count);

  return (
    <div className={styles.topicBox}>
      {loading ? (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Stack spacing={1}>
          <Skeleton variant='text' sx={{ fontSize: '3rem' }} width={250} />
          <Skeleton variant="circular" height={220} width={220} />
        </Stack>
        <Stack spacing={1}>
          <Skeleton variant="rounded" width={160} height={10} />
           <Skeleton variant="rounded" width={160} height={10} />
            <Skeleton variant="rounded" width={160} height={10} />
             <Skeleton variant="rounded" width={160} height={10} />
        </Stack>
        </div>
      ) : (
        <>
        <h2 className={styles.Heading}>Topic Distribution</h2>
       <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        width={420}
      />
      </>
      )

      }
      
    </div>
  );
}

export default Topic;
