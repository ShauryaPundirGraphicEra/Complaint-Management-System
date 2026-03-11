import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
// first the file from the user we store in the local storage then after we store from local storage to clou
// cloudinary throug the multer and then delete the locally stored file using file fs of node js 
// The credential for the cloud name<api key and api secret are in the .env file


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    

    // it takes time so async await ,and it can get error so try and catch
    const uploadOnCloudinary= async(localFilePath)=>{
        try{
                if(!localFilePath)return null;

                //upload the file on cloudinary from local path
               const response= await cloudinary.uploader.upload(localFilePath, { resource_type:'auto'});

                console.log("File uploaded successfull ,yehh!!!!");
                await fs.promises.unlink(localFilePath)
                return response;      
        }catch(error){
           await fs.promises.unlink(localFilePath) //remove the locaaly  saved temp file
            return null;
        }

    }

export {uploadOnCloudinary};