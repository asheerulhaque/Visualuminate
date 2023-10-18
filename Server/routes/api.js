const express = require('express');
const router = express.Router();
const databaseMiddleware = require('../middleware/database'); // Import the database middleware

//==========================================================================================
//==================================API ROUTES==============================================
//==========================================================================================

// Use the database middleware for all API routes
router.use(databaseMiddleware);

// Handle GET request to '/'
router.get('/', (req, res) => {
    res.send('API is working properly');
});


// Handle GET request to '/all-data'
router.get('/all-data', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
}
);

// Handle GET request to '/sector-data'
router.get('/sector-data', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
});

// Handle GET request to '/regions'
router.get('/regions', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        // Retrieve unique regions from MongoDB
        const regions = await collection.distinct('region');
        res.json(regions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/data-by-region/:region'
router.get('/data-by-region/:region', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        const { region } = req.params;

        // Retrieve sector data within the specified region
        const data = await collection.find({ region }).toArray();

        // Format the data for the response
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/sector-data-by-region/:region'
router.get('/sector-data-by-region/:region', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/topic-data'
router.get('/topic-data', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/pestle'
router.get('/pestle', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/country'
router.get('/country', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
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
    finally {
        req.databaseClient.close();
    }
});


// Handle GET request to '/source'
router.get('/source', async (req, res) => {
    try {
        const collection = req.databaseClient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        // Query MongoDB to count insights by source
        const sourceData = await collection.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                },
            },
        ]).toArray();

        res.json(sourceData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    finally {
        req.databaseClient.close();
    }
});




module.exports = router;