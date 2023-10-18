const connectToDatabase = require('../config/db');

const databaseMiddleware = async (req, res, next) => {
    try {
        const client = await connectToDatabase();
        req.databaseClient = client;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = databaseMiddleware;
