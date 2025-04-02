const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userauth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            return res.status(401).send("please login first");
        }


        const decodedData = await jwt.verify(token, 'Adarsh@7549');
        const{_id} = decodedData;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("user not found");
        }
        req.user= user;
       
        next();
    } catch (error) {
        res.status(400).send('Something went wrong:- ' + error.message);
    }

}

module.exports = {
     userauth,
};









// const adminauth = (req, res, next)=>{
//     console.log("auth is called");
//     const token= 'xyz';
//     const isAdminAuth = token=== 'xyz';
//     if(!isAdminAuth){
//         res.status(401).send('Unauthorized');

//     }else{
//         next();
//     }
// }
// const userauth = (req, res, next)=>{
//     console.log("auth is called");
//     const token= 'xz';
//     const isAdminAuth = token=== 'xyz';
//     if(!isAdminAuth){
//         res.status(401).send('Unauthorized');

//     }else{
//         next();
//     }
// }