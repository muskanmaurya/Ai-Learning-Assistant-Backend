import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import UserModel from '../models/User.js';
import { json } from 'express';

//generate jwt token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE || '7d',
    })
}

//@desc register a new user
//@route POST /api/auth/register
//@access public

export const register=async(req,res,next)=>{
    try {
        const {username,email,password}=req.body;

        //check if user already exists
        const userExists=await User.findOne({
            $or:[{email},{username}]
        })

        if(userExists){
            return res.status(400).json({
                success:false,
                error:userExists.email===email?"Email already exists":"Username already taken",
                statusCode:400
            })
        }

        //create user
        const user=await UserModel.create({
            username,
            email,
            password,
        });

        //generate token
        const token=generateToken(user._id);

        res.status(201).json({
            success:true,
            data:{
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    profileImage:user.profileImage,
                    createdAt:user.createdAt,
                },
                token,
            }, 
            message:"User registered successfully",
        })

        
    } catch (error) {
        next(error);
        console.log(error);
        res.status(500).json({
            success:false,
            error:"server error",
            json:error.message,
        })
        
    }
}

//@desc login user
//@route POST /api/auth/login
//@access public
export const login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;

        //validate email and password
        if(!email || !password){
            return res.status($00).json({
                success:false,
                error:"please provide email and passowrd",
                statusCode:400,
            })
        }

        //check for user (include password for comparison)
        const user=await UserModel.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({
                success:false,
                error:"invalid credentials",
                statusCode:401,
            })
        }

        //check password 
        const isMatch=await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:"Invalid credentials",
                statusCode:401,
            });
        }

        //generate token 
        const token=generateToken(user._id);

        res.status(200).json({
            success:true,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
            },
            token,
            message:"Logged in successfully"
        })
        
    } catch (error) {
        next(error)
        console.log(error);
        res.status(500).json({
            success:false,
            error:"server error",
            json:error.message,
        })
        
    }
}

//@desc get user profile
//@route GET /api/auth/profile
//@access private
export const getProfile=async(req,res,next)=>{
    try {
        const user=await UserModel.findById(req.user._id);

        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt,
            }
        })
        
    } catch (error) {
        next(error);
        console.log(error);
        res.status(500).json({
            success:false,
            error:"server error",
            json:error.message,
        })
    }
}

//@desc update user profile
//@route PUT /api/auth/profile
//@access private
export const updateProfile=async(req,res,next)=>{
    try {
        // console.log('=== DEBUG updateProfile ===');
        // console.log('req.body:', req.body);
        // console.log('Content-Type:', req.headers['content-type']);
        // console.log('===========================');
        
        const {username,email,profileImage}=req.body;

        const user=await UserModel.findById(req.user._id);

        if(username) user.username=username;
        if(email) user.email=email;
        if(profileImage) user.profileImage=profileImage;

        await user.save();

        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
            },
            message:"Profile updated successfully"
        })

    } catch (error) {
        next(error);
        console.log(error);
        res.status(500).json({
            success:false,
            error:"server error",
            json:error.message,
        })
        
    }
}

//@desc change password
//@route POST /api/auth/change-password
//@access private
export const changePassword=async(req,res,next)=>{
    try {
        console.log('=== DEBUG changePassword ===');
        console.log('req.body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('===========================');
        
        const {currentPassword, newPassword}=req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success:false,
                error:"please provide current and new password",
                statusCode:400,
            })
        }

        const user=await UserModel.findById(req.user._id).select("+password");

        //check current password
        const isMatch=await user.matchPassword(currentPassword);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:"current password is incorrect",
                statusCode:401,
            })
        }

        //update passowrd
        user.password=newPassword;

        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed successfully" 
        })
        
    } catch (error) {
        next(error);
        console.log(error);
        res.status(500).json({
            success:false,
            error:"server error",
            json:error.message, 
        })
    }
}
