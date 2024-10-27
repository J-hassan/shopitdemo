import express from 'express';
const app = express();
import dotenv from 'dotenv';
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path"
import {fileURLToPath} from "url"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// handling uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err}`);
    console.log("Shutting down server due to Uncaught Exception");
    process.exit(1);

});

// dotenv configuration
dotenv.config({ path: 'backend/config/config.env' });

//connecting to database
connectDatabase();

// for json request
app.use(express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Store raw body for Stripe webhook verification
    }
}));
app.use(cookieParser());

// cors for backend request handling
app.use(cors({
    origin: 'https://mysiteshopit.netlify.app',  // Explicitly set the frontend URL
    credentials: true,
}))


// import all routes
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/stripe.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static(path.join(__dirname,"../frontend/build")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
    })
}


// error handling 
app.use(errorMiddleware);

// app listening
const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port : ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err}`);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    })
})














