import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(express.json({limit: "20kb"}));    // Limiting the json file
app.use(express.urlencoded({               // Encoding url to standard format 
    extended: true
}));
app.use(cookieParser())

app.get('/', (req, res) => {
        res.send("Hello world");
    }
);


import appRouter from "../src/routes/app.route.js"

app.use("/user",appRouter)


export {app}
