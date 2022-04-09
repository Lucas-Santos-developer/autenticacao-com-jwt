const mongoose = require("mongoose");

const MasterUser = mongoose.model("MasterUser", {
    masterName: String,
    masterEmail: String,
    masterPassword: String
})

module.exports = MasterUser