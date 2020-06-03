const heroes = require('./heroes.json');

class Player {
    constructor(name, faction){
      /*
      let factions = ['haven', 'academy','necropolis','stronghold','sylvan','dungeon','fortress'];
      let faction = f;
      if (!f== 'haven' || !f == 'academy' || f=='') {
        faction = factions[Math.floor(Math.random() * factions.length)];
      }
      else {
        faction = f;
      }
      */
      let hero = heroes[faction][Math.floor(Math.random() * heroes[faction].length)];
      this.index = 99;
      this.name = name;
      this.faction = faction;
      this.classe = hero.classe;
      this.hero = hero.hero;
      this.gender = hero.gender;
      this.profile = 'https://hommb.herokuapp.com/hero/'+hero.faction+'/'+hero.classe;
      this.thumbnail = 'https://hommb.herokuapp.com/assets/heroes/'+hero.faction+'-'+hero.speciality+'-'+hero.hero+'.png';
      this.health = 150;
      this.movement = 27;
      this.mana = 10;
      this.inBattle = false;
      //this.hitpoints = 120;
      //this.damage = '';
      //this.chance = 3;
      this.units = [
        {
          "unit" : "Cabir",
          "life" : 10
        },
        {
          "unit" : "Génie",
          "life" : 50
        },
        {
          "unit" : "Apprenti",
          "life" : 100
        }
      ]
    };
}
module.exports = Player;
