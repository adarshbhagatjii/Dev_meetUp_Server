const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        lowercase: true,
        required: true,
        minLength: 4,
        maxlength: 20,
    },
    lastName: {
        type: String,
        minLength: 4,
        maxlength: 20,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error('Invalid Email'+ value);             
        //     }
        // }
    },
    password: {
        type: String,
        required: true,

        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error('Password must be strong'+ value);
        //     }
        // }  
    },
    age: {
        type: Number,
        min: 18,
    },
    imageUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL' + value);
            }
        }
    },
    skills: {
        type: [String],
    },
    bio: {
        type: String,
        default: "hey there i am using dev tinder",
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        },
    },
    otp: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpExpiry: {
         type: Date 
        },   // Store OTP expiration time

}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Adarsh@7549", { expiresIn: "7d" });
    return token;
};

userSchema.methods.validatePassword = async function (PasswordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(PasswordInputByUser, passwordHash);
    return isPasswordValid;
};


const User = mongoose.model('User', userSchema);
User.init()
    .then(() => console.log("User model initialized with indexes"))
    .catch((err) => console.error("Error initializing indexes:", err));
module.exports = User;