import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"
async function ConnectDB()
{
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log("DBNAME",DB_NAME)
        console.log("MongoDb Connected !!!",connectioninstance.connection.host);
        
    } catch (error) {
        console.log("Mongo DB connection failed",error)
        // throw err
        process.exit(1)
    }
}
export {ConnectDB}