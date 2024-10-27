import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import {delete_file, upload_file} from "../utils/cloudinary.js";


// register user => /api/v2/register
export const registerUser = catchAsyncErrors( async (req,res,next)=>{

    let { name, email, password } = req.body;

    const user =  await User.create({
        name,
        email,
        password
    });

    sendToken(user,201,res);

});


// login user => /api/v2/login
export const loginUser = catchAsyncErrors( async (req,res,next)=>{

    let { email, password } = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Invalid email or password",400));
    }

    // check the user
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // check if password matched
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
});



// logout user => /api/v2/logout
export const logoutUser = catchAsyncErrors( async (req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now())
    });

    res.status(200).json({
        message : "Logout Successfull",
    })


})



// upload file  => /api/v2/me/upload_avatar
export const uploadAvatar = catchAsyncErrors( async (req,res,next)=>{

    const avatarRes = await upload_file(req.body.avatar,"shopit/avatars");

    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id);
    }

    const user = await User.findByIdAndUpdate(req?.user?._id , {
        avatar : avatarRes
    })

    res.status(200).json({
        user,
    })


})




// password forgot  => /api/v2/password/forgot
export const forgotPassword = catchAsyncErrors( async (req,res,next)=>{

    // check the user
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email",404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name,resetUrl);

    try {
        
    await sendEmail({

        email : user.email,
        subject : `ShopIT password recovery`,
        message

    });

    res.status(200).json({
        message : `Email sent to ${user.email}`
    })

    } catch (error) {
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new ErrorHandler(error?.message,500));

    }

    

});



// password reset  => /api/v2/password/reset/:token
export const resetPassword = catchAsyncErrors( async (req,res,next)=>{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt:Date.now()}
    });

    
    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has been expired",400));
    }

    // check both password matches
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save();

    sendToken(user,200,res);

});


//get user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req?.user?._id);

    if(!user){
        return next(new ErrorHandler("User not found",400));
    }

    res.status(200).json({
        user,
    })

})

//update user password => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req?.user?._id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect"),400);
    }

    user.password = req.body.newPassword;

    user.save();

    res.status(200).json({
        success : true
    })

})


//update user profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req,res,next)=>{

    
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id,newUserData,{new : true});


    res.status(200).json({
        user,
    })

})



//Get All Users - ADMIN => /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req,res,next)=>{

    
    const users = await User.find();


    res.status(200).json({
        users,
    })

})


//Get All Users - ADMIN => /api/v1/admin/users
export const getUserDetails = catchAsyncErrors(async (req,res,next)=>{

    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id ${req.params.id}`));
    }


    res.status(200).json({
        user,
    })

})


//Update User - ADMIN => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req,res,next)=>{

    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id ${req.params.id}`));
    }

    if(req?.user?.role === "admin"){
        user.role = req.body.role
        await user.save();
    }

    res.status(200).json({
        success : true,
    })

})


//Delete User - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req,res,next)=>{

    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id ${req.params.id}`));
    }

    if(user?.avatar?.public_id){
        await delete_file(user?.avatar?.public_id);
    }

    await user.deleteOne();


    res.status(200).json({
        user,
    })

})






















