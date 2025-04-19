import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../server/configs/mongodb.js';
import { clerkWebhooks } from '../server/controllers/webhooks.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

// Routes
app.get('/', (req, res) => res.send("API Working ✅"));
app.post('/clerk', clerkWebhooks);

// ✅ THIS is what Vercel needs
export default serverless(app);
