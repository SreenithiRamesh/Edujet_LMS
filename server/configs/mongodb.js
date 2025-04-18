import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async ()=>{
mongoose.connection.on('connected', () => console.log('DatabaseConnected'))
await mongoose.connect(`${process.env.MONGODB_URI}/Learning Management System_ Edujet`)
}
export default connectDB