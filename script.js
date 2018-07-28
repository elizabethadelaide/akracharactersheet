//global component for footnotes
Vue.component('alttext', {
  props: ['text'],
  //footnotes are handles using css
  template:`
    <p v-if='text!=""' class="tooltip">^
      <span class="tooltiptext">{{text}}</span>
    </p>
  `
});

//app for overall app
var statapp = new Vue({
  el: "#app",
  //base data
  data: {
    lvl: 15,
    base: { //these are the attributes which can be used to calculate many other attributes
      Str: 14,
      Dex: 18,
      Con: 18,
      Int: 10,
      Wis: 18,
      Cha: 11
    },
    hp: 149,
    skillcorr: { //Each skill corresponds to a different attribute
      Str: ["Athletics"],
      Dex: ["Acrobatics", "Sleight of Hand", "Stealth"],
      Int: ["Arcana", "History", "Nature", "Religion","Investigation"],
      Cha: ["Deception", "Performance","Persuasion"],
      Wis: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"]
    },
    profbonus: 5, //proficiency bonus corresponds to level technically, but only changes every few levels
    prof: [ //these skills get an extra bonus
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "Nature",
      "Survival"
    ],
    output: "",
    lastroll: "",
    //realized this data structure isn't ideal, could be edited
    //each one should be a keys with various attributes, see Ki points for a better example
    battle: [
      {attack: {
        text: "1d8+1+1d4 bludgeoning damage.",
        ndie: 2,
        tdie: [8, 4],
        dexattack: true,
        amod: 1, //extra damage from daybreak
        dmod: 1,
        alttext: "Radiant damage and extra damage from daybreak.",
        label: "Martial"
      }},
      {attack: {
        text: "1d8 ranged attack, 30 ft range. Can teleport within 5ft on hit.",
        ndie: 1,
        tdie: 8,
        dexattack: true,
        label: "Sunbolt"
      }},
      {attack:{
        text: "Brief sphere explosion with 20ft radius, 150 radius, Con saving throw, 2d6 on fail",
        ndie: 2,
        tdie: 6,
        label: "Sunburst"
      }},
      {attack: {
        text: "Can make 1 unarmed strike as bonus action after unarmed monk attack"
      }},
      {attack: {
        text: "Multiattack twice"
      }},
      {attack: {
        text: "As a reaction, reduce damage by 1d10+dex+lvl. If damage is reduced to 0, use 1 Ki point to make range arrack with proficiency.",
        ndie: 1,
        tdie: 10,
        label: "Deflect Missile"
      }},
      {attack: {
        text: "Stillness of mind: Action ends charmed of frightened"
      }},
      {attack: {
        text: "Evasion: Dex saves change full damage to half, and half to zero"
      }}
    ],
    Ki: {
      Flurry: {
        cost: 1,
        label: "Flurry of Blows",
        text: "Immediately after you take the Attack action on Your Turn, you can spend 1 ki point to make two unarmed strikes as a Bonus Action."
      },
      Defense: {
        cost: 1,
        label: "Patient Defense",
        text: "You can spend 1 ki point to take the Dodge action as a Bonus Action on Your Turn.",
        alttext: "When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated (as explained in appendix PH-A) or if your speed drops to 0."
      },
      Step: {
        cost: 1,
        label: "Step of the Wind",
        text: "You can spend 1 ki point to take the Disengage or Dash action as a Bonus Action on Your Turn, and your jump distance is doubled for the turn.",
        alttext: "If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn. When you take the Dash action, you gain extra movement for the current turn"
      },
      Stunning: {
        cost: 1,
        label: "Stunning Strike",
        text: "Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon Attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be Stunned until the end of your next turn.",
        alttext: "A stunned creature is incapacitated, can’t move, and can speak only falteringly. The creature automatically fails Strength and Dexterity Saving Throws.  Attack rolls against the creature have advantage."
      },
      Radiant: {
        cost: 1,
        label: "Radiant Sunbolt",
        text: "Spend 1 ki point to attack twice as a bonus action"
      },
      Searing: {
        cost: 2,
        label: "Searing Arc Strike",
        text: "At 6th level, immediately after you take the Attack action on your turn, you can spend 2 ki points to cast the Burning Hands spell as a bonus action. You can spend additional ki points to cast burning hands as a higher-level spell. Each additional ki point you spend increases the spell's level by 1. The maximum number of ki points (2 plus any additional points) that you can spend on the spell equals half your monk level. ",
        alttext: "Each creature in a 15-foot cone must make a Dexterity save. A creature takes 3d6 fire damage on a failed save, or half as much on a success. The fire ignites any flammable objects in the area that aren’t being worn or carried. At Higher Levels: The damage increases by 1d6 for each slot level above 1st.",
        ndie: 3,
        tdie: 6
      },
      Sunburst: {
        cost: 1,
        label: "Searing sunburst",
        text: "Increase damage of sunburst of sunburst by 2d6 per ki point. Spend up to 3 ki points.",
        ndie: 2,
        tdie: 6
      }
    },
    Triton: {
      fog: {
        text:"(Concentration) You create a 20-foot radius of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of at least 10 miles per hour disperses it. ",
        label: "Fog cloud"
      },
      gust: {
        text: "(Concentration) A strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose. Each creature that starts its turn in the line must pass a Strength save or be pushed 15 feet away in the line's direction. Any creature in the line must spend 2 feet of movement for every 1 foot when moving closer to you. The gust disperses gas or vapor, and it extinguishes unprotected flames. Protected flames have a 50 percent chance of being extinguished. As a bonus action, you can change the line's direction. ",
        label: "Gust of Wind"
      },
      wall: {
        text: "(Concentration) You conjure up a wall of water on the ground at a point  you can see within range. You can make the wall up to 30  feet long, 10 feet high, and 1 foot thick, or you can make  a ringed wall up to 20 feet in diameter, 20 feet high, and  1 foot thick. The wall vanishes when the spell ends. The  wall's space is difficult terrain.",
        label: "Wall of water",
        alttext: "Any ranged weapon attack that enters the wall's space  has disadvantage on the attack roll, and fire damage is  halved if the fire effect passes through the wall to reach its  target. Spells that deal cold damage that pass through the  wall cause the area of the wall they pass through to freeze  solid (at least a 5-foot square section is frozen). Each  5-foot-square frozen section has AC S and 1 S hit points.  Reducing a frozen section to O hit points destroys it. When  a section is destroyed, the wall's water doesn't fill it."
      }
    }
  },
  //technically most of these aren't dynamic, so a lot of these could be on 'started' instead of 'computed'
  computed:{
    //base modifiers
   mods: function (){
      var out = {};
      for (var b in this.base){
        //formula for getting modifier based on base attributes
        out[b] = Math.floor((this.base[b]) / 2) - 5;
      }
      return out;
    },
    //saving throw modifiers
    saving: function(){
       var out = {};
        for (var m in this.mods){
          out[m] = this.mods[m] + this.profbonus; //monk skill means prof in all saving throws
        }
        return out;
      },
    //skill modifiers
    skills: function(){
       var out = {};
       for (var m in this.skillcorr){
         for (var s in this.skillcorr[m]){ //use skill lookup table from data
           var skill = this.skillcorr[m][s]
           out[skill] = this.mods[m];
           if (this.prof.includes(skill)){
            out[skill] += this.profbonus;
           }
         }

       }
      //order skills into alphabetical order
      var ordered = {};
      Object.keys(out).sort().forEach(function(key) {
        ordered[key] = out[key];
      });
      return ordered;
      },
    //passive perception
    passiveperc:  function(){
        return 10+this.mods["Wis"];
      },
    temphp: function(){
      //from mirror Wraps
      return this.lvl+this.mods["Wis"];
    },
    //Ki DC
    kidc: function(){
      return 8+this.profbonus+this.mods["Wis"];
    },
    //Number of Ki points
    kipoints: function(){
      return this.lvl;
    },
    //Triton DC
    tritondc: function(){
      return 8+this.profbonus+this.mods["Cha"];
    }
  },
  components: {
    roller: { //roller used for based d20 rolls like modifiers or skills
      props: ['name', 'roll'], //text of roller, and numbers
      //emit emits the command to the parent, which will run the roll funtion in methods
      template:`
        <p v-on:click="$emit('my-roll', 20, roll, 1, name)"
        class="roller"
        >{{name}}: {{display}}</p>
      `,
      data: function(){
        var n = this.roll;
        if (n >= 0)
            return {display: "+" + n}; //always add a + for clarity
        else
            return {display: n}; //- sign
      }
    },
    attackroll: { //more complicated rolls go here, generally these are attack rolls
      props: ['attack'],
      data: function(){ //parse through different cases
        var dexattack = false;
        var t = 0; //assume anything not stated is zero or ""
        var amod = 0;
        var dmod = 0;
        var label = "";
        if (this.attack.label !== undefined){
          label = this.attack.label;
        }
        if (this.attack.ndie === undefined){
          roll = false; //roll property controls if there is roll to be done for this
        }
        else{
          roll = true; //if there is roll, the text will be highlighted, and it will be clickable
          var n = this.attack.ndie;
          var t = [];
          for (var i = 0; i < n; i++){
            if (Array.isArray(this.attack.tdie)){
              t.push(this.attack.tdie[i]); //account for the rolls
            }
            else{
              t.push(this.attack.tdie);
            }
          }
          var attackmod = 0;
          var damagemod = 0;
          if (this.attack.dmod !== undefined){
            var damagemod = this.attack.dmod; //add damage modifiers
          }

          if (this.attack.amod !== undefined){
            var attackmod = this.attack.amod; //make sure attack modifiers are implemented
          }
          if (this.attack.dexattack !== undefined){ //dex attacks are basic attacks and have more complex rules (due to rules given to me by the DM)
            if (this.attack.dexattack == true){
              dexattack = true;
            }
          }
        }
        if (this.attack.alttext !== undefined){ //account for alttext, which is used for extra explanations
          var alttext = this.attack.alttext;
          var style = {"display": "inline-block"};
        }
        else{
          var alttext = "";
          var style = "";
        }

        return {roll: roll, dexattack: dexattack, ndie: n, tdie: t, amod: attackmod, dmod: damagemod, label: label, alttext: alttext, style: style};
      },
      //there are three cases, dexattacks, specific rolls, and then non-rolls
      template:`
        <span>
        <p v-bind:style="style" v-if="dexattack" class="roller" v-on:click="$emit('dexattack', tdie, amod, dmod, label)">{{display(label)}} {{attack.text}}</p>
        <p v-bind:style="style" v-else-if="roll" class="roller" v-on:click="$emit('roll', tdie[0], amod, ndie, label)">{{display(label)}} {{attack.text}}</p>
        <p v-bind:style="style" v-else>{{display(label)}} {{attack.text}}</p><alttext v-bind:text="alttext"></alttext>
        </span>
      `,
      methods:{
        display: function (label){
          if (label != ""){
            return label + ":"; //put a colon between a label and the text for nice formatting
          }
        }
      }
    },
    specialitem: { //make special items look nice, allow more stuff to be done in future
      props: ['name'],
      template:`
        <p class="specialitem"><em>{{name}}</em></p>
      `
    },
  },
  methods:  {
    modfilter:  function(n){
        if (n >= 0)
          return "+" + n; //put a + in front of positive modifiers
        else
            return n; //implicit negative sign
        },

    //basic die roll
    dieroll: function(die, modifier, n, name){
      this.lastroll = this.output;
      var value = rollutil(die, modifier);
      var crit = "";
      if (value - modifier == 20){ //crits only occur on nat 20s
        crit = " (Critical)"; //add to the end of the roll
      }
      //right now output is just basic text, but could be a component
      this.output = name + " " + value + " (" + n + "d" + die + " " + this.modfilter(modifier) + ")" + crit;
    },
    //more complex attack
    //d20+attack modifier
    //and then damage+damage modifier
    dexattackroll: function(tdie, amod, dmod, label){
      this.lastroll = this.output;
      var attack = rollutil(20, this.mods["Dex"]+this.profbonus+amod);
      var crit = "";
      if (attack - (this.mods["Dex"]+this.profbonus+amod) == 20){
        crit = " (Critical)"; //check for critical attacks
        //To Add, on crits, roll die twice, and add modifiers after
      }
      var damage = 0;
      if (label == "Martial"){ //Martial attacks have extra rules due to rules from special item (Day Break)
        damage = rollutil(tdie[0], this.mods["Dex"]+dmod) + rollutil(tdie[1], 0);
        dielabel = "d8+" + this.mods["Dex"] + "+" + dmod + "+d4"
      }
      else{ //Regular Attack
        damage = rollutil(tdie[0], this.mods["Dex"]+dmod);
        var dielabel = "";
        for (var i = 0; i <tdie.length; i++){
          dielabel = dielabel + "d" + tdie[i] + "+" + (this.mods["Dex"] + dmod);
          if (i+1 < tdie.length){
            dielabel += "+";
          }
        }
      }
      this.output = label + " Attack: " + attack + crit + ", Damage: " + damage + " (" + dielabel + ")";
    },
    display: function(label){
      if (label != ""){
        return label + ":";
      }
    }
  }
});

//simple die simulator
function rollutil(die, mod){
  return(Math.ceil(die*Math.random())+mod)
}
