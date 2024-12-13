import { asyncHandler } from "../utlis/asynchandler.js";

const registeruser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})

export {registeruser}