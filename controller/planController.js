const planModel = require("../models/planModels")

module.exports.getAllPlans = async function getAllPlans(req, res)
{
    try {
        let plans = await planModel.find();
        if (plans) {
            return res.json({
                message: "all plans retrieved",
                data: plans
            })
        }
        else {
            return res.json({
                message: "plans not found"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.top3Plans = async function top3Plans(req, res)
{
    try {
        const plans = await planModel.find().sort({
            ratingsAverage: -1
        }).limit(3);
        return res.json({
            message: "top 3 plans",
            data: plans
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.getPlan = async function getPlan(req, res)
{
    try {
        let planID = req.params.id;
        let plan = await planModel.findById(planID);
        if (plan) {
            return res.json({
                message: "planretrieved",
                data: plan
            })
        }
        else {
            return res.json({
                message: "plans not found"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.createPlan = async function createPlan(req, res)
{
    try {
        let planData = req.body;
        let createdPlan = await planModel.create(planData);

        return res.json({
            message: "plan created successfully",
            createdPlan: createdPlan
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.updatePlan = async function updatePlan(req, res)
{
    try {
        let planID = req.params.id;
        let plan = await planModel.findById(planID);
        let planData = req.body;
        if (plan) {
            const keys = [];
            for (let key in planData) {
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                plan[keys[i]] = planData[keys[i]];
            }
            const updatedPlan = await plan.save();
            console.log(updatedPlan);
            res.json({
                message: "plan updated successfully",
                updatedPlan: plan
            })
        }
        else {
            res.json({
                message: "plan not found"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.deletePlan = async function deletePlan(req, res)
{
    try {
        let planID = req.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(planID);

        return res.json({
            message: "plan deleted successfully",
            deletedPlan: deletedPlan
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}