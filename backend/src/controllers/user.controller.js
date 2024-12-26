import { asyncHandler } from "../utlis/asynchandler.js";
import  { ApiError } from '../utlis/apierror.js'
import { user } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utlis/cloudinary.js"
import { ApiResponse } from "../utlis/apiresponse.js";

const registeruser = asyncHandler(async(req,res)=>{
   const {fullname,username,email,password} = req.body

   console.log(fullname);
   if (
      [fullname,username,email,password].some((value) => value?.trim()==="")
   ) {
      throw new ApiError(400,"All fields are required")
   }
  
   //  if(!fullname || !username || !email || !password){
   //      throw new ApiError(400,"All fields are required")
   //  }

   function validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
   
    if (!validateEmail(email)) {
      throw new ApiError(400,"Enter a valid email")
    }

    const existedUser = await user.findOne({$or: [ {email},{username}]})
    console.log(existedUser);

    if (existedUser) {
      throw new ApiError(409,"Email or username already exist");
      
    }

    const avatarlocalpath = req.files?.avatar[0]?.path
    const coverimagelocalpath = req.files?.coverimage[0]?.path

    if (!avatarlocalpath ) {
      throw new ApiError(400,"All Avatar is required")
      
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverimage = await uploadOnCloudinary(coverimagelocalpath)

    if (!avatar) {
      throw new ApiError(400,"All Avatar is required");
      
      
    }
    
    user.create({
      fullname,
      username,
      email,
      password,
      avatar:avatar.url,
      coverimage: coverimage?.url || ""
    })

    const createdUser = await user.findOne({ email }).select("-Password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500,"User not found");
      
    }

    // Include the coverimage field in the response
    const responseUser = {
      ...createdUser.toObject(),
      coverimage: coverimage?.url || "",
      avatar : avatar.url
    };

    res.status(201).json({
      statusCode: 201,
      data: responseUser,
      message: "User created successfully",
      success: true
    });
   
})

export {registeruser}