const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model("Customer",userSchema)