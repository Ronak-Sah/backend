import 'dotenv/config'
// import express from 'express'
import { app } from './app.js'
import { connectDB } from './utils/mongoDbConnection.js';


const PORT=process.env.PORT || 3000;
// const app ;




const startServer=async()=>{
    try{
        await connectDB();
        console.log("Mongo DB connected");

        app.listen(PORT, () => {
            console.log('Server is running on http://localhost:3000');
        });

    }catch(err){
        console.error(err);
        process.exit(1);
    }
};


startServer();
