import mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
    {
       username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
       },
       email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
       },
       fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
       },
       avatar:{
        type:String, //cloudinary url 
        required:true,
       },
       coverImage:{
        type:String, //cloudinary url 
       },
       watchHistory:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
       }
    ],
    password:{
        type:String,
        required:[true, 'Password is required'],
    },
    refreshToken:{
        type:String
    }



    }
,{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    //generating access token  i have a method  that is jwt.sign
    jwt.sign(
        {
            id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )   
}
userSchema.methods.generateRefreshToken = async function(){
    jwt.sign(
        {
         id:this.id,
        },
    
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const user = mongoose.model("user",userSchema)