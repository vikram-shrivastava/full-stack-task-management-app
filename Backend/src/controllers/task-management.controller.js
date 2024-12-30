import { asynchandler } from "../utils/asynchandler.js";
import {handleerror} from "../utils/apierror.js";
import {Task} from "../models/task-management.models.js";
import { handleresponse } from "../utils/apiresponse.js";
import { isValidObjectId } from "mongoose";
const createtask = asynchandler(async (req, res) => {
    try {
        const {title,description}=req.body;
        if(!title){
            throw new handleerror(400,"Task details are missing")
        }
        const newtask=await Task.create({title:title,description:description,status:false});
        if(!newtask){
            throw new handleerror(500,"Task creation failed")
        }
        const mytask=await Task.findById(newtask._id);
        return res
        .status(201)
        .json(new handleresponse("Task created successfully",mytask))
    } catch (error) {
        throw new handleerror(500,error.message)
    }
});

const getalltasks = asynchandler(async (req, res) => {
    const {page=1,limit=10}=req.query;
    if(!isValidObjectId(req.user._id)){
        console.log("Invalid user ID")
        throw new handleerror(400,"Invalid user id")
    }
    const user=req.user;
    console.log("User:",user)
    try {
        const tasks=await Task.aggregate([
            {
                $match:{
                    _id:req.user._id,
                }
            }
        ]).sort({"createdAt":1});
        if(!tasks){
            throw new handleerror(404,"No tasks found")
        }
        const options={
            page:page,
            limit:limit
        }
        const data=await Task.aggregatePaginate(tasks,options);
        if(!data){
            throw new handleerror(404,"No tasks found")
        }
        return res
        .status(200)
        .json(new handleresponse("Tasks fetched successfully",data))
    } catch (error) {
        throw new handleerror(500,error.message)
    }
});

const updatetask = asynchandler(async (req, res) => {
    const {id}=req.params;
    if(!isValidObjectId(id)){
        throw new handleerror(400,"Invalid task id")
    }
    try {
        const task=await Task.findById(id); 
        if(!task){
            console.log('error here');
            throw new handleerror(404,"Task not found")
        }
        const updatedtask=await Task.findByIdAndUpdate(id,req.body)
        if(!updatedtask){
            console.log('error here 2');
            throw new handleerror(500,"Task update failed")
        }
        const mytask=await Task.findById(id);
        return res
        .status(200)
        .json(new handleresponse("Task updated successfully",mytask))
    } catch (error) {
        throw new handleerror(500,error.message)
    }
});
const deletetask = asynchandler(async (req, res) => {
    const {id}=req.params;
    if(!isValidObjectId(id)){
        throw new handleerror(400,"Invalid task id")
    }
    try {
        const task=await Task.findById(id);
        if(!task){
            throw new handleerror(404,"Task not found")
        }
        const deletedtask=await Task.findByIdAndDelete(id);
        if(!deletedtask){
            throw new handleerror(500,"Task deletion failed")
        }
        return res
        .status(200)
        .json(new handleresponse("Task deleted successfully"))
        } catch (error) {
            throw new handleerror(500,error.message)
        }
});

export {createtask,getalltasks,updatetask,deletetask}