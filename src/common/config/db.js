import mongoose from "mongoose"

const connectDB = async () =>{
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connections.host}`)
}

export default connectDB;