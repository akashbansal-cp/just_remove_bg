const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    tgid:{
        type:String,
        required:true
    },
    user:{
        type:Object,
        required:true
    },
    freeCreditUsed:{
        type:Boolean,
        required:true,
        default:false
    },
    freeCreditDate:{
        type:String,
        required:false,
    },
    boughtCredit:{
        type:Number,
        required:true,
        default: 0
    }
})

module.exports = _userSchema = mongoose.model('userData',userSchema);