class Monster {
    constructor(){
      this.hp = Math.floor(Math.random() * 200);
      this.temphp = 0;
      this.damage = 10;
    };
}
module.exports = Monster;
