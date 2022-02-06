const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        max:10,
        min:5
    },

    password:{
        type:String,
        require:true,
        max:16,
        min:8
    }
})

module.exports = mongoose.model("Users",userSchema)