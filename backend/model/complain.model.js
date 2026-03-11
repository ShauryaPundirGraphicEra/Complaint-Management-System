import mongoose from "mongoose";

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const reviewSchema = new Schema({
    
    officer:{
        type:ObjectId,
        ref:"User",
        required:true
    },

    comment:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Assigned","In-Progress","Resolved","Rejected"],
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

},{ _id:false });



const complaintSchema = new Schema({

    userId:{
        type:ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:String,
        enum:["Road","Water","Electricity","Garbage","Other"]
    },

    department:{
        type:String,
        required:true
    },

    location:{
        area:String,
        city:String,
        state:String,
        pincode:String
    },

    images:{
        type:[String],
        default:[]
    },

    supportVotes:[{
        type:ObjectId,
        ref:"User"
    }],

    status:{
        type:String,
        enum:["Pending","Assigned","In-Progress","Resolved","Rejected"],
        default:"Pending"
    },

    assignedOfficer:{
        type:ObjectId,
        ref:"User"
    },

    reviews:[reviewSchema]

},{timestamps:true});



const Complaint = mongoose.model("Complaint",complaintSchema);

export { Complaint };