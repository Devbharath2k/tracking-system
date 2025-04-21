import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../Utils/logger.js";
dotenv.config();

const Accesstoken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:"1d"
            }
        )
        return token;
    } catch (error) {
        logger.error("Error generating access token", error);
        throw new Error("Error generating access token");
    }
}

const RefreshToken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.REFRESH_TOKEN_SECRET,{
                expiresIn:"1d"
            }
        )
        const updatetoken = await User.updateOne({id : User._id},{$set:{
            refresh_token : token
        }})
        return token;
    } catch (error) {
        logger.error("Error generating access token", error);
        throw new Error("Error generating access token");
    }
}

const Authorization = async (req, res, next) => {
    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ,")[1];
        if (!token) {
            logger.warn("No token provided");
            return res.status(401).json({ message: " token is Unauthorized" });
        }
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            logger.warn("Invalid token provided");
            return res.status(401).json({ message: " jwt is not Unauthorized" });
        }
        req.user = decoded.id;
        next();
    } catch (error) {
        logger.error("Error in authorization middleware", error);
        return res.status(401).json({ message: "internal server error" });
    }
}

export {Accesstoken, RefreshToken, Authorization};