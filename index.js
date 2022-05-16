const APP_URL = process.env.APP_URL
const PORT = process.env.PORT || 3000;
const { Telegraf } = require("telegraf");
const request = require("request");
const fs = require("fs");
const api = require('./getapi')
const addUser = require('./addUser');
const validateUser = require('./validateUser');
const getCreditInfo=require('./getCreditInfo')
const BT = process.env.btoken; // For original bot
const bot = new Telegraf(BT);


bot.start(async(ctx) => {
    ctx.reply('Welcome to Image Background Remover Bot')
    ctx.reply('This bot helps only with one image a day to stop abuse, if you want more then that contact @soberdiscussion')
    await addUser(ctx['update']['message']['from'])
    .then(()=>{
        console.log('User logged successfully')
    })
    .catch(err=>{
        console.log(err);
        ctx.reply('Some error occurred. You can ping @soberdiscussion')
    })
});

bot.command('usage',async(ctx)=>{
    await getCreditInfo(ctx['update']['message']['from']['id'])
    .then(crd=>{
        ctx.reply(`Currently, You get to process one image for free using the bot everyday.\nAnd you have${crd[0]===1?' not':''} used your today's free credit.`)
    })
    .catch(err=>{
        console.log(err)
        ctx.reply('Some error occurred. You can ping @soberdiscussion')
    })
})


bot.on("photo", async (ctx) => {
    await validateUser(ctx['update']['message']['from'])
    .then(async key=>{
        console.log(key)
        if(key=="NO SUCH USER"){
            ctx.reply("Restart the bot using /start \nand then resend the photo")
        }
        else if(key=="NO CREDITS LEFT"){
            ctx.reply("No credits Left \nCheck back tomorrow")
        }
        else{
            var _api;
            await api('rembg')
            .then(e=>{
                _api=e;
                console.log(e)
                if(_api == "NO API KEY"){
                    ctx.reply('Some error occurred. You can ping @soberdiscussion')
                }
                else{
                    var l=ctx.update.message.photo.length;
                    console.log(ctx.update.message.photo);
                    var file;
                    ctx.telegram
                    .getFileLink(ctx.update.message.photo[l-1].file_id)
                    .then(async (url) => {
                        file = url.href;
                        request.post(
                            {
                                url: "https://api.remove.bg/v1.0/removebg",
                                formData: {
                                    image_url: file,
                                    size: "auto",
                                },
                                headers: {
                                    "X-Api-Key": _api
                                },
                                encoding: null,
                            },
                            function (error, response, body) {
                                if (error) {
                                    console.log(error);
                                    return;
                                }
                                if (response.statusCode != 200) {
                                    console.log('some error occurred')
                                    return;
                                }
                                fs.writeFileSync("no-bg.png", body);
                                ctx.replyWithDocument({source:'./no-bg.png'})
                            }
                            );
                        });
                    }
                })
            }
        })
        .catch(err=>{console.log(err)})
    });

// bot.launch();

bot.launch({
    webhook: {
      domain: APP_URL,
      port: PORT,
    },
  });