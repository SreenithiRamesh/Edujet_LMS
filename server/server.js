import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// Initializing express

const app=express()


await connectDB()
// Middleware

app.use(cors())

// Routes
app.get('/',(req,res)=>res.send("API Working"))
app.post('/clerk',express.json(),clerkWebhooks)

// port number

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})