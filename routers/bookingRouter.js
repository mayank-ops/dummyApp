const express = require('express');
const { protectRoute } = require('../controller/authController');
const { createSession } = require('../controller/bookingController');
const bookingRouter = express.Router();

bookingRouter.post("/createSession", protectRoute, createSession);
bookingRouter.get("/createSession", function (req, res)
{
    res.sendFile("C:/Users/mayank/Documents/JS/pepJS/backend/intro/foodapp/booking.html");
})

module.exports = bookingRouter;