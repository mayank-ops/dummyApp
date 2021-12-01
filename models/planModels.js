const mongoose = require('mongoose');

const db_link = "mongodb+srv://admin:cLvGd6TWxOfeG8lZ@cluster0.mxokk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(db_link)
    .then(() =>
    {
        console.log("plan db connected");
    }).catch((err) =>
    {
        console.log(err);
    })

const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [20, "plan name should not be more than 20 characters"]
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: [true, "price not entered"]
    },
    ratingsAverage: {
        type: Number
    },
    discount: {
        type: Number,
        validate: [function ()
        {
            return this.discount < 100;
        }, "discount should not exceed price"]
    }
})

const planModel = mongoose.model("planModel", planSchema);

// (async function createPlan()
// {
//     let planObj = {
//         name: "megafood",
//         duration: 30,
//         price: 1000,
//         ratingsAverage: 5,
//         discount: 20
//     }

//     const data = await planModel.create(planObj);
//     console.log(data);

//     // or
//     // const doc = new planModel(planObj);
//     // await doc.save();
//     // console.log(doc);
// })();

module.exports = planModel;