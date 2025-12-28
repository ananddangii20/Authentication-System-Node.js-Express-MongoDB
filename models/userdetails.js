const mongoose = require('mongoose');

let userschema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true,
        unique:true,
        lowercase :true
    },

    mobileno:{
        type:String,
        require:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    
    resetToken: String,
resetTokenExpiry: Date
});

let usermodel = mongoose.model("userdetails" , userschema);

module.exports = usermodel;