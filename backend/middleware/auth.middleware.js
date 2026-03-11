import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const JWT_SECRET =process.env.JWT_SECRET;

export const authMiddleware=(req,res,next)=>{
     const token= req.headers.authorization || req.headers.token;

     if(!authHeader ){
        return res.status(401).send("Authorization header missing");
     }

     const verify=jwt.verify(authHeader,JWT_SECRET);

     if(!verify){
        return res.status(401).send("Invalid token");
     }

     const user=jwt.decode(token);

     res.id=user.userId;

     console.log("Token verified");

     next();
}

export const isGovernmentEmployee=asyncHandler(async(req,res,next)=>{
    const token= req.headers.authorization || req.headers.token;

     if(!authHeader ){
        return res.status(401).send("Authorization header missing");
     }

     const verify=jwt.verify(authHeader,JWT_SECRET);

     if(!verify){
        return res.status(401).send("Invalid token");
     }

     const user=jwt.decode(token);

     res.id=user.userId;

     const foundUser=await User.findById(res.id);
     if(!foundUser){
         throw new ApiError(404,"User not found");
     }

     if(!foundUser.isEmployee || !foundUser.isVerified){
       throw new ApiError(403,"Access denied. Only government employees allowed");
     }

   res.id=user.userId;

    next();

});