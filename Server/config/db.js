const MongoClient = require('mongodb').MongoClient;
const mongoURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client;
};

module.exports = connectToDatabase;

