import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import {user} from "../models/user.models.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";
import jwt from  "jsonwebtoken"
import { Aggregate } from "mongoose";


const generateAccessTokenAndRefreshToken = async(userId)=>{
  try{
    const user = await user.findById(userId)
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken};
  }
  catch(error){
      throw new ApiError(500,"something went wrong when generating accss and refresh token")
  }
}


const registerUser = asyncHandler(async(req,res)=>{
  //  res.status(200).json({
  //   message:"ok",
  //  })
    //get user details from frontend
    //validation -not empty
    //check if user already exits: username,email
    //check for images and avatar,
    //upload them to cloudinary
    //check avatar finally
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res 


    const{fullName, username, email, password}=req.body
    console.log("email:", email);
    //Beginner methods
     if(fullName==""){
        throw new ApiError(404,"fullName are required")
     }
    
    //advance method
    if(
      [fullName, username, email, password].some((field)=>
      field?.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }

    // check user existed or not
    const existeduser = await user.findOne({
      $or:[{username}, {email}]
    })
    if(existeduser){
      throw new ApiError(409,"User already exists")
    }
// checking avatar and coverImage 
   const avatarLocalPath =  req.file?.avatar[0]?.path;
   const coverImageLocalPath = req.file?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"Bad Request")
   }
   // upload avatar and coverImage on cloudinary server
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //mandtory to check avatar other wise further process are not
     if(!avatar){
      throw new ApiError(400,"Bad Request")
     }
    //create user object and create entry in db
        const userCreated = await user.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password,
       })
       //check for user creation
       const checkedUser = await user.findById(userCreated._id).select(
        "-password -refreshToken" 
       )
       if(!checkedUser) {
        throw ApiError(500,'server error at the time of register')
       }

       //send response
       return response.status(201).json(
        new ApiResponse(200,checkedUser,"User register successfully")
       )
  


   })


const loginUser = asyncHandler(async(req,res) => {
     const{email,username,password}=req.body
     if(!(email || username)){
      throw new ApiError(400,"username or password required")
     } 

    const isUserLogin = await user.findOne({
      $or:[{email}, {username}]
     })

     if(!isUserLogin){
      throw new ApiError(404,"Invalid credentials user is not found")
     }
     const isPasswordValid = await user.isPasswordCorrect(password)

     if(!isPasswordValid){
      throw new ApiError(401,"unauthorized access")
     }

    const{accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user_id)
    const loggedInUser = await user.findById(user_id).select(
      "-password -refreshToken"
    )

    const options={
      httpOnly:true,
      secure:true,
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(200,{
        user:loggedInUser, accessToken, refreshToken
      },
      "user logged in successfully"
    )
    )
    


})

const logoutUser = asyncHandler(async(req,res)=>{
        await user.findByIdAndUpdate(req.user.user_id,{
          $set:{refreshToken:undefined},
        },
          {new :true},
        )

        const options = {
          httpOnly:true,
          secure:true
        }

        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(200, (
          new ApiResponse(200,{},"user logged out successfully")
        ))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookie.refreshToken ||req.body.refreshToken 
   if(!incomingRefreshToken){
    throw new ApiError(402,"unauthorizedAccess")
   }

   const decodeRefreshToken = jwt.verify(incomingRefreshToken.process.env.REFRESH_TOKEN_SECRET)

  const user =  await user.findById(decodeRefreshToken?._id)
  if(!user){
    throw new ApiError(402,"UnauthorizedAccess id not found")
  }
  if(incomingRefreshToken !==user?.refreshToken){
    throw new ApiError(401,"Refresh token is expired")
  }
  const options = {
    httpOnly:true,
    secure:true
  }
   const newRefreshToken = await generateAccessTokenAndRefreshToken(user._id)

   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshtoken",newRefreshToken)
   .json(
    new ApiResponse(200,{accessToken,newRefreshToken},"access to be granted by newRefeshToken")
   )
})

const changeCurrentPassword  = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword} = req.body
  const user = await user.findById(user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400,"invalid old password")
  }
  user.password = newPassword
  user.save({validateBeforeSave:false})

  return res
    .status(200)
    .json(
     new ApiResponse(200,{},"Password change successfully"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
        return res.status(200)
        .json(
          new ApiResponse(200,req.user,"Current User fetch Successfully")
        )
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const{fullName, email} = req.body;

  if(!(fullName || email)){
    throw new ApiError(400,"All field are required")
  }

 const user = await user.findByIdAndUpdate(req.user?._id ,
  {
    $set:{
            fullName, //agar key value dono same ho toh sirf value bhi likh skte hai
            email,
         },      
  },
  {new :true}
).select("-password")
   return res
   .status(200)
   .json(new ApiResponse(200,user,"AccountDetails update SuccessFully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
   const avatarLocalPath = await req.file
   if(!avatarLocalPath){
     throw ApiError(404,"Avatar Not found")
   }
   const avatar =await uploadOnCloudinary(avatarLocalPath)
   if(!avatar.url){
    throw new ApiError(404,"avatar not upload on cloudinary")
   } 
   const user = user.findByIdAndUpdate(req.user?._id,{
    $set:{
      avatar:avatar.url
    }
   },
  {new:true}).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "Avatar Image updated successfully")
  )
})
const coverImageUpdate = asyncHandler(async(req,res)=>{
  const coverImageLocalPath = await req.file
  if(!coverImageLocalPath){
     throw ApiError(404,"CoverImage Not found")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!coverImage.url){
      throw new ApiError(404,"CoverImage in not uploaded")
  }
  const user =  await user.findByIdAndUpdate(req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
).select("-password")

   return res
   .status(200)
   .json(
    ApiResponse(2000,user,"CoverImage updated successfully")
   )
})
const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const{username}=req.params
    if(!username?.trim()){
      throw new ApiError(404,"Username missing")
    }
    const channel = await Aggregate([
      {
        $match:{
          username:username
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localfield:"_id",
          foreignfield:"channel",
          as:"subscribers"
        }
       },
       {
        $lookup:{
          from:"subscriptions",
          localfield:"_id",
          foreignfield:"subscriber",
          as:"subscribedto"
        }
       },
      {
        $addfields:{
          subscriberCount:{
            $size : $subscribers
          },
          channelssubscribedbyto:{
            $size : $subscribed
          },
          isSubscribed : 
             {
              $cond:{
                if:{
                  $in:[req.user?._id, $subscribers.subscriber]
                },
                then:true,
                else:false
              }
             }
        }
      },
      {
        $project:{
          fullName:1,
          username:1,
          subscriberCount:1,
          channelssubscribedbyto:1,
          email:1,
          avatar:1,
          coverImage:1
        }
      }
    ])
    if(!channel?.length){
      throw new ApiError(404,"channel doesn't exist")
    }
    return res.status(200)
    .json(ApiError(200,channel[0],"username fetched successfully"))
})

export  {
  registerUser,
  loginUser,
  logoutUser, 
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  coverImageUpdate,
  getUserChannelProfile,
} ;