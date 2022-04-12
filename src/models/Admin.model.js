const mongoose = require("mongoose");

const AdminModel = mongoose.model("AdminModel", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:  {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isAdmin: {
        type: Number,
        default: 0
    }
})

module.exports = AdminModel