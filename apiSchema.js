const mongoose = require('mongoose')
const Schema = mongoose.Schema

const api = new Schema({
    forwhat:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    left:{
        type:Number,
        required:false
    },
    Creationdate:{
        type: Date,
        required: false,
        default: Date.now()
    }
})

module.exports = {
    workingapi:mongoose.model('workingapi',api)
}
