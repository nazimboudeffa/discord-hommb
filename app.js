const Discord = require('discord.js');

//const { CONFIG_TOKEN } = require('./config.json');
const { greetings } = require('./quest/data.json');

const client = new Discord.Client();
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')

const Game = require('./quest/game.js');
const Player = require('./quest/player.js');

//var token = CONFIG_TOKEN || process.env.TOKEN
var token = process.env.TOKEN
var port = process.env.PORT || 3000

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public'))

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/hero/:faction/:classe', function (req, res) {
  let g = (player == undefined) ? "male" : player.gender
  res.render('hero', { hero : { "faction" : req.params.faction, "classe" : req.params.classe, "gender" : g }})
})

app.get('/:faction', function (req, res) {
  res.render('faction', { faction : req.params.faction })
})

app.listen(port, function () {
  console.log('HoMMB app listening on port 3000!')
})

const prefix = 'h!';

let players = []; // tracks each player that joins
let playersSaveFile = [];
let playersOnline = 0; //tracker for total players online
let quest; //Initilizes our game engine
let userJoined = false;
let inBattle = false;
let session_id;
let currentUser;
let playChannel = "hommb-quest";
let player;

/* User joins the server */
client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    var actualChannel = message.channel.name

    if(actualChannel != playChannel) {
        message.channel.send(`${message.author} you cannot use a h! command here, please work in #${playChannel}`);
    } else {

    if(command === 'join'){

      // Prevents multiple instances of the same person from joining
      for(var x = 0; x < players.length; x++){
        if(players[x].name===message.author.username){
          return message.channel.send(`You have already joined, ${message.author}`);
        }
      }

        function checkData(){
          // Checks the object that stores players data so they can retrieve their saved progress
          for(var s = 0; s < playersSaveFile.length; s++){
            if(playersSaveFile[s].name===message.author.username){
                for(var y = 0; y < players.length; y++){
                /* If the name in the save file object matches the name of the current user online, retrieve
                that specific persons saved progress */
                if(players[y].name===playersSaveFile[s].name){
                message.channel.send('This player has a saved file!');
                /* Grab the index from the saved file and set it to the index of the current players object
                This is where you load all the players progress(such as health,damage,id,etc) */
                players[y].index=playersSaveFile[s].index;
                message.channel.send('Saved file has been loaded.');
                } else{
                   }
                }
              }
           }
        }

        function init(){
            quest = new Game(players, client, 'hommb-quest', playersOnline);
            let myRet = quest.startGame();
            const embed = new Discord.MessageEmbed()
            .setTitle("Welcome to Heroes of Might and Magic")
            .setColor(0xFF0000)
            .addField(`${message.author.username} has Joined ${args[0]}`, myRet);
            message.channel.send(embed);
            return;
        }

        if (!args.length) {
      		return message.channel.send(`Type : h!join haven or "academy, necropolis, stronghold, sylvan, dungeon, fortress", ${message.author}`);
      	} else {

          // Increasing the players online count when someone joins
          playersOnline++;
          userJoined = true;

          // Creates a new object to store information about the player who joined
          /*
          players.push({
              "name": message.author.username,
              "index": 99,
              "health": 150,
              "inBattle": false
          });
          */
          player = new Player(message.author.username, args[0])
          console.log(player);
          players.push(player);
          checkData();
          init();
        }
    }

    else if(command === 'commands'){

        const exampleEmbed = {
        	color: 0x0099ff,
        	title: 'HoMMB Commands',
        	url: 'https://hommb.herokuapp.com',
        	description: 'Some commands to use to play Heroes in Discord',
        	fields: [
            {
              name: 'Playing the Game',
              value: '`h!join` `h!new` `h!leave`',
            },
        		{
        			name: 'Battles',
        			value: '`h!fight` ~~`h!spell`~~',
        		},
        		{
        			name: 'Statistics',
        			value: '`h!stats` ~~`h!spellbook`~~ ~~`h!artifacts`~~',
        		},
        	],
        	image: {
        		url: 'https://i.imgur.com/XAoJ5vj.jpg',
        	},
        };

        message.channel.send({ embed: exampleEmbed });

      }

      else if(command === 'test'){

          const exampleEmbed = {
          	color: 0x0099ff,
          	title: 'HoMMB Test',
          	url: 'https://hommb.herokuapp.com',
          	author: {
          		name: 'HoMMB',
          		icon_url: 'https://i.imgur.com/XAoJ5vj.jpg',
          		url: 'https://hommb.herokuapp.com',
          	},
          	description: 'Lorem ipsum',
          	thumbnail: {
          		url: 'https://i.imgur.com/XAoJ5vj.jpg',
          	},
          	fields: [
              {
                name: 'Start Game',
                value: '`h!join` `h!leave`',
              },
          		{
          			name: 'Battles',
          			value: '`h!fight`',
          		},
          		{
          			name: 'Statistics',
          			value: '`h!stats` ~~`h!spellbook`~~ ~~`h!artifacts`~~',
          		},
          	],
          	image: {
          		url: 'https://i.imgur.com/XAoJ5vj.jpg',
          	},
          	timestamp: new Date(),
          	footer: {
          		text: 'Heroes of Might and Magic',
          		icon_url: 'https://i.imgur.com/XAoJ5vj.jpg',
          	},
          };

          message.channel.send({ embed: exampleEmbed });

        }
    /* User types the fight command */
    if(userJoined == true){
        if(command === 'fight'){
            for(var d = 0; d < players.length; d++){
                session_id = players[d];
            }

            console.log("You attacked monster.");
            currentUser = message.author.username;
            let grabCurrPlayer = currentUser;
            let playerStats = session_id;
            message.channel.send(`${quest.initBattle(grabCurrPlayer, playerStats)}`);
        }

        else if(command === 'leave'){
            let tempLeave = message.author.username;

            for(var x = 0; x < players.length; x++){
                if(players[x].name === tempLeave){
                    players.splice(x, 1);
                }
            }
            message.channel.send([`${tempLeave} has left the quest.`]);
            userJoined = false;
            playersOnline--;
        }

        /* Rejuvanates players and monster hitpoints */
        else if(command === 'new'){
          currentUser = message.author.username;
          let grabCurrPlayer = currentUser;
          message.channel.send(quest.newGame(currentUser));
        }

        /* Rejuvanates players and monster hitpoints */
        else if(command === 'stats'){
            currentUser = message.author.username;
            let grabCurrPlayer = currentUser;
            //message.channel.send(quest.getStats(currentUser));
            let player = quest.getStats(currentUser);

            const exampleEmbed = {
              color: 0x0099ff,
              title: player.hero,
              url: player.profile,
              description: 'Votre faction est ' + player.faction,
              thumbnail: {
                url: player.thumbnail,
              },
              fields: [
                {
                  name: 'Movement',
                  value: player.movement,
                  inline: true,
                },
                {
                  name: 'Mana',
                  value: player.mana,
                  inline: true,
                },
                {
                  name: 'Health',
                  value: player.health,
                },
                {
                  name: player.units[0].unit,
                  value: player.units[0].life,
                  inline: true,
                },
                {
                  name: player.units[1].unit,
                  value: player.units[1].life,
                  inline: true,
                },
                {
                  name: player.units[2].unit,
                  value: player.units[2].life,
                  inline: true,
                },
              ]
            };

            message.channel.send({ embed: exampleEmbed });
        }

        /* Simply checks the bonus damage. command for developer*/
        else if(command === 'bonus'){
            message.channel.send(quest.bonusAttack());
        }

        /* checks whose currently online. command for developer*/
        else if(command === 'online'){
            message.channel.send(quest.getOnline());
            console.log(players);
        }

        if(command === 'test'){
            message.channel.send(message.author);

            console.log(message.author);
        }
    }
  }
});

client.on('ready', () => {
    console.log('HoMMB is now connected to Discord');
});

client.login(token);
