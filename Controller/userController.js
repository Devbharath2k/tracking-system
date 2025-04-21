import { StatusCodes } from "http-status-codes";
import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();
import cloudinary from '../Config/cloudnary.js';
import logger from "../Utils/logger.js";
import getdatauri from '../Utils/datauri.js'
import { Accesstoken, RefreshToken } from "../Middleware/generateToken.js";
import generateOtp from "../Utils/generateotp.js";
import transporter from '../Config/nodemailer.js'

const Userprofiler = {
    register : async (req, res) => {
        try {
            const {fname, lname, email, password, role} = req.body;
            if(!fname || !lname || !email || !password || !role){
                logger.error("Please fill all the fields");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Please fill all the fields"});
            }
            const exitingUser = await User.findOne({email});
            if(exitingUser){
                logger.error("User already exists");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists"});
            }
            let profilephotourl = null;
            const file = req.file;
            if(file){
                const parser = getdatauri(file);
                const cloudResponse = await cloudinary.uploader.upload(parser.content,{
                    folder:"Profile",
                })
                profilephotourl = cloudResponse.secure_url;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                fname,
                lname,
                email,
                password: hashedPassword,
                role,
                profile:{
                    profilephoto: profilephotourl,
                }
            });
            await user.save();
            const mailoptions ={
                from : process.env.NODEMAILER_USER,
                to : user.email,
                subject : "Welcome to our tracking life-style ",
                html : `<h1>Welcome ${user.fname} ${user.lname}</h1><p>Thank you for registering with us</p>`
            }
            transporter.sendMail(mailoptions);
            logger.info(`User ${fname} ${lname} registered successfully`);
            return res.status(StatusCodes.CREATED).json({message: "User registered successfully", user});
        } catch (error) {
            logger.error("Error in register", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
        }
    },
    login : async (req, res) => {
        try {
            const {email, password, role} = req.body
            if(!email || !password || !role){
                logger.warn("Please fill all the fields");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Please fill all the fields"});
            }
            let user = await User.findOne({email});
            if(!user){
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            if(user.role !== role){
                logger.warn("Invalid role");
                return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid role"});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                logger.warn("Password matched");
                return res.status(StatusCodes.UNAUTHORIZED).json({message: "Password matched"});
            }
            if(user.isstatus !== 'active'){
                logger.warn("User is not active");
                return res.status(StatusCodes.UNAUTHORIZED).json({message: "User is not active"});
            }
            const accesstoken = await Accesstoken(user._id);
            const refreshtoken = await RefreshToken(user._id);
            await User.updateOne({id : user._id},{
                $set:{
                    lastLogin : new Date(),
                }
            })
            const cookieOptions = {
                httpOnly : true,
                sameSite :"lax",
                secure : process.env.NODE_ENV === "production",
            }
            res.cookie('access_token', accesstoken, cookieOptions);
            res.cookie('refresh_token', refreshtoken, cookieOptions);
            res.status(StatusCodes.ACCEPTED).json({
                message: `welcome back to ${user.fname} ${user.lname}`,
                user:{
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    role: user.role,
                    profilephoto: user.profilephoto,
                },
                accesstoken,
                refreshtoken,
                success: true,
            })
            logger.info(`User ${user.fname} ${user.lname} logged in successfully`,);
        } catch (error) {
            logger.error("Error in login", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
        }
    },
    updateprofile: async (req, res) => {
        try {
            const { fname, lname, email, phone, bio, skills } = req.body;
            const userId = req.user;
    
            const user = await User.findById(userId);
            if (!user) {
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
            }
    
            if (fname) user.fname = fname;
            if (lname) user.lname = lname;
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email });
                if (emailExists) {
                    return res.status(StatusCodes.CONFLICT).json({ message: "Email already in use" });
                }
                user.email = email;
            }
            if (phone) user.phone = phone;
    
            user.profile = user.profile || {};
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skills.split(",").map(skill => skill.trim());
    
            await user.save();
    
            logger.info(`User ${user._id} (${user.fname} ${user.lname}) updated successfully`);
    
            return res.status(StatusCodes.OK).json({
                message: "Profile updated successfully",
                user: {
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    phone: user.phone,
                    profilephoto: user.profile.profilephoto,
                    bio: user.profile.bio,
                    skills: user.profile.skills,
                },
                success: true,
            });
    
        } catch (error) {
            logger.error("Error in update profile", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    },    
    forgotpassword : async (req, res) => {
        try {
            const {email} = req.body;
            if(!email){
                logger.warn("Please fill all the fields");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Please fill all the fields"});
            }
            let user = await User.findOne({email});
            if(!user){
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            const otp = await generateOtp();
            const expiryTime = new Date(Date.now() + 10*60*1000); // 10 minutes from now
            user.forgot_password_otp = otp;
            user.forgot_password_expiry = expiryTime;
            await user.save();

            const mailoptions = {
                from : process.env.NODEMAILER_USER,
                to : user.email,
                subject : "Forgot Password",
                html : `kindly check this this link to reset your password ${otp}`
            }
            transporter.sendMail(mailoptions);
            logger.info(`Email sent to ${user.email} with otp ${user.forgot_password_otp}`);

            return res.status(StatusCodes.OK).json({message: "Email sent successfully", success: true});
        } catch (error) {
            logger.error("Error in forgot password", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
            
        }
    },
    verfiypassword : async (req, res) => {
        try {
            const {email, otp} = req.body;
            if(!email || !otp){
                logger.warn("Please fill all the fields");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Please fill all the fields"});
            }
            let user = await User.findOne({email});
            if(!user){
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            if(!user.forgot_password_otp || !user.forgot_password_expiry){
                logger.warn("OTP not found or expired");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "OTP not found or expired"});
            }
            if(user.forgot_password_otp !== otp){
                logger.warn("Invalid OTP");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid OTP"});
            }
            if(user.forgot_password_expiry < new Date()){
                logger.warn("OTP expired");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "OTP expired"});
            }
            user.forgot_password_otp = null;
            user.forgot_password_expiry = null;
            await user.save();
            logger.info(`OTP verified for ${user.email}`);
            return res.status(StatusCodes.OK).json({message: "OTP verified successfully", success: true});

        } catch (error) {
            logger.error("Error in verify password", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
        }
    },
    resetpassword : async (req, res) => {
        try {
            const {email, password, confirmpassword} = req.body;
            if(!email || !password || !confirmpassword){
                logger.warn("Please fill all the fields");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Please fill all the fields"});
            }
            let user = await User.findOne({email});
            if(!user){
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            if(password !== confirmpassword){
                logger.warn("Password and confirm password do not match");
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Password and confirm password do not match"});
            }
            const saltrounds =10;
            const hashedpassword = await bcrypt.hash(password, saltrounds);
            user.password = hashedpassword;
            await user.save();
            logger.info(`Password reset successfully for ${user.email}`);
            return res.status(StatusCodes.OK).json({message: "Password reset successfully", success: true});
        } catch (error) {
            logger.error("Error in reset password", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
        }
    },
    logout : async (req, res) => {
        try {
            const userId = req.user;
            const user = await User.findById(userId);
            if(!user){
                logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            const cookieOptions = {
                httpOnly : true,
                sameSite :"lax",
                secure : process.env.NODE_ENV === "production",
            }
            res.clearCookie('access_token', cookieOptions);
            res.clearCookie('refresh_token', cookieOptions);

            logger.info(`User ${user.fname} ${user.lname} logged out successfully`);

            res.status(StatusCodes.ACCEPTED).json({message: "Logout successfully", success: true});

        } catch (error) {
            logger.error("Error in logout", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"});
        }
    }
}

export default Userprofiler;