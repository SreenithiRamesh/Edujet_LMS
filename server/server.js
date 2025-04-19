import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import serverless from 'serverless-http';  // Import serverless-http

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Global middleware for JSON parsing

// Database connection
const connectServer = async () => {
  try {
    await connectDB();
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to the database', error);
    process.exit(1);  // Exit if the connection fails
  }
};

connectServer();

// Routes
app.get('/', (req, res) => res.send('API Working ✅'));
app.post('/clerk', clerkWebhooks);

// Export serverless function for Vercel
export default serverless(app);

// For local deployment (this part will not be needed in Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
