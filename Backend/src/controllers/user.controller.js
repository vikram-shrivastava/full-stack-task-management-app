import { asynchandler} from "../utils/asynchandler";
import {handleresponse} from "../utils/apiresponses";
import {handleerror} from "../utils/apierror";
import User from "../models/user.models"
import jwt from "jsonwebtoken";
const generateAccessandRefreshtoken=async(userid)=>{
    try {
        const user=await User.findById(userid);
        const accesstoken=user.generateaccesstoken();
        const refreshtoken=user.generaterefreshtoken();
        user.refreshtoken=refreshtoken;
        await user.save({validateBeforeSave:false});

        return {accesstoken,refreshtoken};
    } catch (error) {
        throw new handleerror("Something went wrong while generating access and refresh token")
    }
} 
const registeruser=asynchandler(async (req,res)=>{

    try {
        const {name,email,password}=req.body;
    
        if(
            [name,email,password].some((field)=>field?.trim() === "")
        )
        {
            throw new handleerror(400,"All field are required");
        }
    
        const isexisted=await User.findOne({email})
        if(isexisted)
        {
            throw new handleerror(409,"User with this email already exist");
        }
        const user=await User.create({
            name,
            email,
            password
        })
        const createduser=await User.findById(user._id).select(
            "-password -RefereshToken"
        )
        if(!createduser)
        {
            throw new handleerror(500,"Something went wrong while registering user")
        }
        return res.status(201).json(
            new handleresponse(200,createduser,"User Created and Registered successfully")
        )
    } catch (error) {
        throw new handleerror(500,error.message)
    }
})
const loginuser=asynchandler(async(req,res)=>{
    const {email,password}=req.body;
    if( !email )
    {
        throw new handleerror(400,"username or email is required");
    }
    const user=await User.findOne({email})
    if(!user)
    {
        throw new handleerror(404,"User does not exist");
    }
    const ispasswordcorrect=await user.ispasswordcorrect(password);
    if(!ispasswordcorrect)
    {
        throw new handleerror(401,"Password invalid");
    }

    const{accesstoken,refreshtoken}= await generateAccessandRefreshtoken(user._id);
    const loggedinuser=await User.findOne(user._id).select(
        "-password -RefreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new handleresponse(
            200,
            {
                user:loggedinuser,accesstoken,refreshtoken
            },
            "User Logged in Successfully"
        )
    )
})
const logoutuser=asynchandler(async(req,res)=>{
    //find user
    //remove cookies of the user
    //remove refresh token in usermodel
    
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            RefreshToken:1
        }
    },
    {
        new:true
    })
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new handleresponse(200, {}, "User logged Out"))
})
const refreshAccessToken=asynchandler(async(req,res)=>{
    const incomingrefreshtoken= req.cookies.refreshtoken || req.body.refreshtoken
    
    const ans= await req.cookies.refreshtoken;
    console.log(ans);
    if(!incomingrefreshtoken)
    {
        throw new handleerror(401,"Unauthorized request");
    }

    try {
        const verifyingtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(verifyingtoken?._id)
        if(!user)
        {
            throw new handleerror(401,"Invalid refresh token");
        }
        if(incomingrefreshtoken!==user?.RefreshToken){
            throw new handleerror(401,"Refresh Token Expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accesstoken,newrefreshtoken}=await generateAccessandRefreshtoken(user._id)
        return res
        .status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",newrefreshtoken,options)
        .json(
            new handleresponse(
                200,
                {accesstoken,refreshtoken:newrefreshtoken},
                "Access Token Refreshed"
                
            )
        )
    } 
    catch (error) {
        throw new handleerror(401,error?.message ||"Invalid Refresh Token")
        // console.log('invalid refresh token');
        
    }
})
const updateuserdetail=asynchandler(async(req,res)=>{
    const{name,email}=req.body
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            name:name,
            email:email
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new handleresponse(200,user,"Details Updated Successfully")
    )
})
export {registeruser,loginuser,logoutuser,refreshAccessToken,updateuserdetail}