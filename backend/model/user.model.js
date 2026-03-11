import mongoose from "mongoose";
const Schema=mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;



const users=new Schema({
    userName:{type:String,unique:true,required:true,index:true},
    fullName:{type:String,required:true},
    address:{
        houseNo:{type:String,required:true},
        laneNo:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        pin:{type:String,required:true,length:6},
        country:{type:String,required:true}
    },
    email:{ type:String ,unique:true ,required:true,index:true},
    password:{type:String,required:true },
    gender:{type:String,enum:["Male","Female","Other","PreferNotToSay"]},
    phoneNumber:{type:String,unique:true},
    role: { type:String, enum:["Citizen","Officer","Admin"],required:true,default:"Citizen",index:true},
    designation:{type:String,index:true,required:function(){return this.role==="Officer"; }},
    departMent: {
            type: String,
            index:true,
            required: function() {
                return this.designation && this.role==="Officer";
            }
        },
    isVerified:{ type:Boolean,default:false,index:true }, //this can only be set to true by admin after verifying the officer;s credential

    profilePhotoURL:{type:String,default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"},
    assignedComplaints:[{ type:ObjectId, ref: 'Complaint' ,index:true,required:function(){ return this.role==="Officer"; }}]
},{ timestamps: true });


export const User=mongoose.model('User',users);

