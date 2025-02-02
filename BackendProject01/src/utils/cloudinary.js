import {v2 as cloudinary} from "cloudinary";
import { response } from "express";
import fs from 'fs'

// (async function(){


    // Configuration
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

 
const uploadOnCloudinary = async (localFilePath)=>{
     const localFilePath = 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg'
    try{
        if(!localFilePath)return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        }) 
        console.log(`file has been uploaded successfully ${response.localFilePath}`)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        //remove the locally saved tempory file as the upload operation got falied
        return null
    }
     
}
export default uploadOnCloudinary;

//--------------- Yeh bhi ek option hai fileuploading kajo ki sahi hai-------------
//     const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });
// })();

