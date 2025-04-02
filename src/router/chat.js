const express= require('express');
const authRouter = require('./auth');
const Chat = require('../models/chat');
const { userauth } = require('../middleware/auth');


const chatRouter = express.Router();


chatRouter.get('/chat/:targetUserId', userauth, async(req, res)=>{
    
    try{
    const targetUserId = req.params.targetUserId;
    const userId = req.user._id;
    
    let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] }
    }).populate({
        path: 'messages.senderId',
        select: 'firstName lastName'
    });
    if(!chat){
        chat = new Chat({
            participants : [userId, targetUserId],
            messages: []
        })
        await chat.save();
    }
    res.json(chat);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports= chatRouter;