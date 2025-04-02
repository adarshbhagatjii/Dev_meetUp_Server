 const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');

 const getSecretRoomId = (userId, targetUserId) => {
    return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex');

    }

 const initializeServer = (server)=>{


    const  io = socket(server, {
        cors:{
            origin: 'http://localhost:5173'
        }
    });
    io.on("connection", (socket)=>{
        // handel Event 
        socket.on('joinchat', ({userId, targetUserId, firstName})=>{
            const roomId = getSecretRoomId(userId, targetUserId)

            console.log(firstName +' has joined room:-'+ roomId);
            socket.join(roomId);

        });
        socket.on('sendMessage', async({ firstName, text,  targetUserId, userId, })=>{
            try{
            const roomId = getSecretRoomId(userId, targetUserId)
            console.log(firstName + ' has sent message:-' + text);
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]}
                });
                if(!chat){
                     chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                };
                chat.messages.push({
                    senderId:userId,
                    text,
                })
                await chat.save();


            io.to(roomId).emit('messageReceived', {text, firstName});

            }catch(err){
                console.log(err);
            }
        });
        socket.on('disconnect', ()=>{});
    })
 }
 module.exports = initializeServer;