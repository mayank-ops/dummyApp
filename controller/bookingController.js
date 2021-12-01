const SK = 'sk_test_51K1CybSEvsiI61gm4G3nZ4JaIpaqHpmElr70ZyECME6dIfcBcOdAm84jJp8GIgaBfdQvtVesxNcoODSS08TJyF5O00Av41JkwD';
const stripe = require('stripe')(SK);
const express = require('express');
const planModel = require('../models/planModels');
const userModel = require('../models/userModel');
const app = express();
app.use(express.static('public'));

module.exports.createSession = async function (req, res)
{
    try {
        const userID = req.id;
        const planID = req.params.id;
        const user = userModel.findById(userID);
        const plan = planModel.findById(planID);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: user.email,
            client_reference_id: plan.id,
            line_items: [{
                name: plan.name,
                description: plan.description,
                amount: plan.price * 100,
                currency: "inr",
                quantity: 1
            }],
            success_url: `${req.protocol}://${req.get("host")}/profile`,
            cancel_url: `${req.protocol}://${req.get("host")}/profile`,
        });
        res.staus(200).json({
            status: "success",
            session: session
        })

    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}