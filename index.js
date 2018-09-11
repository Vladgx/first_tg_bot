/**
 * Created by vladgx on 10.09.2018.
 */
var Promise = require("bluebird");
const Tb = require("node-telegram-bot-api");

const config = require('config');
const token = config.get('token');

const bot = new Tb(token,{polling:true});

var dirty = require('dirty');
var db = dirty('user.db');
var os = require('os');

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Здравствуйте, для регистрации нажмите кнопку Зарегистрироваться.", {
        "reply_markup": {
            "keyboard": [ [{"text":"Зарегистрироваться","request_contact":true}]],
            "one_time_keyboard":true
        }
    });

});

var notes = [];
bot.onText(/напомни (.+) в (.+)/i, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});

bot.onText(/test/i, function (msg) {
  //  console.log(+;
    console.log(os.cpus());
    var replmsg;
    replmsg="PC "+ os.hostname() + ' ' + os.platform() + " " + os.arch();
    replmsg=replmsg+"\n"+"CPU "+os.cpus()[1].model+" Cores: "+os.cpus().length;
    replmsg=replmsg+"\n"+"RAM "+ Math.round(os.totalmem()/1048576)/1000 +" GB/ "+ Math.round(os.freemem()/1048576)/1000 +" GB";
    bot.sendMessage(msg.chat.id,replmsg);
});

bot.onText(/report/i, function (msg) {
    var replmsg;
    replmsg="PC "+ os.hostname() + ' ' + os.platform() + " " + os.arch();
    replmsg=replmsg+"\n"+"CPU "+os.cpus()[1].model+" Cores: "+os.cpus().length;
    replmsg=replmsg+"\n"+"RAM "+ Math.round(os.totalmem()/1048576)/1000 +" GB/ "+ Math.round(os.freemem()/1048576)/1000 +" GB";
    db.forEach(function(key, val) {
      //  console.log('Found key: %s, val: %j', key, val);
      //  console.log(val.id);
        bot.sendMessage(val.id, replmsg);
    });
});

setInterval(function(){
    for (var i = 0; i < notes.length; i++){
        var curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if ( notes[i]['time'] == curDate ) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i,1);
        }
    }
},1000);

bot.on('contact',(msg)=>{
    console.log(msg);
    db.set(msg.contact.phone_number,msg.chat);
    bot.sendMessage(msg.chat.id,'Регистрация успешна',{ "reply_markup":{"remove_keyboard":true}});
});

/*
bot.on('message',(msg)=>{
    bot.sendMessage(msg.chat.id,'Я получил сообщение');
    //console.log(msg.chat.id);
});
    */