require('dotenv').config();
const Discord = require('discord.js');
const hommb = new Discord.Client();
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public'))

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index')
})

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('HoMMB app listening on port 3000!')
})

hommb.on('ready', () => {
  console.log(`Logged in as ${hommb.user.tag}!`);
});

hommb.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

hommb.login(process.env.TOKEN);
