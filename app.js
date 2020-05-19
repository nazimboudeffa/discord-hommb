require('dotenv').config();
const Discord = require('discord.js');
const hommb = new Discord.Client();

hommb.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

hommb.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

hommb.login(process.env.TOKEN);
