import jwt from 'jsonwebtoken';
import UserModel from "../models/User.js";

const protect=async(req ,res ,next)=>{
    let token;

    //check if token exists in authorization header 
    if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
        try {
            token=req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(401).json({
                    success:false,
                    error:"user not found",
                    statusCode:401
                });
            }
            next();
        } catch (error) {
            console.log("Auth middleware error: ",error.message);

            if(error.name==="TokenExpiredError"){
                return res.status(401).json({
                    success:false,
                    error:"Token has expired, please login again",
                    statusCode:401
                })
            }

            return res.status(401).json({
                success:false,
                error:"Not authorised, token failed",
                statusCode:401
            });    
        }
    }
    if(!token){
        return res.status(401).json({
            success:false,
            error:"not authorised, no token",
            statusCode:401,
        });
    }
    
}

export default protect;