import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        
    } catch (error) {
        console.error(error);
    }
}



export {connectDB}