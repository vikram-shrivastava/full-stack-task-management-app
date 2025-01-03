import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const TaskSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        default:false,
        required:false,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})
TaskSchema.plugin(mongooseAggregatePaginate);
export const Task=mongoose.model("Task",TaskSchema);