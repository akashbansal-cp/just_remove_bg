const mongoose = require('mongoose')
const userSchema = require('./userSchema')

module.exports = validateUser = async(User) => {
    var ret;
    await mongoose.connect(process.env.mongourl)
    .then(async()=>{
        const date = new Date().toLocaleDateString();
        await userSchema.find({tgid:User['id']})
        .then(async(_user)=>{
            if(_user.length==0){
                console.log(-1)
                ret= "NO SUCH USER";
            }
            else if((_user[0]['freeCreditDate']!=date) || (_user[0]['freeCreditUsed']===false)){
                await userSchema.updateOne({tgid:User['id']},{$set:{freeCreditDate:date,freeCreditUsed:true}})
                .then(()=>{
                    console.log(0)
                    ret= "FREE CREDIT";
                })
                .catch(err=>{
                    console.log(err);
                })
            }
            else if(_user[0]['boughtCredit']!=0){
                await userSchema.updateOne({tgid:User['id']},{$inc:{boughtCredit:-1}})
                .then(()=>{
                    console.log(1)
                    ret= "BOUGHT CREDIT"
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            else{
                console.log(2)
                ret= "NO CREDITS LEFT"
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
    return ret;
}