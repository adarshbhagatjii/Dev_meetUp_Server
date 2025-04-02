const express = require('express');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { userauth } = require('../middleware/auth');
const { set } = require('mongoose');

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName email age gender skills bio imageUrl";




userRouter.get("/user/request/received",userauth, async (req, res) => {

    try {
        const loggedInUser= req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName",  "imageUrl", "age", "bio", "gender", "skills"]);
        res.json({message: "Data fetched succesfully", data: connectionRequest})
       
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
});


userRouter.get("/user/connections", userauth, async (req, res)=>{
    try{

        const loggedInUser= req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                
                {toUserId:loggedInUser._id, status: "accepted"},
                {fromUserId:loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA );
       

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        
        res.json({ data })
     } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
})



// userRouter.patch("/users/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;


//     try {
//         const allowedUpdates = ["bio", "imageUrl", "skills", "age", "gender"];
//         const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));

//         if (!isUpdateAllowed) {
//             throw new Error("Updates not allowed");
//         }

//         if (Array.isArray(data.skills) && data.skills.length > 10) {
//             throw new Error("Skills should not be more than 10");
//         }

//         const user = await User.findByIdAndUpdate(userId, data, {
//             new: true, // `new: true` is the correct way to return the updated document
//             runValidators: true,
//         });

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.send("User updated successfully");
//     } catch (err) {
//         res.status(400).send("Something went wrong: " + err.message);
//     }
// });

userRouter.get("/feed",userauth, async(req,res)=>{
    try{
        const loggedInUser= req.user;
        const page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequest= await ConnectionRequest.find({
            $or :[
                {fromUserId: loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        
        connectionRequest.forEach(element => {
            hideUserFromFeed.add(element.fromUserId.toString());
            hideUserFromFeed.add(element.toUserId.toString());
            
        });
        
        const users= await User.find({
           $and :[
            {
                _id:{$nin: Array.from(hideUserFromFeed)}
            },
            {
                _id:{$ne:loggedInUser._id}
            }
           ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);



        res.send(users)
        
    }catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }
})


module.exports = userRouter;






// app.patch("/users", async(req,res)=>{
//     const emailId = req.body.email;
//     const data= req.body;
   
//     try{
//        const user = await User.find({email : emailId}).updateOne(data);
       
//        res.send("user updated succesfully");
//     }catch(err){
//         res.status(400).send("Something went wrong" + err.message);
//     }
// })