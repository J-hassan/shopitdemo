import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";



export const isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies; // If you're using cookies
  
    // If you're using authorization headers:
    // const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login first to access this resource'
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
  
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  };


export const AuthorizeRoles = (...roles) => {

    return (req,res,next) => {

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403));
        }

        next();

    }

}