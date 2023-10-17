
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './topic.module.css';


function Topic() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://visualuminate.vercel.app/api/topic-data')
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
      <h2 className={styles.Heading}>Topic Distribution</h2>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        width={420}
      />
    </div>
  );
}

export default Topic;
