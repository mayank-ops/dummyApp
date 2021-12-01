const mongoose = require('mongoose');

const db_link = "mongodb+srv://admin:cLvGd6TWxOfeG8lZ@cluster0.mxokk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(db_link)
    .then(() =>
    {
        console.log("review db connected");
    }).catch((err) =>
    {
        console.log(err);
    })

let reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "review is required field"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "rating is required field"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: [true, "review must belong to a user"]
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "plan must belong to a user"]
    }
})

reviewSchema.pre(/^find/, function (next)
{
    this.populate({
        path: "user",
        select: "name profileImage"
    }).populate("plan");
    next();
})

let reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;