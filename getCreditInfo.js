const mongoose = require('mongoose')
const userSchema = require('./userSchema')
const addUser = require('./addUser')

module.exports = getCreditInfo = async(id) => {
    var ret=[0,0];
    await mongoose.connect(process.env.mongourl)
    .then(async()=>{
        const date = new Date().toLocaleDateString();
        await userSchema.find({tgid:id})
        .then(async(_user)=>{
            if(_user.length==0);
            else if((_user[0]['freeCreditDate']!=date) || (_user[0]['freeCreditUsed']===false)){
                ret[0]=1
                ret[1]=_user[0]['boughtCredit']
            }
            else{
                ret[1]=_user[0]['boughtCredit']
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(ret)
    return ret;
}