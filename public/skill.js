loadSprite("cha1_skill", "../pic/character/cha1_skill.png", {
  sliceX: 7,
  sliceY: 7,
  anims: {
    skill1: { from :0, to: 6 },
    skill2: {from :7, to:14},
  },
});

loadSprite("cha1_skill_icon", "../pic/character/cha1_skill_icon.png", {
  sliceX: 4,
  sliceY: 2,
  anims: {
    skill1: { from :0, to: 0 },
    skill1_cd: { from :1, to: 1 },
    skill2: {from :2, to:2},
    skill2_cd: { from :3, to: 3 },
    skill3: {from :4, to:4},
    skill3_cd: { from :5, to: 5 },
    skill4: {from :6, to:6},
    skill4_cd: { from :7, to: 7 },
  },
});

 class Skill {
  isCooldown = false;
  skill_icon = null;

    constructor(character,skill, cooldown) {
      this.character = character;
      this.skill = skill;
      this.cooldown = cooldown;
      // this.isCooldown = false;
    }

    setCooldown(e1){
      this.isCooldown = true;
      e1.skill_icon_toggle();
        let countCooldown = this.cooldown;
        let cd = setInterval(count,1000);

          let cooldownLabel = add([
            text(countCooldown, 20),
                   pos(width()/2+(this.skill-1)*80-125, height()/1.095),
                layer("ui"),
                scale(1),
                origin("center"),
              ])
        
        
        function count(){
          cooldownLabel.text = --countCooldown
          if(countCooldown == 0){
            destroy(cooldownLabel);
            clearInterval(cd);
            e1.setIsCooldown = false;
            e1.skill_icon_toggle();
            
          }
        }
    }

    set setIsCooldown(val){
      this.isCooldown = val;
    }

    get getIsCooldown(){
      return this.isCooldown;
    }

    get getSkill(){
      return this.skill
    }

    skill_bar(){
      this.skill_icon = add([
          sprite("cha"+this.character+"_skill_icon"),
               pos(width()/2+(this.skill-1)*80-125, height()/1.1),
            layer("ui"),
            scale(1),
            origin("center"),
          ])
      this.skill_icon.play("skill"+this.skill);
    }
    
    skill_icon_toggle(){
      
      if(this.isCooldown){
        this.skill_icon.play("skill"+this.skill+"_cd");
      }else{
        this.skill_icon.play("skill"+this.skill);
      }
    }

    


  }

async function cha1_skill1(player){
  playSound("cha1_skill1",0.6,false);
    player.status = 1;

        let dirX = player.dir.x;
        let dirY = player.dir.y;

        let skill = add([
          sprite("cha1_skill", {
            animSpeed: 0.07,
          }),
          {
            name: "Vital Strike"
          },
          area(vec2(-20), vec2(20)),
          pos(player.pos.add(player.dir.scale(40))),
          rotate(4.75 * dirY),
          origin("center"),
          layer("obj"),
          scale(4),
          "skill_attack",
        ]);

      

        if (player.dir.x != 0) {
            skill.scale = vec2(4 * dirX, 4);
            player.play("skill1_side");
            player.animSpeed = 0.2;
          }else if(player.dir.y == 1){
            player.play("skill1_down");
            player.animSpeed = 0.3;
          } else {
            player.play("skill1_up");
            player.animSpeed = 0.3;
          }
    
          skill.play("skill1");
          for(let i=0;i < 5;i++){
              await wait(0.03)
              player.pos.x += 70 * dirX;
              player.pos.y += 70 * dirY;
                skill.pos.x += 40 * dirX;
                skill.pos.y += 40 * dirY;
          }
          await wait(0.3)
            if (dirY == -1) {
              player.play("up");
              player.animSpeed = 0.3;
            } else 
             {
              player.play("idle");
              player.animSpeed = 0.3;
            }
            
            destroy(skill);
            player.status = 0;
}

async function cha1_skill2(player){
  player.status = 2;
      let skill = add([
        sprite("cha1_skill", {
          animSpeed: 0.08,
        }),
        {
          name: "Split Burst"
        },
        area(vec2(-30), vec2(30)),
        pos(player.pos.add(vec2(0,-20))),
        origin("center"),
        layer("obj"),
        scale(5),
        "skill_attack",
      ]);

      playSound("cha1_skill2",0.6,false);
      player.play("skill2");
      player.animSpeed = 0.08;
        if(player.dir.x != 0){
        skill.scale = vec2(5 * player.dir.x, 5);
        }else{
          skill.scale = vec2(5, 5);
          // skill.pos.y += 30 * player.dir.y;
        }
  
        skill.play("skill2");

        await wait(1.9)
          if (player.dir.y == -1) {
            player.play("up");
            player.animSpeed = 0.3;
          } else 
           {
            player.play("idle");
            player.animSpeed = 0.3;
          }
          skill.name = null;
          destroy(skill);

          player.status = 0;
}

function playSound(sound,volumn,isLoop){
  let sound1 = play(sound);
  sound1.volume(volumn);
  if(isLoop){
    sound1.loop();
  }
}


