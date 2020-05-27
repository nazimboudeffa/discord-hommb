const Monster = require('./monster.js');

class Game {
    constructor(players, client, playChannel='hommb-test', playersOnline){
         this.client = client;
         this.channelName = playChannel;
         this.players = players;
         this.playersOnline = [];
         this.inBattle = false;
         this.online = playersOnline;
         this.monsters = [new Monster()];
    };

    /* main menu information, players online */
    startGame(){
            for(var x = 0; x < this.players.length; x++){
                this.playersOnline.push(this.players[x]);
                if(this.playersOnline[x] === this.players[x]){
                    return [`Players Online: ${this.online}\n`];
            }
         }
    }

    /* Battle system */
    initBattle(currPlayer, currPlayerStats){
        this.inBattle = true;
        let npcHP = this.monsters[0].hp;
        let numberOfAttacks = 0;
        let totalDamage=0, totalBonusDamage=0;

        while( this.monsters[0].hp > 0 ){
            let playerDamage = Math.floor(Math.random() * (npcHP / 4));
            if(this.bonusAttack() === 2){
                console.log(`Bonus Attack: ${this.bonusAttack()}`);
                console.log(`Regular damage without bonus attack: ${playerDamage}`);
                playerDamage = playerDamage + 2;
            }
            this.monsters[0].hp -= playerDamage;

            for(var x = 0; x < this.players.length; x++){
                if(this.players[x].name===currPlayer){
                    this.players[x].health -= this.monsters[0].damage;
                }
            }

            console.log('Monster: ' + this.monsters[0].hp);
            console.log('Player: ' + currPlayerStats.health);
            console.log(`${currPlayer} has attacked for ${playerDamage}`);
            console.log(`NPC health: ${this.monsters[0].hp}`);

            this.inBattle = false;
            numberOfAttacks++;
            totalDamage += playerDamage;
            totalBonusDamage = playerDamage + this.bonusAttack();
        }

        for(var x = 0; x < this.players.length; x++){
            if(this.players[x].name===currPlayer){
            if(this.players[x].health <= 0){
                return [`\nYou are dead. Type h!new to refresh your stats!`];
            }
          }
        }

        if(this.monsters[0].hp <= 0){
            for(var x = 0; x < this.players.length; x++){
                if(this.players[x].name===currPlayer){
                    let maxDamage = totalDamage + totalBonusDamage;
                    this.monsters[0].hp = Math.floor(Math.random() * 50);
                    return [`${currPlayer} has attacked ${numberOfAttacks} times dealing ${totalDamage} + (${totalBonusDamage}) bonus damage for a total of ${maxDamage} damage. The monster is dead.\n
                    Your Health: ${this.players[x].health}`];
                }
            }
        }
        else{
            return [`\nType h!new to refresh your stats!`];
        }
     }

    /* bonus attack damage [ 1 in 3 chance ] */
    bonusAttack(bonusDamage){
        let chance = Math.floor(Math.random() * 3);
        return chance === 2 ? bonusDamage = 2 : false;
    }

    /* displays players currently online */
    getOnline(){
        let totalPlayers = [];

        for(var x = 0; x < this.players.length; x++){
          totalPlayers.push([`ID: [${this.players[x].index}] [${this.players[x].name}]`]);
        }
        console.log(totalPlayers);
        return totalPlayers;
    }

    /* displays players currently online */
    getStats(currPlayer){
      for(var x = 0; x < this.players.length; x++){
          if(this.players[x].name===currPlayer){
              return this.players[x];
          }
      }
    }

    getUnits(currPlayer){
      for(var x = 0; x < this.players.length; x++){
          if(this.players[x].name===currPlayer){
              return this.players[x];
          }
      }
    }

    /* refresh stats */
    newGame(currPlayer){
        for(var x = 0; x < this.players.length; x++){
            if(this.players[x].name===currPlayer){
            if(this.players[x].health <= 0){
                //this.monsters[0].hp = Math.floor(Math.random() * 50);
                this.players[x].health = 150;
            }
          }
        }
        return [`You feel good as new and you can h!fight again.`];
    }
}

module.exports = Game;
