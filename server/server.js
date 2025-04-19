import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';  // Import the connection function
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();  // Establish MongoDB connection
    console.log('✅ Database connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);  // Exit if MongoDB connection fails
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('API Working ✅');
});

app.post('/clerk', clerkWebhooks);

// Start server
startServer();
