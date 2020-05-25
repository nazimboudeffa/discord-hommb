class Player {
    constructor(name, faction, classe){
      this.index = 99;
      this.name = name;
      this.faction = "academy";
      this.class = "magic";
      this.mana = 10;
      this.health = 150;
      this.inBattle = false;
    };
}
module.exports = Player;
