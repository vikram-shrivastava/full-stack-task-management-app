import { asynchandler } from "../utils/asynchandler.js";
import {handleerror} from "../utils/apierror.js";
import {Task} from "../models/task-management.models.js";
import { handleresponse } from "../utils/apiresponse.js";
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

export {createtask}