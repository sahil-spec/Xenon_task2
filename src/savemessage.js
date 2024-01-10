const mongoose = require('mongoose');

const Saveschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required : true
    },
    message : {
        type:String,
        required : true
    }
})
const savecollection = new mongoose.model("savedata",Saveschema);

module.exports = savecollection;