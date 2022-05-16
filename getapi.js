const mongoose = require('mongoose')
const {workingapi} = require('./apiSchema')


module.exports = api = async (forwhat) =>{
    var _api;
    await mongoose.connect('mongodb+srv://username:whatpassword@cluster0.dytix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(async ()=>{
        console.log('connected')
        await workingapi.find({forwhat:forwhat}).sort({left:-1})
        .then(async(data)=>{
            // console.log(data)
            if(data[0]['left']>0){
                _api = data[0]['value']
                await workingapi.updateOne(data[0],{$inc:{left:-1}})
                .then(()=>{
                    console.log('updated')
                })
                .catch(err=>{
                    console.log(err);
                })
                .finally(()=>{
                    mongoose.disconnect();
                    console.log('disconnected');
                })
            }
            else {
                _api = "NO API KEY"
                mongoose.disconnect();
            }
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            console.log('api key returned')
        })
    }).
    catch(err=>{
        console.log(err)
    })
    .finally(()=>{
        console.log('Operation done successfully')
    })
    return  _api;
}