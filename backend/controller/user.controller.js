import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  { User }  from "../model/user.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import dotenv from "dotenv";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { z } from "zod";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;

export const signup = asyncHandler( async (req,res)=>{
     const { username,fullName,address,email, password,gender,phoneNumber,role,designation,departMent,profilePhoto } = req.body;

    const inputSchema= z.object({
        username: z.string().min(1,"Username is required").max(30),
        fullName: z.string().min(1,"Full name is required").max(100),
        address: z.object({
            houseNo: z.string().min(1,"House number is required"),
            laneNo: z.string().min(1,"Lane number is required"),
            city: z.string().min(1,"City is required"),
            state: z.string().min(1,"State is required"),
            pin: z.string().min(6,"Pin code must be 6 characters long").max(6,"Pin code must be 6 characters long"),
            country: z.string().min(1,"Country is required")
        }),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6,"Password must be at least 6 characters long").max(40),
        gender:z.enum(["Male","Female","Other","PreferNotToSay"]),
        phoneNumber: z.string().min(10,"Phone number must be at least 10 digit").max(10,"At most 10 digit allowed"),
        role:z.enum(["Citizen","Officer","Admin"]).optional().default("Citizen"),
        designation: z.string().min(1,"Designation is required").max(100).optional(),
        departMent: z.string().min(1,"Department is required").max(100).optional(),
    });

    const validatedData = inputSchema.safeParse(req.body);

    if (!validatedData.success) {
        console.log(validatedData.error.flatten());
        throw new ApiError(400, "Invalid input data", validatedData.error.flatten());
}

    
   
   
    const existingUser= await User.findOne({ $or: [{userName:username},{email:email}]});
    if(existingUser){
        
        throw new ApiError(400, "Username or email already exists !!");
    }
    

    const hashedPassword= await bcrypt.hash(password,10);

    const profilePhotoLocalPath = req.file?.path;

    let profilePhotoURL = "";

    if(profilePhotoLocalPath){
        const uploadResult = await uploadOnCloudinary(profilePhotoLocalPath);

        if(!uploadResult){
            throw new ApiError(500,"Cloudinary upload failed");
        }

        profilePhotoURL = uploadResult.secure_url;
    }



    const newUser=await User.create({
        userName: username,
        fullName:fullName,
        address:address,
        email:email,
        password: hashedPassword,
        gender:gender,
        phoneNumber:phoneNumber,
        role:role,
        designation:designation,
        departMent:departMent,
        profilePhotoURL:profilePhotoURL
        

    });

    console.log("User created successfully");

    // res.status(201).json({
    //     message:"User created",
    //     user:newUser
    //     });
    res.status(201).json(new ApiResponse(201,newUser,"User created successfully !!"));
});


export const signin = async (req,res)=>{
     const { userName,password}=req.body;

     const inputSchema=z.object({
        userName: z.string().min(1,"Username is required").max(30,"Username at most can have 30 size"),
        password: z.string().min(3,"Password must be at least 3 characters long").max(40,"At most 40 length can be of the password")
     });
    
     const validatedData = inputSchema.safeParse(req.body);
     if (!validatedData.success) {
        throw new ApiError(400, "Invalid input data", validatedData.error.flatten());
     }

    //  if(!userName || !password){
    //     return res.status(400).send("Username and password required");
    //  }

     const user=await User.findOne({ userName:userName});

     if(!user){
        throw new ApiError(400,"Invalid username or password");
     }

     if(!await bcrypt.compare(password,user.password)){
        throw new ApiError(400,"Incorrect password");
     }

     const userWithoutPassword = user.toObject();
     delete userWithoutPassword.password;

     let JWT_SECRET;
     if(user.role==="Officer"&& user.isVerified){
        JWT_SECRET=process.env.JWT_SECRET_OFFICER;
     }else if(user.role==="Admin"){
        JWT_SECRET=process.env.JWT_SECRET_ADMIN;
     }else{
        JWT_SECRET=process.env.JWT_SECRET;
     }

     const token= jwt.sign({ userId: user._id, userName: user.userName} ,JWT_SECRET,{expiresIn:"240h"});

     res.status(200).json(new ApiResponse(200,{token,user},"Login successfull !!"));

}
