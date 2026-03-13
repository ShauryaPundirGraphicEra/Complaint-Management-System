import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import userRoutes from "./route/user.route.js";
import postRoutes from "./route/complain.route.js";
//import commentRoutes from "./route/comment.route.js";



dotenv.config();


mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("MongoDB connected")).catch(err=>console.log(err));

const app = express();
app.use(express.json());
app.use(cors());



export const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100
});



// app.use((err, req, res, next) => {

//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//         errors: err.errors || [],
//         stack: process.env.NODE_ENV === "development" ? err.stack : undefined
//     });

// });


app.use("/api/v1/users",userRoutes);
app.use("/api/v1/",postRoutes);
// app.use("/api/v1",commentRoutes)

 

// app.post("/todo", (req,res)=>{
//   const { username, task } = req.body;

//   if(!username || !task){
//     return res.status(400).send("Username and task required");
//   }

  
// });

// app.delete("/todo",(req,res)=>{
//   const { username ,task}=req.body;

//   if(!username  || !task){
//     return res.status(400).send("Username and task required");
//   }
    
   
// })

// app.get("/todo/:username", (req,res)=>{
//   const { username } = req.params;

   

//   res.json(user.tasks);
// });

 

app.get("/", (req,res)=>{
  res.send("API running");
});


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

app.listen(process.env.PORT || 3000,()=>{
  console.log("Server running on port " + (process.env.PORT || 3000));
});
