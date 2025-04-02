const validator = require('validator');

const validationSignup = (req)=>{
    const {firstName, lastName, email, password } = req.body;

    if (! firstName || ! lastName ) {
        throw new Error("Name is not valid ");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid");
    }

}
const validateEditProfileData =(req)=>{
    const allowedEditFields = ["firstName","lastName", "imageUrl", "age", "bio", "gender", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}
const validateforgotPassword =(req)=>{
    const allowedEditFields = ["password"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    
    return isEditAllowed;
}

module.exports={
    validationSignup, validateEditProfileData, validateforgotPassword
}