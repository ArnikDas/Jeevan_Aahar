class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data=data;
        this.message = message;
        this.success = statusCode<400;
    }
}


export {ApiResponse};

//we are not using res.send("hello guys i am happy") as it doesnot have a ppredictable format or statuscode
 