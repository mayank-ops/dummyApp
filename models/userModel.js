const mongoose = require('mongoose');
const emailValidator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// mongo-db
const db_link = "mongodb+srv://admin:cLvGd6TWxOfeG8lZ@cluster0.mxokk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(db_link)
    .then((db) =>
    {
        console.log("user db connected");
    }).catch((err) =>
    {
        console.log(err);
    })

// schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function ()
        {
            return emailValidator.isEmail(this.email);
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    confirmPassword: {
        type: String,
        required: false,
        minLength: 5,
        validate: function ()
        {
            return this.password == this.confirmPassword;
        }
    },
    role: {
        type: String,
        enum: ["admin", "user", "restaurantowner", "deliverboy"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: "img/users/default.jpeg"
    },
    resetToken: String
})

userSchema.methods.createResetToken = function ()
{
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function (password, confirmPassword)
{
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}

// pre post hooks 
// before save events occur in db
userSchema.pre("save", function ()
{
    console.log("before saving in database", this);
    if (this.confirmPassword) {
        this.confirmPassword = undefined;
    }
})

// userSchema.pre("save", async function ()
// {
//     const salt = await bcrypt.genSalt();
//     const hashedPass = await bcrypt.hash(this.password, salt);
//     console.log(`hashed pass: ${hashedPass}, and salt is: ${salt}`);
//     this.password = hashedPass;
// })

// after save event occurs in db
userSchema.post("save", function (doc)
{
    console.log("after saving in database", doc);
})


// model
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;