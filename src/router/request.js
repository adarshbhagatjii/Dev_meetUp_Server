const express = require('express');
const { userauth } = require('../middleware/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const requestRouter = express.Router();



requestRouter.post('/request/send/:status/:userId', userauth, async(req,res)=>{ 
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:'invalid Status Type" ' + status});
        }
        const toUser = await User.findById(toUserId);
       
        if(!toUser){
            return res.status(400).json({message:'invalid userId '});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ],
        });
       

        if(existingConnectionRequest){
            return res.status(400).json({message:'Already sent request '});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
             toUserId,
            status
        })
    
        const data = await connectionRequest.save();
      
        res.json({message:'connection request sent successfully'});

        

    }catch(err){
        res.status(400).send("Something went wrong:-  " + err.message);
    }
    
});

requestRouter.post('/request/review/:status/:requestId', userauth, async(req, res)=>{
  try{

    const {status, requestId}=req.params;
    const loggedInUser = req.user;

    const allowedStatus= ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Status not allowed"})
    };
    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",

    });
    if(!connectionRequest){
        return res.status(400).json({messge: "connection request not found"});
    };
    connectionRequest.status=status;
    const data =await connectionRequest.save();

    res.json({message: "connection request " + status, data});

  } catch(err){
        res.status(400).send("Something went wrong:-  " + err.message);
    } 
})
module.exports = requestRouter;