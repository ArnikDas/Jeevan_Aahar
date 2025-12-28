import {ApiResponse} from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHadler.js";
/*
const healthCheck = async (req,res,next) =>{
    try {
        //before sending the response u may connect an user from DB
        const user =  await getUserFromDB();
        //if any thing taking to your database always remember 2 things
        //database may throw an error and database is in another continent
        //  so it will take some time,if it take time so u have to wait for it
        res
        .status(200)
        .json(
            new ApiResponse(200,{  message : "Server is running"})
             )
    } catch (error) {
        next(err);//express built in error handler
    }
};
*/
const healthCheck = asyncHandler(async(req,res) => {
    res.status(200).json(new ApiResponse(200,{message :
        "Server is running"
    })); 
})

export {healthCheck};

