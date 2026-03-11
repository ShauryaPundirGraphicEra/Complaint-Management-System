import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
import { User } from "../model/user.model.js";
import { Complaint } from "../model/complain.model.js";

dotenv.config();

const JWT_SECRET =process.env.JWT_SECRET;
const JWT_SECRET_OFFICER=process.env.JWT_SECRET_OFFICER;
const JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN;

export const authMiddleware=(req,res,next)=>{
     const token= req.headers.authorization || req.headers.token;

     if(!token){
        return res.status(401).send("Authorization header missing");
     }

     let verify;
   
     try {
         verify = jwt.verify(token, JWT_SECRET); // Try Citizen first
     } catch (err) {
         try {
             verify = jwt.verify(token, JWT_SECRET_OFFICER); // Try Officer second
         } catch (err2) {
             try {
                 verify = jwt.verify(token, JWT_SECRET_ADMIN); // Try Admin last
             } catch (err3) {
                
                 return res.status(401).send("Invalid token signature");
             }
         }
     }

     
     req.id = verify.userId;
     console.log("Token verified successfully");

     next();
}

export const isGovernmentEmployee=asyncHandler(async(req,res,next)=>{
   try{ 
   const token= req.headers.authorization || req.headers.token;

     if(!token ){
        return res.status(401).send("Authorization token from header missing");
     }

     if (!process.env.JWT_SECRET_OFFICER) {
      throw new Error("JWT_SECRET_OFFICER is not defined in .env");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_OFFICER);

    req.id = decoded.userId;

    const foundUser = await User.findById(req.id);
    if (!foundUser) {
      throw new ApiError(404, "User not found");
    }

    if (foundUser.role !== "Officer" || !foundUser.isVerified) {
      throw new ApiError(403, "Access denied. Only government employees allowed");
    }

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token signature");
    }
    throw err;
  }
});

export const isAdmin=asyncHandler(async(req,res,next)=>{
   const token=req.headers.authorization || req.headers.token;
   
   if(!token){
      throw new ApiError(401,"Authoriation token header missing");
   }
   
   const verify=jwt.verify(token,process.env.JWT_SECRET_ADMIN);
   if(!verify){
      throw new ApiError(401,"Invalid token");
   }

   const user=jwt.decode(token);

   req.id=user.userId;

   next();
})