import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(express.json({limit: "20kb"}));    // Limiting the json file
app.use(express.urlencoded({               // Encoding url to standard format 
    extended: true,
    limit: "20kb"
}));
app.use(cookieParser())

app.get('/', (req, res) => {
        res.send("Hello world");
    }
);


export {app}
