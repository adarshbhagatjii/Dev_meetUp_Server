const express = require('express');
const User = require('../models/user');
const { validationSignup } = require('../utils/validation');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const sentOtp = require('../utils/sentOtp');





authRouter.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credential!!!");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            // creating jwt token 
            const token = await user.getJWT();
            res.cookie("token", token, {
                httpOnly: true,  // Prevents JavaScript from accessing the cookie
                secure: true,    // Required for HTTPS (Remove if testing on localhost)
                sameSite: "None", // Required for cross-origin requests
                expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
            });
            res.send(user);

        }
        else {
            throw new Error("Invalid Credential!!!");
        }
    } catch (err) {
        res.status(400).send("Error:- " + err.message)
    }
});

authRouter.post("/signup", async (req, res) => {

    try {

        const { firstName, lastName, email, password, skills, gender, age } = req.body;
        validationSignup(req);
        let existingUSer = await User.findOne({ email });
        if (existingUSer) {
            return res.status(400).send("User already exist with this email");
        }
        const passwordHash = await bcrypt.hash(password, 10);

        // generate otp 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            firstName,
            lastName,
            email,
            skills,
            age,
            gender,
            password: passwordHash,
            otp,
            isVerified: false,
        });
        const saveUser = await user.save();
        await sentOtp(email, otp);



        res.json({ message: "otp sent successfully" });
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});


authRouter.post("/verify", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        user.isVerified = true;
        user.otp = null;
        const saveUser = await user.save();

        const token = await saveUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
        });

        res.json({ message: "user saved successfully", data: saveUser });

    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
         sameSite: "None",

    });
    res.status(200).json({ success: true, message: "Logout Successful!" });
})

authRouter.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();
        await sentOtp(email, otp);

        res.json({ message: "OTP sent to email" });

    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});

authRouter.post('/resetpassword', async(req,res)=>{
    try {
        const {email, otp, newPassword }= req.body;;
        const user = await User.findOne({
            email
        });
        if(!user || user.otp!==otp || user.otpExpiry< Date.now()){
            return res.status(400).json({ message: "Invalid OTP or expired" });
        }
        user.password  = await bcrypt.hash(newPassword, 10);
          
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.json({ message: "Password reset successfully" });

        
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
})

module.exports = authRouter;