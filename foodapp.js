const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json()); // global middleware function
app.use(cookieParser());

app.use(cors());
app.use(express.static("public/build"));

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`server listening on port ${port}`);
});

const userRouter = require("./routers/userRouter");
const planRouter = require('./routers/planRouter');
const reviewRouter = require("./routers/reviewRouter");
const bookingRouter = require('./routers/bookingRouter');

app.use("/user", userRouter);
app.use("/plans", planRouter);
app.use("/review", reviewRouter);
app.use("/booking", bookingRouter);