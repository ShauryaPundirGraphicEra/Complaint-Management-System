
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { z } from "zod";



export const createComplaint = asyncHandler(async (req,res)=>{

    const schema = z.object({
        title: z.string().min(5,"Title must be at least 5 characters"),
        description: z.string().min(10,"Description required"),
        category: z.enum(["Road","Water","Electricity","Garbage","Other"]),
        department: z.string().min(2,"Department required"),
        location: z.object({
            area:z.string(),
            city:z.string(),
            state:z.string(),
            pincode:z.string().length(6)
        })
    });

    const validation = schema.safeParse(req.body);

    if(!validation.success){
        throw new ApiError(400,"Invalid input",validation.error.flatten());
    }

    const {title,description,category,department,location} = validation.data;

    let imageURLs = [];

    if(req.files?.length){

        const uploads = await Promise.all(
            req.files.map(file => uploadOnCloudinary(file.path))
        );

        imageURLs = uploads
            .filter(img => img)
            .map(img => img.secure_url);
    }

    const complaint = await Complaint.create({
        userId:req.id,
        title,
        description,
        category,
        department,
        location,
        images:imageURLs
    });

    res.status(201).json(
        new ApiResponse(201,complaint,"Complaint created successfully")
    );
});



export const supportComplaint = asyncHandler(async (req,res)=>{

    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    const userId = req.id;

    const alreadySupported = complaint.supportVotes
        .some(v => v.toString() === userId);

    if(alreadySupported){

        complaint.supportVotes = complaint.supportVotes
            .filter(v => v.toString() !== userId);

    }else{

        complaint.supportVotes.push(userId);
    }

    await complaint.save();

    res.status(200).json(
        new ApiResponse(200,complaint,"Support vote updated")
    );
});



export const getComplaint = asyncHandler(async (req,res)=>{

    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId)
        .populate("userId","username")
        .populate("assignedOfficer","username");

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    res.status(200).json(
        new ApiResponse(200,complaint,"Complaint fetched successfully")
    );
});



export const getComplaints = asyncHandler(async (req,res)=>{

    const { page = 1, limit = 10 } = req.query;

    const complaints = await Complaint.find()
        .populate("userId","username")
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(Number(limit));

    res.status(200).json(
        new ApiResponse(200,complaints,"Complaints fetched successfully")
    );
});



export const getMyComplaints = asyncHandler(async (req,res)=>{

    const complaints = await Complaint.find({ userId:req.id })
        .sort({createdAt:-1});

    res.status(200).json(
        new ApiResponse(200,complaints,"User complaints fetched")
    );
});



export const deleteComplaint = asyncHandler(async (req,res)=>{

    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    if(complaint.userId.toString() !== req.id){
        throw new ApiError(403,"Not authorized to delete this complaint");
    }

    await complaint.deleteOne();

    res.status(200).json(
        new ApiResponse(200,null,"Complaint deleted successfully")
    );
});



export const reviewComplaint = asyncHandler(async (req,res)=>{

    const { complaintId } = req.params;

    const { status, comment } = req.body;

    if(!["Assigned","In-Progress","Resolved","Rejected"].includes(status)){
        throw new ApiError(400,"Invalid status value");
    }

    const complaint = await Complaint.findById(complaintId);

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    complaint.reviews.push({
        officer:req.id,
        comment,
        status
    });

    complaint.status = status;

    await complaint.save();

    res.status(200).json(
        new ApiResponse(200,complaint,"Complaint reviewed successfully")
    );
});