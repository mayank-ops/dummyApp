const express = require('express');
const userModel = require('../models/userModel');
var jwt = require('jsonwebtoken');
const JWT_KEY = require('../secret');
const { sendMail } = require('../utility/nodemailer');

// user signup
module.exports.signup = async function signup(req, res)
{
    try {
        let obj = req.body;
        let user = await userModel.create(obj);
        sendMail("signup", user);
        if (user) {
            res.json({
                "message": "user sign up success",
                "data": user
            });
        }
        else {
            res.json({
                "message": "sign up failed",
            });
        }
    } catch (err) {
        res.json({
            "message": err.message,
        })
    }
}

// user login
module.exports.login = async function login(req, res)
{
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ "email": email });
        if (user) {
            if (user.password == password) {
                let uid = user["_id"];
                console.log("uid: ", uid);
                let jwt_token = jwt.sign({ payload: uid }, JWT_KEY);
                console.log("token: ", jwt_token);
                res.cookie("login", jwt_token, { httpOnly: true });
                res.json({
                    "message": "user logged in..!!",
                    "data": { email, password }
                })
            }
            else {
                res.json({
                    "message": "wrong credentials..!!"
                })
            }
        }
        else {
            res.json({
                "message": "user not found..!!"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            "message": err.message
        })
    }
}

// isAuthorised
module.exports.isAuthorised = function isAuthorised(roles)
{
    return function (req, res, next)
    {
        if (roles.includes(req.role)) {
            next();
        }
        else {
            res.status(401).json({
                "message": "operation not allowed"
            })
        }
    }
}

// protectRoute 
module.exports.protectRoute = async function protectRoute(req, res, next)
{
    try {
        let token;
        if (req.cookies.login) {
            token = req.cookies.login;
            let payload = jwt.verify(token, JWT_KEY);
            if (payload) {
                const user = await userModel.findById(payload.payload);
                console.log(user);
                req.role = user.role
                req.id = user.id;
                next();
            } else {
                return res.json({
                    "message": "user verification faliled"
                })
            }
        }
        else {
            const client = req.get("User-Agent");
            if (client.includes("Mozilla")) {
                return res.redirect("/login");
            }
            return res.json({
                "message": "please login again"
            })
        }
    }
    catch (err) {
        return res.json({
            "message": err.message
        })
    }
}

// forgetPassword
module.exports.forgetpassword = async function forgetpassword(req, res)
{
    let { email } = req.body;
    try {
        const user = userModel.findOne({ email: email });
        if (user) {
            const resetToken = user.createResetToken();
            const resetLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
            // console.log(resetLink);
            // send email to user using nodemailer
            const obj = {
                resetPasswordLink: resetLink,
                email: email
            }
            sendMail("resetpassword", obj); // using nodemailer
            return res.json({
                "messsage": "please sign up"
            })
        }
        else {
            return res.json({
                "messsage": "please sign up"
            })
        }
    } catch (err) {
        return res.status(500).json({
            "messsage": err.message
        })
    }
}

// resetPassword

module.exports.resetpassword = async function resetpassword(req, res)
{
    try {
        const token = req.params.token;
        let { password, confirmPassword } = req.body;
        const user = await userModel.findOne({ resetToken: token });

        if (user) {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.json({
                "message": "password changed succesfully. please login again"
            })
        }
        else {
            res.json({
                "message": "invalid user or token"
            })
        }
    }
    catch (err) {
        res.json({
            "message": err.message
        })
    }
}

module.exports.logout = function logout(req, res)
{
    res.cookie("login", "", { maxAge: 1 });
    res.json({
        "message": "user logout successfully"
    })
}