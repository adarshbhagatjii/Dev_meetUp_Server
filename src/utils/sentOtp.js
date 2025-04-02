const nodemailer = require("nodemailer");

const sentOtp= async(email , otp)=>{
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    }); 
    const mailOptions = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "OTP for email verification", 
        text: `Your OTP for signup verification is ${otp}`, 
      });
}
module.exports = sentOtp;
