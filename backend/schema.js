const mongoose= require("mongoose")
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;



const users=new Schema({
    userName:{type:String,unique:true,required:true},
    fullName:{type:String,required:true},
    address:{
        houseNo:{type:String,required:true},
        laneNo:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        pin:{type:String,required:true},
        country:{type:String,required:true}
    },
    email:{ type:String ,unique:true ,required:true},
    password:{type:String,required:true },
    gender:{type:String,enum:["Male","Female","NA"]},
    phoneNumber:{type:String,unique:true},
    isEmployee: { type:Boolean, required:true,default:false},
    departMent: {
            type: String,
            enum: ["Electricity", "RTO", "Water", "PWD", "Police", "SDRF", "NA", "CM", "Health"],
            required: function() {
                return this.isEmployee === true;
            },
            default: "NA"
        },
    createdAt:{type:Date,default:Date.now}
});

const post=new Schema({
    userId:{type:ObjectId,ref:"User"},
    content:{ type: String, required: true },
    photoURL:{ type:[String], required:true },
    visibility:{type:String,enum:["public","private"],default:"public"},
    status:{type:String, enum:["Pending", "In-Progress", "Resolved", "Rejected"],default:"Pending"},
    taggedUsers:[{type:ObjectId,ref:"users"}],
    upVotes: [{ type: ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    downVotes:[{ type: ObjectId, ref: 'User' }],
    downCount: { type: Number, default: 0 },
    reviewByAdministrator:{type:string , required: function(){ return ( this.status=== "Pending" || this.status==="In-Progress")}},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date ,default:Date.now}
})


const comment=new Schema({
    postId: { type: ObjectId, ref: 'Post' },
    userId: { type: ObjectId, ref: 'User' },
    text: { type: String, required: true },
    upVotes: [{ type: ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    downVotes:[{ type: ObjectId, ref: 'User' }],
    downCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const userModel=mongoose.model('User',users);
const postModel=mongoose.model('Post',post);

module.exports={
    userModel,
    postModel
}

 