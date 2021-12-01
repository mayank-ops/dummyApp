const express = require('express');
const { protectRoute, isAuthorised } = require('../controller/authController');
const { getAllPlans, top3Plans, getPlan, createPlan, updatePlan, deletePlan } = require('../controller/planController');
const planRouter = express.Router();

// all plans
planRouter.route("/allPlans")
    .get(getAllPlans)

planRouter.route("/top3")
    .get(top3Plans)

// own plan - logged in necessary, so using protectRoute here
planRouter.use(protectRoute)
planRouter.route("/plan/:id")
    .get(getPlan)

// admin and restaurantowner can only create, update and delete plans
planRouter.use(isAuthorised(["admin", "restaurantowner"]))
planRouter.route("/alterPlan")
    .post(createPlan)

planRouter.route("/alterPlan/:id")
    .patch(updatePlan)
    .delete(deletePlan)


module.exports = planRouter;