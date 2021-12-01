// const express = require('express');
// const userModel = require('../models/userModel');
// var jwt = require('jsonwebtoken');
// const JWT_KEY = require('../secret');
// const authRouter = express.Router();

// authRouter.route("/signup")
//     .get(middleware1, getSignUp, middleware2)
//     .post(postSignUp);

// authRouter.route("/login")
//     .post(loginUser)

// function middleware1(req, res, next)
// {
//     console.log("middleware1 called");
//     next();
// }

// function middleware2(req, res)
// {
//     console.log("middleware2 called");
//     res.json({
//         "message": "middleware2"
//     })
//     res.sendFile("./public/index.html", { root: __dirname });
//     console.log("middleware2 ended req/res cycle");
// }

// function getSignUp(req, res, next)
// {
//     console.log("get sign up called");
//     next();
//     // res.sendFile("./public/index.html", { root: __dirname });
// }

// async function postSignUp(req, res)
// {
//     let obj = req.body;
//     let user = await userModel.create(obj);
//     res.json({
//         "message": "user sign up success",
//         "data": user
//     });
// }

// async function loginUser(req, res)
// {
//     try {
//         let { email, password } = req.body;
//         let user = await userModel.findOne({ "email": email });
//         if (user) {
//             if (user.password == password) {
//                 let uid = user["_id"];
//                 console.log("uid: ", uid);
//                 let jwt_token = jwt.sign({ payload: uid }, JWT_KEY);
//                 console.log("token: ", jwt_token);
//                 res.cookie("login", jwt_token, { httpOnly: true });
//                 res.json({
//                     "message": "user logged in..!!",
//                     "data": { email, password }
//                 })
//             }
//             else {
//                 res.json({
//                     "message": "wrong password..!!"
//                 })
//             }
//         }
//         else {
//             res.json({
//                 "message": "user not found..!!"
//             })
//         }
//     }
//     catch (err) {
//         res.status(500).json({
//             "message": err.message
//         })
//     }
// }

// module.exports = authRouter;