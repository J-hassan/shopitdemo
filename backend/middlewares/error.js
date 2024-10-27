import ErrorHandler from "../utils/errorHandler.js";

export default (err,req,res,next) => {

    let error = {
        statusCode : err?.statusCode || 500,
        message : err.message || "Internal Server Error"
    }

    // invalid Mongoose Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandler(message,404);
    }

    // Handle Validation error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((value)=> value.message);
        error = new ErrorHandler(message,400);
    }

    // handle dublicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message,400);
    }

    // handle JWT token error
    if(err.name === "jsonWebTokenError"){
        const message = `JWT token error`;
        error = new ErrorHandler(message,400);
    }

    // handle JWT token expired error
    if(err.name === "TokenExpireError"){
        const message = `JWT token is expired. Try Again!`;
        error = new ErrorHandler(message,400);
    }

    // development error
    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(error.statusCode).json({
            message : error.message,
            error : err,
            stack : err.stack
        })
    }

    // production error
    if(process.env.NODE_ENV === "PRODUCTION"){
        res.status(error.statusCode).json({
            message : error.message
        })
    }

   

}

