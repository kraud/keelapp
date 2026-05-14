const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

let mongo;

const connectDB = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
};

const clearDB = async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
};

const closeDB = async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
};

module.exports = { connectDB, clearDB, closeDB };
