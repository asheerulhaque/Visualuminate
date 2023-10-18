import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import config from '../../../config';
import styles from './source.module.css';


function Source() {
    const [source, setSource] = useState([]);
    const series = source.map((item) => item.count);

    const options = {
        colors: ['#121619', '#2D4739', '#09814a', '#f7e99a', '#E5C687'],
        labels: source.map((item) => item._id),
        legend: {
            show: true,
            floating: true,
            fontSize: '11px',
            position: 'left',
            offsetY: 40,
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
            },
            itemMargin: {
                vertical: 3
            }
        },
        plotOptions: {
            radialBar: {
                offsetX: 40,
                offsetY: 0,
                startAngle: 0,
                endAngle: 230,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }
            }
        },
    };


    useEffect(() => {
        fetch(`${config.API_URL}/api/source`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((response) => {
                if (Array.isArray(response)) {
                    // Filter out sources with empty values
                    const filteredData = response.filter((item) => item._id && item._id.trim() !== ''); // Only non-empty sources

                    const sortedData = filteredData.sort((a, b) => b.count - a.count); // Sort by count descending

                    const top5Data = sortedData.slice(0, 5); // Top 5 sources
                    setSource(top5Data); // Update the state with the top 5 sources
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div id={styles.chart}>
            <h1 className={styles.title}>Top Sources</h1>
            <ReactApexChart options={options} series={series} type="radialBar" height={300} />
        </div>
    );
}

export default Source;
