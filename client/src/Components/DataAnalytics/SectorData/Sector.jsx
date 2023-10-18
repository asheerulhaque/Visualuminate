import React, { useState, useEffect } from 'react';
import config from '../../../config';
import Chart from 'react-apexcharts';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Sector = () => {
  const [regions, setRegions] = useState([]);
  const [currReg, setCurrReg] = useState('');
  const [sectorData, setSectorData] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  
 
  useEffect(() => {
    setLoading(true);
    // Fetch regions from the API
    fetch(`${config.API_URL}/api/regions`)
      .then((response) => response.json())
      .then((data) => {
        // Remove duplicates and empty values
        const uniqueRegions = Array.from(new Set(data)).filter(Boolean);
        // Update the regions state with the filtered data
        setRegions(uniqueRegions);
        setLoading(false);
        // Check if currReg is empty and there are regions available
        if (!currReg && uniqueRegions.length > 0) {
          setCurrReg(uniqueRegions[0]); // Set the default value to the first region
          
        }
      })
      .catch((error) => {
        console.error('Error fetching regions:', error);
      });
  }, [currReg]); // This useEffect only runs once on component mount

  useEffect(() => {
    setLoading(true);
    // Fetch sector data when currReg changes
    if (currReg) {
      fetch(`${config.API_URL}/api/sector-data-by-region/${currReg}`)
        .then((response) => response.json())
        .then((data) => {
          // Remove the empty sector from the data object
          const filteredData = {};
          for (const sector in data) {
            if (sector && Object.keys(data[sector]).length > 0) {
              filteredData[sector] = data[sector];
            }
          }

          // Update the sectorData state with the filtered data
          setSectorData(filteredData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching sector data:', error);
        });
    }
  }, [currReg]);


    const [chartOptions] = useState({
    chart: {
        id: 'grouped-bar-chart',
        stacked: false,
    },
    xaxis: {
        categories: [], // Will be populated with sector names
        
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '40%',
            distributed: true, // To distribute bars evenly
        },
    },
    dataLabels: {
        enabled: false,
    },
    yaxis: {
        title: {
            text: 'Values',
            
        },
        
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val;
            },
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        markers: {
          fillColors: ['#09814a','#bcb382', '#e5c687'],
      },
    },
});

    

    

    useEffect(() => {
        // Map the provided sector data to the chart series format with custom colors
        const sectorNames = Object.keys(sectorData);
        const paramColors = {
            Intensity: '#09814a',   // Blue color for Intensity
            Relevance: '#bcb382',  // Green color for Relevance
            Likelihood: '#e5c687', // Orange color for Likelihood
        };

        const chartData = ['Intensity', 'Relevance', 'Likelihood'].map((param) => ({
            name: param,
            data: sectorNames.map((sector) => ({
                x: sector,
                y: sectorData[sector][param],
                fillColor: paramColors[param], // Assign color based on parameter
            })),
        }));

        // Update the chart series state with the chart data
        setChartSeries(chartData);
    }, [sectorData]);

    const handleRegionChange = (event) => {
        // Set the selected region when a region is changed
        setCurrReg(event.target.value);
        // Reset the sector and sector data
        
        setSectorData({});
    };

    return (
    <div>
      {loading ? (
      <div style={{margin:'20px'}}>
        <Stack spacing={2}>
          <Skeleton variant='rounded' width={320} height={40}/>
          <Skeleton variant='rounded' width={840} height={430}/>
          </Stack>
      </div>
        ) :(<>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
          <h1 style={{  marginLeft: '20px' ,fontSize:'30px'}}>Sector Reports</h1>
          <div style={{ marginLeft: '20px' ,marginTop:'10px',marginRight:'20px'}}>
              <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel id="demo-select-small-label" >
                  Change Region
              </InputLabel>
              <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={currReg}
                  label="Change Region"
                  onChange={handleRegionChange}
         
              >
                  {regions.map((region) => (
                  <MenuItem  key={region} value={region}>
                      {region}
                  </MenuItem>
                  ))}
              </Select>
              </FormControl>
          </div>
          </div>
         
         
               {chartSeries.length > 0 && (
          <div>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={430} width={900} />
          </div>
               )}
       </>) }
       
    </div>
  );
};

export default Sector;