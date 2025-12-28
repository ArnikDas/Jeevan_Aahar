class ApiError extends Error{
    constructor(
        statusCode,
        message = "Somthing Went Wrong",
        error =[],
        stack = ""
    ){
        super(message);//super is used to call the constructor of the parent class
        this.statusCode = statusCode;
        this.error = error;
        this.success = false;
        this.data = null;

        if(stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
//what is stack
// Stack is a list of the active stack frames at a certain point in time.
// In the context of an error, it shows the sequence of function calls that led to the error.
// This is useful for debugging, as it helps developers understand the flow of execution
// and identify where things went wrong.    

//Error.captureStackTrace() defines a static method that creates a .stack property on the passed-in error object.
// This property contains a string representation of the point in the code at which the Error was instantiated.
// It's primarily used for debugging purposes, allowing developers to see the call stack leading to the error.

export {ApiError};