import { handleerror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"

export const verifyJWT=asynchandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        console.log("token:",token)
        if(!token)
        {   console.log('error here 1');
        
            throw new handleerror(401,"UnAuthorized Error can not access");
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedtoken)
        {
            console.log('error here 2');
            
            throw new handleerror(401,"Invalid Access Token")
        }
        
        const user=await User.findById(decodedtoken?._id).select("-password -RefreshToken")
        if(!user)
        {
            console.log('error here 3');
            
            throw new handleerror(401,"Invalid Access Token")
        }
        req.user=user;
        next()
    } catch (error) {
            throw new handleerror(401,error,"Already Logged out")
    }
})