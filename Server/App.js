const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/Visualluminate';
const dbName = 'Visualluminate'; // Name of the database
const collectionName = 'visualdata'; // Name of the collection

// Create a MongoDB client
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors()); // Enable the express server to respond to requests

// Connect to MongoDB
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');

        // Reference to MongoDB collection
        const collection = client.db(dbName).collection(collectionName);


//==========================================================================================//
//==================================API ROUTES==============================================//
//==========================================================================================//

// GET request to retrieve all data
        app.get('/api/all-data', async (req, res) => {
            try {
                // Retrieve data from MongoDB
                const data = await collection.find({}).toArray();
                console.log('Data retrieved from MongoDB:', data.length);
                if (!Array.isArray(data) || data.length === 0) {
                    res.status(404).json({ error: 'Data not found' });
                } else {
                    res.json(data);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

// GET request to retrieve sector data
        app.get('/api/sector-data', async (req,res) => {
            try{
                const data = await collection.find({}).project({ _id: 0, sector: 1 }).toArray();
                console.log('Data retrieved from MongoDB:', data.length);
                if (!Array.isArray(data) || data.length === 0) {
                    res.status(404).json({ error: 'Data not found' });
                } else {
                    // Remove empty values
                    const nonEmptyData = data.filter(item => item.sector.trim() !== '');

                    // Remove duplicate values
                    const uniqueSectors = [...new Set(nonEmptyData.map(item => item.sector))];

                    res.json(uniqueSectors);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });

            }
        });


// GET request to retrieve region data
        app.get('/api/regions', async (req, res) => {
            try {
                // Retrieve unique regions from MongoDB
                const regions = await collection.distinct('region');
                res.json(regions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

// GET request to retrieve sector data for each region
        app.get('/api/data-by-region/:region', async (req, res) => {
            try {
                const { region } = req.params;

                // Retrieve sector data within the specified region
                const data = await collection.find({ region }).toArray();

                // Format the data for the response
                res.json(data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        
// GET request to retrieve |Intensity|Relevance|Likelihood| of each sector-data for each region        
        app.get('/api/sector-data-by-region/:region', async (req, res) => {
            try {
                const { region } = req.params;

                // Retrieve data for all sectors within the specified region
                const data = await collection.find({ region }).toArray();

                if (!data || data.length === 0) {
                    res.status(404).json({ error: 'Data not found' });
                } else {
                    // Create an object to hold data for all sectors
                    const sectorData = {};

                    // Loop through the data and extract intensity, relevance, and likelihood for each sector
                    data.forEach((item) => {
                        sectorData[item.sector] = {
                            Intensity: item.intensity,
                            Relevance: item.relevance,
                            Likelihood: item.likelihood,
                        };
                    });

                    res.json(sectorData);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

    // GET request to retrieve topic data
        app.get('/api/topic-data', async (req, res) => {
            try {
                // Retrieve data from MongoDB
                const data = await collection.find({}).toArray();

                // Calculate the count of each distinct topic
                const topicCounts = {};
                data.forEach((item) => {
                    const topic = item.topic;
                    if (topicCounts[topic]) {
                        topicCounts[topic]++;
                    } else {
                        topicCounts[topic] = 1;
                    }
                });

                // Prepare the response as an object with topics and counts
                const response = Object.entries(topicCounts).map(([topic, count]) => ({
                    topic,
                    count,
                }));

                res.json(response);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        // Define a route to fetch PESTLE category data
        app.get('/api/pestle', async (req, res) => {
            try {
                // Query MongoDB to count insights by PESTLE category
                const pestleData = await collection.aggregate([
                    {
                        $group: {
                            _id: '$pestle',
                            count: { $sum: 1 },
                        },
                    },
                ]).toArray();

                res.json(pestleData);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        //Api route for country data
        app.get('/api/country', async (req, res) => {
            try {
                // Query MongoDB to count insights by country
                const countryData = await collection.aggregate([
                    {
                        $group: {
                            _id: '$country',
                            count: { $sum: 1 },
                        },
                    },
                ]).toArray();

                res.json(countryData);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        

       

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
