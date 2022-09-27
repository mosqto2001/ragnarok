

class Character {
  maxhp = 0;
  dir = vec2(1, 0);
  status = 0; //0 = none, 1 = immortal อมตะ, 2 = unknockback

  constructor(id, name, character, hp, str, spd, skill_1, skill_2, skill_3, skill_4) {
    this.id = id;
    this.name = name;
    this.hp = hp;
    this.str = str;
    this.spd = spd;
    this.skill_1 = skill_1;
    this.skill_2 = skill_2;
    this.skill_3 = skill_3;
    this.skill_4 = skill_4;
    this.maxhp = hp;
    this.character = character;
  }

 

  // increaseHp(hp) {
  //   if(hp < this.maxhp){
  //   this.hp += hp;
  //   if(this.hp > this.maxhp){
  //     this.hp = this.maxhp;
  //   }
  // }
  // }

  // decreaseHp(hp) {
  //   if(hp > 0){
  //   this.hp -= hp;
  //   if(this.hp < 0){
  //     this.hp = 0;
  //   }
  //   }
  // }
}

async function showHealthBar(e1) {
  await wait(0.1);
  let hpPercent = e1.maxhp / 60;
  const maxhpbar = add([
    rect(64, 14),
    pos(e1.pos.x - e1.width - 2, e1.pos.y - e1.height),
    color(1, 1, 1),
    origin("left"),
    layer("front"),
  ]);

  const hpbar = add([
    rect(e1.hp / hpPercent, 10),
    pos(e1.pos.x - e1.width, e1.pos.y - e1.height),
    color(0.98, 0.43, 0.35),
    origin("left"),
    layer("front"),
  ]);

  let nowHp = e1.hp;

  for (let i = 0; i < 60; i++) {
    await wait(0.015);
    hpbar.pos.x = e1.pos.x - e1.width;
    hpbar.pos.y = e1.pos.y - e1.height;
    maxhpbar.pos.x = e1.pos.x - e1.width - 2;
    maxhpbar.pos.y = e1.pos.y - e1.height;

    if (e1.hp < nowHp || e1.hp == 0) {
      destroy(hpbar);
      destroy(maxhpbar);
      return;
    }
  }
  destroy(hpbar);
  destroy(maxhpbar);
}


function doDamage(e1, str, minimum, maximum) {
  let damage = Math.floor(rand(str * minimum, str * maximum));
  damageLabel(e1, damage);
  getDamage(e1, damage);
}

async function doDamageCombo(e1, str, minimum, maximum, skill, amount, delay) {
  for (let i = 0; i < amount; i++) {
    if (e1.isCollided(skill) && e1.hp > 0 && skill.name == "Split Burst") {
      doDamage(e1, str, minimum, maximum);
    }
    await wait(delay);
    // collides(enemy, skill, (e1,e2) => {
    //   console.log("Yes");
    //   doDamage(e1,str,minimum,maximum);
    // });
  }
}

function getDamage(e1, damage) {
  e1.hp -= damage;
  if (e1.hp <= 0) {
    die(e1);
    e1.hp = 0;
  }
  if(e1.id > 0){
    return;
  }
  showHealthBar(e1);
}

async function damageLabel(e, damage) {
  
  let damageLabel = add([
    text(damage),
    pos(e.pos.x, e.pos.y - e.height),
    layer("front2"),
    scale(2),
    color(rgba(1, 1, 1, 1)),
  ]);
  for (let i = 1; i < 4; i++) {
    damageLabel.pos.y -= 3;
    if (e.name == "player") {
      damageLabel.color = rgba(1, 0, 0, 1.5 / i);
    } else {
      damageLabel.color = rgba(1, 1, 1, 1.5 / i);
    }
    await wait(0.2);
  }
  destroy(damageLabel);
}

async function die(e1) {
  if (e1.name == "player") {
    e1.play("dieAnim");
    e1.animSpeed = 0.2;
    await wait(0.6);
    e1.play("die");
  } else {
    for (let i = 1; i < 3; i++) {
      e1.color = rgba(1, 1, 1, 1.5 / i);
      await wait(0.1);
    }
    if(Math.floor(Math.random() * 10) > 6){
    spawnHeart(e1.pos.x,e1.pos.y);
    }
    destroy(e1);

  }
}

function spawnHeart(x,y){
  const heart = add([
    sprite("heart"),
         pos(x,y),
      layer("obj"),
      scale(2),
      origin("center"),"heart1"
    ])
}

function randomWalk(e1) {
  let loopWalk = setInterval(run, 50);

  function run() {
    e1.move(e1.dir.x * e1.spd, e1.dir.y * e1.spd);
    e1.timer -= 0.1;
    if (e1.timer <= 0) {
      e1.dir = vec2(Math.round(rand(-1, 1)), Math.round(rand(-1, 1)));
      e1.timer = rand(5);
    }

    if (e1.dir.x == 1) {
      e1.scale.x = -e1.defaultScale;
    } else {
      e1.scale.x = e1.defaultScale;
    }
    if (e1.hp <= 0 || e1.targetId > 0) {
      clearInterval(loopWalk);
    }
  }
}

function walkToTarget(e1, e2) {
  let loopWalk = setInterval(run, 50);
  e1.targetId = e2.id;
  speed = e1.spd / 70;
  

  function run() {
    let diffX = e2.pos.x - e1.pos.x;
    let diffY = e2.pos.y - e1.pos.y;
    e1.resolve();

    if (diffX > 0) {
      e1.pos.x += speed;
      e1.scale.x = -e1.defaultScale;
      e1.dir.x = 1;
    } else {
      e1.pos.x -= speed;
      e1.scale.x = e1.defaultScale;
      e1.dir.x = -1;
    }
    if (diffY > 0) {
      e1.pos.y += speed;
      e1.dir.y = 1;
    } else {
      e1.pos.y -= speed;
      e1.dir.y = -1;
    }

    if (e2.hp <= 0) {
      e1.targetId = 0;
      clearInterval(loopWalk);
      randomWalk(e1);
    }
    e1.resolve();
  }
}

async function knockback(e1, e2, time) {
  if (e2.status == 2) {
    return;
  }
  for (let i = 0; i < time; i++) {
    await wait(0.002, () => {
      e2.pos.y += 17 * e1.dir.y;
      e2.pos.x += 17 * e1.dir.x;
    });
  }
}

function bulletAttack(e1,e2){
  let loopAttack = setInterval(fire,4000);

  async function fire() {
    playSound("lotus_attack",0.6,false);
    if(e1.hp <= 0){
      clearInterval(loopAttack)
      return;
    }
    
    const bullet = add([
      sprite("lotus_bullet"),
      {str: e1.str},
           pos(e1.pos.x,e1.pos.y),
        layer("obj"),
        scale(2),
        origin("center"),"bullet"
      ])

      bulletToTarget(e1,e2,bullet)

      await wait(3);
      destroy(bullet);

    
      
  }

  async function bulletToTarget(e1,e2,bullet) {
    let loopFire = setInterval(run, 50);
    e1.targetId = e2.id;
    let speed = 5
    
  
    function run() {
      let diffX = e2.pos.x - bullet.pos.x;
      let diffY = e2.pos.y - bullet.pos.y;
      // bullet.resolve();
  
      if (diffX > 0) {
        bullet.pos.x += speed;
      } else {
        bullet.pos.x -= speed;
      }
      if (diffY > 0) {
        bullet.pos.y += speed;
      } else {
        bullet.pos.y -= speed;
      }
  
      if (e2.hp <= 0) {
        e1.targetId = 0;
        clearInterval(loopFire);
        return;
      }
      // bullet.resolve();
    }

    await wait(3);
    e1.targetId = 0;
     clearInterval(loopFire);
  }

  

  
  
}



// skill function
// function sad(player){
//     player.play("up");
// }
const monster = [];
var lastID_monster = -1;
