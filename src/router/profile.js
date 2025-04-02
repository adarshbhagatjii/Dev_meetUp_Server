const express = require('express');
const { userauth } = require('../middleware/auth');
const { validateEditProfileData, validateforgotPassword } = require('../utils/validation');
const validator = require('validator');
const bcrypt = require("bcrypt");
const profileRouter = express.Router();




profileRouter.get('/profile/view', userauth, async(req,res)=>{ 
    try{
        const user= req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Something went wrong:-  " + err.message);
    }
});

profileRouter.patch('/profile/edit', userauth, (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.user;
       
        Object.keys(req.body).forEach((keys)=>(loggedInUser[keys] = req.body[keys]));

        loggedInUser.save();
       
        res.json({
            message: `${loggedInUser.firstName}, profile updated succesfully!!.....`,
            data: loggedInUser,
        })

   }catch(err){
        res.status(400).send("Something went wrong:-  " + err.message);
    }
});
profileRouter.patch('/profile/password', userauth ,async (req,res)=>{
    try{
        if(!validateforgotPassword(req)){
            throw new Error("Invalid password Request")
        }
        const { password } = req.body;
        if(!validator.isStrongPassword(password)){
               throw new Error("Try strong password");
           }
         const updatepasswordHash = await bcrypt.hash(password, 10);
       
           const loggedInUser = req.user;
            loggedInUser.password = updatepasswordHash;

            loggedInUser.save();
       
            res.send(`${loggedInUser.firstName}, Password updated succesfully!!.....`)

   }catch(err){
        res.status(400).send("Something went wrong:-  " + err.message);
    }
})

module.exports= profileRouter;