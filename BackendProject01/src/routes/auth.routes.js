import asyncHandler from "../utils/asynchandler";
import user from "../models/user.models"
import jwt from "jsonwebtoken"


export const verifyJwt = asyncHandler(async(req, res, next)=>{
    //req.header postman ke andr hota hai jisme ki authorization phle se hota hai or uske vlaue Bearer hoti hai usko humne replace kiya hai
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer" ,"")

     if(!token){
        throw new ApiError(402,"unauthorized access")
     }
     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     user.findById(decodeToken?._id).select("-password , -refreshtoken")

     if(!user){
        throw new ApiError(401,"Invalid Access Token")
     }
     //req.user ki jagah me or bhi kuch rhk skta tha
     req.user = user

})