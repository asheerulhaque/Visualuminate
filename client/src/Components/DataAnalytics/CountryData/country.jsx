import React, { useState, useEffect } from 'react';
import styles from './country.module.css';
import usaFlag from '../../../assests/flags/usa.svg';
import russiaFlag from '../../../assests/flags/russia.svg';
import chinaFlag from '../../../assests/flags/china.svg';
import iranFlag from '../../../assests/flags/iran.svg';
import indiaFlag from '../../../assests/flags/india.svg';
import saudiArabiaFlag from '../../../assests/flags/saudiarabia.svg';
import iraqFlag from '../../../assests/flags/iraq.svg';
import libyaFlag from '../../../assests/flags/libya.svg';
import indonesiaFlag from '../../../assests/flags/indonesia.svg';
import japanFlag from '../../../assests/flags/japan.svg';

const flagImages = {
  'United States of America': usaFlag,
  'Russia': russiaFlag,
  'China': chinaFlag,
  'Iran': iranFlag,
  'India': indiaFlag,
  'Saudi Arabia': saudiArabiaFlag,
  'Iraq': iraqFlag,
  'Libya': libyaFlag,
  'Indonesia': indonesiaFlag,
  'Japan': japanFlag,
};

const CountryData = () => {
  const [countryData, setCountryData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Fetch data from the '/api/country' endpoint
    fetch('https://visualuminate.vercel.app/api/country')
      .then((response) => response.json())
      .then((data) => {
        // Filter out entries without an _id and remove empty entries
        const filteredData = data.filter((entry) => entry._id && entry.count);

        // Create an object to store counts for these countries
        const countsByCountry = {
          'United States of America': 0,
          'Russia': 0,
          'China': 0,
          'Iran': 0,
          'India': 0,
          'Saudi Arabia': 0,
          'Iraq': 0,
          'Libya': 0,
          'Indonesia': 0,
          'Japan': 0,
        };

        // Calculate the total count for these countries and individual counts
        for (const entry of filteredData) {
          if (entry._id in countsByCountry) {
            countsByCountry[entry._id] += entry.count;
          }
        }

        // Calculate the total count
        const total = Object.values(countsByCountry).reduce((acc, count) => acc + count, 0);

        // Calculate the percentage for each country based on the total count
        const countriesWithPercentage = Object.entries(countsByCountry).map(([country, count]) => ({
          country,
          count,
          percentage: ((count / total) * 100).toFixed(2),
        }));

        setTotalCount(total);
        setCountryData(countriesWithPercentage);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className={styles.countryBox}>
      <div className={styles.countrySpacing}>
        <div className={styles.countryHeading}>
          <h2 className={styles.countrytitle}>Top Countries</h2>
          <span>Total Insight Generated: {totalCount}</span>
        </div>
        {countryData.map((country, index) => (
          <div key={index} className={styles.countryItem}>
            <div className={styles.countryInfo}>
              {flagImages[country.country] && (
                <img
                  src={flagImages[country.country]}
                  alt={`${country.country} Flag`}
                  className={styles.flag}
                />
              )}
              <div className={styles.name}>{country.country}</div>
              
            </div>
            <div className={styles.count}>{country.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryData;
