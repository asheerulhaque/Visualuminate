require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
// Import API routes and middleware
const apiRoutes = require('./routes/api');
const databaseMiddleware = require('./middleware/database');


// Define the API routes
app.use('/api', apiRoutes);

// Apply the database middleware to all routes
app.use(databaseMiddleware);

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});