const express = require('express');
const path = require('path');
const { signup, login, isAuthorised, protectRoute, resetpassword, forgetpassword, logout } = require('../controller/authController');
const { getUser, updateUser, deleteUser, getAllUsers } = require('../controller/userController');
// const protectRoute = require('./authHelper');
const multer = require('multer');

const userRouter = express.Router();

userRouter.route("/:id")
    .patch(updateUser)
    .delete(deleteUser)

userRouter.route("/signup")
    .post(signup)

userRouter.route("/login")
    .post(login)

userRouter.route("/forgetpassword")
    .post(forgetpassword)

userRouter.route("/resetpassword/:token")
    .post(resetpassword)

userRouter.route("/logout")
    .get(logout)

// profile page
userRouter.use(protectRoute);
userRouter.route("/userProfile")
    .get(getUser)

// image upload

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/images',
    filename: (req, file, cb) =>
    {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb)
    {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

userRouter.get("/profileImage", (req, res) =>
{
    res.sendFile("C:/Users/mayank/Documents/JS/pepJS/backend/intro/foodapp/multer.html");
})

userRouter.post("/profileImage", imageUpload.single('photo'), (req, res) =>
{
    res.json({
        file: req.file
    })
}, (error, req, res, next) =>
{
    res.status(400).json({ error: error.message })
});

// admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter.route("")
    .get(getAllUsers);

module.exports = userRouter;