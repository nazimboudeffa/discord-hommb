const Discord = require('discord.js');

//const { CONFIG_TOKEN } = require('./config.json');
const { greetings } = require('./data.json');

const client = new Discord.Client();
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')

const Game = require('./game.js');

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

app.listen(port, function () {
  console.log('HoMMB app listening on port 3000!')
})

const prefix = 'h!';

let playersName = []; // tracks each player that joins
let playersSaveFile = [];
let currPlayers = 0; //tracker for total players online
let quest; //Initilizes our game engine
let userJoined = false;
let inBattle = false;
let session_id;
let currentUser;

/* User joins the server */
client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split('!');
    const command = args.shift().toLowerCase();

    if(command === 'join'){

        // Prevents multiple instances of the same person from joining
        for(var x = 0; x < playersName.length; x++){
            if(playersName[x].playerName===message.author.username){
                return playersName[x].playerName;
            }
         }

        function checkData(){
        // Checks the object that stores players data so they can retrieve their saved progress
        for(var s = 0; s < playersSaveFile.length; s++){
            if(playersSaveFile[s].playerName===message.author.username){
                for(var y = 0; y < playersName.length; y++){
                /* If the name in the save file object matches the name of the current user online, retrieve
                that specific persons saved progress */
                if(playersName[y].playerName===playersSaveFile[s].playerName){
                message.channel.send('This player has a saved file!');
                /* Grab the index from the saved file and set it to the index of the current players object
                This is where you load all the players progress(such as health,damage,id,etc) */
                playersName[y].index=playersSaveFile[s].index;
                message.channel.send('Saved file has been loaded.');
                } else{
                   }
                }
              }
           }
        }

        function init(){
            quest = new Game(playersName, client, 'hommb-quest', currPlayers);
            let myRet = quest.startGame();
            const embed = new Discord.MessageEmbed()
            .setTitle("Welcome to Heroes of Might and Magic")
            .setColor(0xFF0000)
            .addField(`${message.author.username} has Joined`, myRet);
            message.channel.send(embed);
            message.channel.send(`${message.author} type h!commands to see the list of commands.`);
            return;
        }

        // Increasing the players online count when someone joins
        currPlayers++;
        userJoined = true;

        // Creates a new object to store information about the player who joined
        playersName.push({
            "playerName": message.author.username,
            "index": 99,
            "health": 150,
            "inBattle": false
        });

        checkData();
        init();
    }

    /* User types the fight command */
    if(userJoined == true){
        if(command === 'fight'){
            for(var d = 0; d < playersName.length; d++){
                session_id = playersName[d];
            }

            console.log("You attacked monster.");
            currentUser = message.author.username;
            let grabCurrPlayer = currentUser;
            let playerStats = session_id;
            message.channel.send(`${quest.initBattle(grabCurrPlayer, playerStats)}`);
        }

        else if(command === 'leave'){
            let tempLeave = message.author.username;

            for(var x = 0; x < playersName.length; x++){
                if(playersName[x].playerName === tempLeave){
                    playersName.splice(x, 1);
                    currPlayers--;
                }
            }
            message.channel.send([`${tempLeave} has left the quest.`]);
            // userJoined = false;
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
            message.channel.send(quest.getStats(currentUser));
        }

        /* Simply checks the bonus damage. command for developer*/
        else if(command === 'bonus'){
            message.channel.send(quest.bonusAttack());
        }

        /* checks whose currently online. command for developer*/
        else if(command === 'online'){
            message.channel.send(quest.getOnline());
            console.log(playersName);
        }

        /* The help command */
        else if(command === 'commands'){
          message.channel.send("Try h!fight");
        }

        if(command === 'test'){
            message.channel.send(message.author);

            console.log(message.author);
        }
    }
});

client.on('ready', () => {
    console.log('HoMMB is now connected to Discord');
});

client.login(token);
