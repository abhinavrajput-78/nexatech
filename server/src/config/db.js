const mongoose = require('mongoose');
const config = require('./env');

let isConnectedState = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedState = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnectedState = false;
    console.warn(`[Database Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[Database Warning] Public pages will show dynamic error states and contact submissions will inform users database is unavailable.`);
    return null;
  }
};

mongoose.connection.on('connected', () => {
  isConnectedState = true;
});

mongoose.connection.on('disconnected', () => {
  isConnectedState = false;
});

mongoose.connection.on('error', (err) => {
  isConnectedState = false;
  console.error(`[Database Error] ${err.message}`);
});

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isConnected,
  mongoose,
};
