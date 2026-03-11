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
    isEmployee: { type:Boolean, required:true,default:false},
    designation:{type:String,index:true,required:function(){return this.isEmployee}},
    departMent: {
            type: String,
            index:true,
            required: function() {
                return this.isEmployee;
            },
            default: "NA"
        },
    isVerified:{ type:Boolean,default:false,index:true },
    profilePhotoURL:{type:String,default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"},
},{ timestamps: true });


export const User=mongoose.model('User',users);

