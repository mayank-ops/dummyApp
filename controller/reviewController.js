const reviewModel = require("../models/reviewModels");
const planModel = require('../models/planModels');

module.exports.getAllReviews = async function getAllReviews(req, res)
{
    try {
        const reviews = await reviewModel.find();
        if (reviews) {
            return res.json({
                message: "reviews retrieved successfully",
                data: reviews
            })
        }
        else {
            return res.json({
                message: "reviews not found",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.top3reviews = async function top3reviews(req, res)
{
    try {
        const reviews = await reviewModel.find().sort({
            rating: -1
        }).limit(3);
        if (reviews) {
            return res.json({
                message: "reviews retrieved successfully",
                data: reviews
            })
        }
        else {
            return res.json({
                message: "reviews not found",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.getPlanReviews = async function getPlanReviews(req, res)
{
    try {
        const planID = req.params.id;
        const reviews = await reviewModel.find();
        const data = reviews.filter((review) => review.plan._id == planID);
        if (reviews) {
            return res.json({
                message: "reviews retrieved successfully",
                data: data
            })
        }
        else {
            return res.json({
                message: "reviews not found",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.createReview = async function createReview(req, res)
{
    try {
        const planID = req.params.plan;
        const plan = await planModel.findById(planID);
        const review = await reviewModel.create(req.body);
        plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / 2;
        await plan.save();
        return res.json({
            message: "review added successfully",
            data: review
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.updateReview = async function updateReview(req, res)
{
    try {
        const planID = req.params.id;
        const reviewID = req.body.id;
        const review = await reviewModel.findById(reviewID);
        const reviewData = req.body;
        if (review) {
            const keys = [];
            for (let key in reviewData) {
                if (key == "id") continue;
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                review[keys[i]] = reviewData[keys[i]];
            }
            const updatedReview = await review.save();
            console.log(updatedReview);
            res.json({
                message: "review updated successfully",
                updatedReview: updatedReview
            })
        }
        else {
            res.json({
                message: "review not found"
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.deleteReview = async function deleteReview(req, res)
{
    try {
        const planID = req.params.id;
        const reviewID = req.body.id;
        let reviewPlan = await reviewModel.findByIdAndDelete(reviewID);
        return res.json({
            message: "review deleted successfully",
            deletedReview: reviewPlan
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}