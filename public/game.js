kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0.2, 0.14, 0.121, 1],
});

loadSprite("character", "../pic/character/character1.png", {
  sliceX: 8,
  sliceY: 10,
  anims: {
    idle: { from: 0, to: 1 },
    run: { from: 2, to: 14 },
    up: { from: 16, to: 17 },
    upWalk: { from: 18, to: 23 },
    down: { from: 24, to: 25 },
    downWalk: { from: 26, to: 33 },
    attack: { from: 44, to: 55 },
    upAttack: { from: 56, to: 61 },
    dieAnim: { from: 34, to: 37 },
    die: { from: 37, to: 37 },
    skill1_side: { from: 64, to: 66 },
    skill1_up: { from: 62, to: 63 },
    skill1_down: { from: 38, to: 39 },
    skill2: { from: 67, to: 70 },
  },
});

loadSprite("attack", "../pic/character/cha1_attack.png", {
  sliceX: 3,
  sliceY: 1,
  anims: {
    attack_effect: { from: 0, to: 2 },
  },
});

loadSprite("barrier", "../pic/background/barrier.png");
loadSprite("background1", "../pic/background/background1.jpg");
loadSprite("background1_top", "../pic/background/background1_top.png");
loadSprite("heart", "../pic/item/heart.png");

loadSprite("slime", "../pic/monster/slime.png", {
  sliceX: 7,
  sliceY: 1,
  anims: {
    jump: { from: 0, to: 6 },
  },
});
loadSprite("lotus", "../pic/monster/lotus.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    idle: { from: 0, to: 1 },
    attack: { from: 1, to:4}
  },
});
loadSprite("lotus_bullet", "../pic/monster/lotus_bullet.png");

loadSound("slime_splash", "../sound/slime_splash.mp3");
loadSound("lotus_attack", "../sound/lotus_attack.mp3");
loadSound("lotus_attack_hit", "../sound/lotus_attack_hit.mp3");
loadSound("sword_splash", "../sound/sword.wav");
loadSound("cha1_skill1", "../sound/cha1_skill1.mp3");
loadSound("cha1_skill2", "../sound/cha1_skill2.mp3");
loadSound("music", "../sound/music.mp3");
loadSound("healing", "../sound/healing.wav");

scene("game", () => {
  layers(["bg", "back", "obj", "front", "front2", "ui"], "obj");
  const map = [
    " ",
    " ",
    " ",
    "  cccccc",
    "ccccaacccccccccccccc",
    "caa     aa       aac",
    "ca      aa        ac",
    "ca                ac",
    "caa               ac",
    "caa               ac",
    "caa               ac",
    "caa               ac",
    "ca                ac",
    "ca                ac",
    "ca                ac",
    "ca                ac",
    "caaaaaaaaaaaaaaaaaac",
    "cccccccccccccccccccc",
  ];

  const levelCfg = {
    width: 100,
    height: 100,
    a: [sprite("barrier"), solid(), "wall", scale(1)],
    b: [sprite("barrier"), solid(), "wall", scale(0.75), origin("center")],
    c: [sprite("barrier"), solid(), "wall2", scale(1)],
  };

  addLevel(map, levelCfg);
  camIgnore(["ui"]);
  const background = add([
    sprite("background1"),
    origin("center"),
    scale(2),
    pos(1000, 1000),
    layer("bg"),
  ]);

  const background_top = add([
    sprite("background1_top"),
    origin("center"),
    scale(2),
    pos(1000, 1000),
    layer("front"),
  ]);

  playSound("music",0.2,true)

  const player = add([
    new Character(
      1,
      "player",
      "cha1",
      100,
      10,
      180,
      new Skill(1, 1, 5),
      new Skill(1, 2, 10),
      new Skill(1, 3, 10),
      new Skill(1, 4, 10)
    ),
    sprite("character", {
      animSpeed: 0.3,
      frame: 1,
    }),
    { height: 72, width: 32 },
    area(vec2(-10, -20), vec2(10, 20)),
    solid(),
    pos(1000, 1000),
    scale(2),
    origin("center"),
    "player1",
  ]);

  let hpPercent = player.maxhp / 302;
  const maxhpbar = add([
    rect(308, 20),
    pos(width() / 2 - 160, height() / 1.21),
    color(1, 1, 1),
    origin("left"),
    layer("ui"),
  ]);

  const hpbar = add([
    rect(player.hp / hpPercent, 14),
    pos(width() / 2 - 157, height() / 1.21),
    color(0.98, 0.43, 0.35),
    origin("left"),
    layer("ui"),
  ]);

  function updateHPBar(){
    if(player.hp > player.maxhp){
      player.hp = player.maxhp;
    }
    hpbar.width = player.hp / hpPercent;
  }

  player.skill_1.skill_bar();
  player.skill_2.skill_bar();
  player.skill_3.skill_bar();
  player.skill_4.skill_bar();

  // const Skillbar = null;
  // skill_bar(player.character);
  //  for(let i = 0; i < 4;i++){
  //   add([
  //     rect(70, 70),
  //     pos(width()/2+i*80-125, height()/1.1),
  //     color(0, 1, 1),
  //     layer("ui"),
  //     scale(1),
  //     origin("center"),
  //   ])
  //  }

  function spawnSlime(posX, posY) {
    const slime = add([
      new Character(
        lastID_monster,
        "slime",
        null,
        60,
        5,
        250,
        null,
        null,
        null,
        null
      ),
      sprite("slime", {
        animSpeed: 0.1,
        frame: 1,
      }),
      {
        timer: 0,
        targetId: 0,
        defaultScale: 1.2,
        height: 50,
        width: 32,
        sound_idle: "slime_splash",
      },
      solid(),
      area(vec2(-20, -30), vec2(20, 30)),
      pos(posX, posY),
      // pos(width() / 2, height() / 2),
      scale(1.2),
      origin("center"),
      layer("obj"),
      "monster","monster_1"
    ]);
    slime.play("jump");
    randomWalk(slime);

    //ให้มอนวิ่งตามคนเล่น 1
    // walkToTarget(slime, player);

    monster[-lastID_monster--] = slime;
  }

  function spawnLotus(posX, posY) {
    const lotus = add([
      new Character(
        lastID_monster,
        "lotus",
        null,
        70,
        10,
        250,
        null,
        null,
        null,
        null
      ),
      sprite("lotus", {
        animSpeed: 0.5,
        frame: 1,
      }),
      {
        timer: 0,
        targetId: 0,
        defaultScale: 1.2,
        height: 64,
        width: 64,
        
      },
      solid(),
      area(vec2(-20, -30), vec2(20, 30)),
      pos(posX, posY),
      // pos(width() / 2, height() / 2),
      scale(1.2),
      origin("center"),
      layer("obj"),
      "monster",
    ]);
    lotus.play("idle");
    // randomWalk(slime);
    // bulletAttack(lotus,player);

    //ให้มอนวิ่งตามคนเล่น 1
    // walkToTarget(lotus, player);
  

    monster[-lastID_monster--] = lotus;

    
  }

  

  function randomSpawn(monster) {
    let ranX = rand(1.5, 3) * 500;
    let ranY = rand(1.5, 3) * 500;

    if (monster == "slime") {
      spawnSlime(ranX, ranY);
    }else if(monster == "lotus"){
      spawnLotus(ranX, ranY);
    }
  }

  // function spawnHeart(x,y){
  //   const heart = add([
  //     sprite("heart"),
  //          pos(x,y),
  //       layer("obj"),
  //       scale(2.5),
  //       origin("center"),
  //       "heart1"
  //     ])
  // }

  player.play("idle");
  let move_speed = player.spd;
  let fire_walk = false;
  let isAttack = false;

  player.action(() => {
    player.resolve();
    camPos(player.pos);
  });

  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("slime");
  randomSpawn("lotus");

  keyDown("left", () => {
    if (!isAttack && player.hp > 0) {
      player.move(-move_speed, 0);
      player.dir = vec2(-1, 0);
      player.animSpeed = 0.09;
      if (!fire_walk) {
        player.play("run");
        player.scale.x = -2;
        fire_walk = true;
      }
    }
  });

  keyPress("space", () => {
    // spawnSlime();
    if (!isAttack && player.hp > 0) {
      fire_walk = false;
      isAttack = true;
      if (player.dir.y == -1) {
        player.play("upAttack");
        player.animSpeed = 0.1;
      } else {
        player.play("attack");
        player.animSpeed = 0.04;
      }

      let attack = add([
        sprite("attack", {
          animSpeed: 0.15,
        }),
        area(vec2(-10, -10), vec2(10, 10)),
        pos(player.pos.add(player.dir.scale(48))),
        rotate(-90 * player.dir.y),
        origin("center"),
        layer("obj"),
        "attack1",
      ]);
      if (player.dir.x != 0) {
        attack.scale = vec2(3 * player.dir.x, 3);
      } else {
        attack.scale = vec2(3, 3);
      }

      attack.play("attack_effect");
      playSound("sword_splash",0.4,false);

      setTimeout(function () {
        if (player.dir.y == -1) {
          player.play("up");
          player.animSpeed = 0.3;
        }
        // player.dir.x == 1 ||
        // player.dir.x == -1 ||
        // player.dir.y == 1
        else {
          player.play("idle");
          player.animSpeed = 0.3;
        }
        destroy(attack);
        isAttack = false;
      }, 400);
    }
  });

  keyDown("right", () => {
    if (!isAttack && player.hp > 0) {
      player.move(move_speed, 0);
      player.dir = vec2(1, 0);
      player.animSpeed = 0.09;
      if (!fire_walk) {
        player.play("run");
        player.scale.x = 2;
        fire_walk = true;
      }
    }
  });

  // keyPress("right", () => {
  //   player.play("run")
  //   player.scale.x = 2
  // })

  keyDown("up", () => {
    if (!isAttack && player.hp > 0) {
      player.move(0, -move_speed);
      player.dir = vec2(0, -1);

      if (!fire_walk) {
        player.play("upWalk");
        player.scale.x = 2;
        player.animSpeed = 0.15;
        fire_walk = true;
      }
    }
  });
 

  keyDown("down", () => {
    if (!isAttack && player.hp > 0) {
      player.move(0, move_speed);
      player.dir = vec2(0, 1);

      if (!fire_walk) {
        player.play("downWalk");
        player.scale.x = 2;
        player.animSpeed = 0.1;
        fire_walk = true;
      }
    }
  });

  keyRelease("left", () => {
    if (player.hp > 0 && !isAttack) {
      player.play("idle");
      player.animSpeed = 0.3;
      fire_walk = false;
    }
  });

  keyRelease("right", () => {
    if (player.hp > 0 && !isAttack) {
      player.play("idle");
      player.animSpeed = 0.3;
      fire_walk = false;
    }
  });

  keyRelease("up", () => {
    if (player.hp > 0 && !isAttack) {
      player.play("up");
      player.animSpeed = 0.3;
      fire_walk = false;
    }
  });

  keyRelease("down", () => {
    if (player.hp > 0 && !isAttack) {
      player.play("down");
      player.animSpeed = 0.3;
      fire_walk = false;
    }
  });

  keyRelease("q", () => {
    if (player.hp > 0 && !isAttack && player.skill_1.isCooldown == false) {
      isAttack = true;
      player.skill_1.setCooldown(player.skill_1);

      cha1_skill1(player);
      setTimeout(() => {
        isAttack = false;
        fire_walk = false;
      }, 700);
    }
  });

  keyRelease("w", () => {
    if (player.hp > 0 && !isAttack && player.skill_2.isCooldown == false) {
      isAttack = true;
      player.skill_2.setCooldown(player.skill_2);
      cha1_skill2(player);

      setTimeout(() => {
        isAttack = false;
        fire_walk = false;
      }, 2000);
    }
  });

  collides("monster", "attack1", (e1) => {
    playSound("slime_splash",0.2,false);
    doDamage(e1, player.str, 0.8, 1.2);
    if (player.id != e1.targetId) {
      if(e1.name == "slime"){
        
      walkToTarget(e1, player);
      }else{
        bulletAttack(e1, player);
      }
    }
    knockback(player, e1, 3);
  });

  collides("monster", "skill_attack", (e1, e2) => {
    if (e2.name == "Vital Strike") {
      doDamage(e1, player.str, 1.6, 1.8);
    } else if (e2.name == "Split Burst") {
      doDamageCombo(e1, player.str, 1.7, 2, e2, 6, 0.3);
    }

    if (player.id != e1.targetId) {
      if(e1.name == "slime"){
        walkToTarget(e1, player);
        }else{
          bulletAttack(e1, player);
        }
    }
  });

  collides("monster_1", "player1", (e1, e2) => {
    if ((e1.targetId == e2.id) & (e2.status != 1)) {
      let damage = e1.str;
      getDamage(e2, damage);
      damageLabel(e2, damage);
      knockback(e1, e2, 3);
      knockback(e2, e1, 3);
      updateHPBar();
      playSound("slime_splash",0.6,false);
    }
  });

  

  collides("monster", "wall", (e1) => {
    e1.dir.x = -e1.dir.x;
    e1.dir.y = -e1.dir.x;
  });

  collides("monster", "wall2", (e1) => {
    let ranPos = rand(1, 2) * 500;
    e1.pos.x = ranPos;
    e1.pos.y = ranPos;
  });

  collides("heart1", "player1", (e1,e2) => {
    playSound("healing",0.4,false);
    e2.hp += 10;
    updateHPBar();
    destroy(e1);
  });

  overlaps("bullet", "player1", (e1, e2) => {
    if (e2.status != 1) {
      playSound("lotus_attack_hit",0.6,false);
      let damage = e1.str;
      getDamage(e2, damage);
      damageLabel(e2, damage);
      updateHPBar();
      destroy(e1);
    }

    
  });

  function playSound(sound,volumn,isLoop){
    let sound1 = play(sound);
    sound1.volume(volumn);
    if(isLoop){
      sound1.loop();
    }
  }
  //     const a = new Character("m",100,100,20,sad,"dsa");
  // a.skill_1(player)
});

start(
  "game"
  // {level: 0, score: 0}
);
