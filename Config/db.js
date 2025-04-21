import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import logger from "../Utils/logger.js";

const Mongodb = process.env.MONGO_URI;

if(!Mongodb){
    logger.error("Mongo URI is not defined in .env file");
    throw new Error("Mongo URI is not defined in .env file");
}

const HandlerConnetion = async () => {
    try {
        await mongoose.connect(Mongodb);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1); // Exit the process with failure
    }
}

export default HandlerConnetion;