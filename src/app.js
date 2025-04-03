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
   origin: "https://dev-meetup-client.vercel.app", 
    // origin: "http://localhost:5173", 
    credentials: true, // Allows cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
// ✅ Allow CORS for all responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://dev-meetup-client.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


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


