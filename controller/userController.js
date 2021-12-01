const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res)
{
    // console.log(req.query);
    let id = req.id;
    let user = await userModel.findById(id);
    // let user = await userModel.findOne({ "name": "mayank" });
    if (user) {
        return res.json(user);
    }
    else {
        return res.json({
            "message": "user not found.!!",
        });
    }
}

// module.exports.postUser = function postUser(req, res)
// {
//     res.json({
//         message: "data received successfully",
//         user: req.body,
//     })
// }

module.exports.updateUser = async function updateUser(req, res) // patch req
{
    try {
        let id = req.params.id;
        let user = await userModel.findById(id);
        let data = req.body;
        if (user) {
            const keys = [];
            for (let key in data) {
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                user[keys[i]] = data[keys[i]];
            }
            const updatedUser = await user.save();
            console.log(updatedUser);
            res.json({
                "message": "user updated successfully",
                "updatedUser": user
            })
        }
        else {
            res.json({
                "message": "user not found"
            })
        }
    }
    catch (err) {
        return res.json({
            "message": err.message
        });
    }
    // let user = await userModel.findOneAndUpdate({ "email": "doejane@email.com" }, data);
    // res.json({
    //     "message": "user updated successfully",
    //     updatedUser: user
    // })
}

module.exports.deleteUser = async function deleteUser(req, res)
{
    try {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.json({
                "message": "user not found"
            })
        }
        res.json({
            "message": "user deleted succefully",
            deletedUser: user
        })
    }
    catch (err) {
        return res.json({
            "message": err.message
        })
    }
}

module.exports.getAllUsers = async function getAllUsers(req, res)
{
    // console.log(req.params);
    // console.log(req.params.id);
    console.log("getting all users");
    let users = await userModel.find();
    if (users) {
        res.json({
            "message": "users retrieved",
            "allUsers": users
        })
    }
    else {
        res.json({
            "message": "users not found"
        })
    }
}

// function getCookies(req, res)
// {
//     let cookie = req.cookies;
//     // let cookie = req.cookies.isLoggedIn;
//     console.log(cookie);
//     res.send("cookies received");
// }

// function setCookies(req, res)
// {
//     // res.setHeader("Set-Cookie", "isLoggedIn=true");
//     res.cookie("isLoggedIn", false, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true });
//     res.send("cookies has been set");
// }

// module.exports = {
//     getUser, postUser, updateUser, deleteUser, getUserWithID
// }