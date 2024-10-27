import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({

    name : {
        type: String,
        required : [true,"Please enter your name"],
        maxLength : [20,"Your name cannot exceed 20 characters"]
    },

    email : {
        type: String,
        required : [true,"Please enter your email"],
        unique : true
    },

    password : {
        type:String,
        required: [true,"Please enter your password"],
        minLength : [6,"Your password must be greater than 6 characters"],
        select : false
    },

    avatar : {
        public_id: String,
        url: String
    },

    role : {
        type : String,
        default:  "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire : Date

},{timestamps:true});


userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);

});

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_DATE
    })
};


// password comparing
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(String(enteredPassword),this.password);
};


// get reset password token
userSchema.methods.getResetPasswordToken = function(){

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;

};

export default mongoose.model("User",userSchema);