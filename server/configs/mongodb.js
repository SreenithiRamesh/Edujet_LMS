import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the .env file
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the application if connection fails
  }
};

// Event listeners for MongoDB connection state (optional, for debugging)
mongoose.connection.on('connected', () => console.log('Database Connected'));
mongoose.connection.on('error', (err) => console.log(`Database error: ${err}`));

export default connectDB;
