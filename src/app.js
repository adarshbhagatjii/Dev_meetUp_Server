const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request');
const userRouter = require('./router/user');
const chatRouter = require('./router/chat');
var cors = require('cors');

const app = express();

const http = require('http');
const initializeServer = require('./utils/Socket');
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "dev-meetup-client.vercel.app",
    credentials: true
}));


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);




const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

initializeServer(server);

mongoose.connect(MONGO_URI)
    .then(() =>{ console.log("Connected to MongoDB")
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
    })
    .catch((err) => console.error(err));






















































// app.get("/user",(req, res) => {
//     try {
//         throw new Error('This is a forced error');
//         res.send('User is called');  
//     } catch (error) {
//         res.status(500).send('Something went wrong contact admin'); 
//     }

   
// });
// app.use("/",(err,req,res,next)=>{
   
//     if(err){
//         res.status(500).send('Something went wrong');
//     }
    
// });


// app.use('/admin', adminauth);

// app.get("/admin/getalldata", (req,res)=>{
//     res.send("all data");
// })
// app.get("/admin/deletealldata", (req,res)=>{
//     res.send("all data deleteds");
// })
// app.get("/user", userauth, (req,res)=>{
//     res.send("User is called. ");
// })

// app.get("/admin/getalldata", (req,res)=>{
//     res.send("all data");
// })
// app.get("/admin/getalldata", (req,res)=>{
//     res.send("all data");
// })
// app.use("/user", (req, res , next)=>{
//     console.log("handling route 1!!")
//     // res.send("REsponse 1");
//     next();
// },
// (req, res, next)=>{
//     console.log("handling route 2!!")
//     // res.send("Response 2"); 
//     next()
// },
// (req, res, next)=>{
//     console.log("handling route 3!!")
//     // res.send("Response 3"); 
//     next()
// },
// (req, res, next)=>{
//     console.log("handling route 4!!")
//     // res.send("Response 4"); 
//     next()
// },
// (req, res, next)=>{
//     console.log("handling route 5!!")
//     res.send("Response 5"); 
// })


// app.use("/", (req, res)=>{
//     res.send("hello from dashboard ");
// })

// app.use("/te?st", (req, res)=>{
//     res.send("hello from server");
// })
// app.get('/user:userId', (req, res)=>{
//     res.send("hello from server");
// })
// app.use("/hello", (req, res)=>{
//     res.send("hello from  adarsh bhagat"); 
// })

// using curd operation

// app.get('/user/:userid', (req, res )=>{
//     console.log(req.params);
//     res.send({name: 'adarsh', age: 23});
// })
// app.post('/user', (req, res )=>{
//     res.send("data saved succesfully");
// })