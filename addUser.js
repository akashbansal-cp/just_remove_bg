const mongoose = require('mongoose')
const userSchema = require('./userSchema')

module.exports = addUser = async(User)=>{
    await mongoose.connect(process.env.mongourl)
    .then(async()=>{
        await userSchema.find({tgid:User['id']})
        .then(async(data)=>{
            console.log(data.length)
            if(!data.length){
                //add user
                console.log('adding user')
                const date = new Date().toLocaleDateString()
                const user = new userSchema({
                    tgid:User['id'],
                    user:User,
                    freeCreditUsed:false,
                    freeCreditDate:date,
                    boughtCredit:0
                })
                await user.save()
                .then(()=>{
                    mongoose.disconnect();
                })
                .catch(err=>{
                    console.log(err);
                })
            }
            else{
                mongoose.disconnect();
            }
        })
    })
}