/*
   Copyright (c) 2012, Tomi Leppänen
   Copyright (c) 2012, Anssi "Miffyli" Kanervisto
   
   Achtung, die Kurve! clone written in javascript and svg
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/

var bonuses // Array to save bonuses
var BONUS_R = 30; // Radius of bonuses
var BONUS_R_POW2 = m.pow(BONUS_R,2); // Optimization
var BONUS_TYPES = [ // All valid bonuses
    {"type":"clear","effects":"all"}, // Clear
    {"type":"immortalize","effects":"self"}, // Immortalize self
    {"type":"mirrorKeys","effects":"others"}, // Mirror Keys
    {"type":"narrow","effects":"self"}, // Narrow self
    {"type":"narrow","effects":"others"}, // Narrow others
    {"type":"slowdown","effects":"self"}, // Slow down self
    {"type":"slowdown","effects":"others"}, // Slow down others
    {"type":"speedup","effects":"self"}, // Speed up self
    {"type":"speedup","effects":"others"}, // Speed up others
    {"type":"turnSharply","effects":"self"}, // Make self turn 90°
    {"type":"turnSharply","effects":"others"}, // Make others turn 90°
    {"type":"unknown","effects":"unknown"}, // Unknown
    {"type":"warp","effects":"self"}, // Allow self to warp
    {"type":"warp","effects":"all"}, // Allow everyone to warp
    {"type":"widen","effects":"self"}, // Widen self
    {"type":"widen","effects":"self"} // Widen others
    ];

/* Creates bonus object and adds it to gamearea */
/*
 * Methods:
 *  - remove, removes itself from bonuses array and gamearea
 * 
 * Valid names are defined in BONUS_NAMES array
 */
function bonus(info,x,y) {
    if (info.type == 'unknown') {
        info = BONUS_TYPES[m.floor(m.random()*BONUS_TYPES.length)];
        info.unknown = true;
    }
    this.x = x;
    this.y = y;
    this.type = info.type;
    this.effects = info.effects;
    this.remove = removeBonus;
    this.circle = document.createElementNS(NS,"circle");
    this.circle = elementSetAttributes(this.circle,{"cx":this.x, "cy":this.y, 
        "r":BONUS_R, "stroke-width":6, "id":"bonus_"+x+"_"+y});
    this.text = document.createElementNS(NS,"text");
    this.text = elementSetAttributes(this.text,{"x":x, "y":y+BONUS_R/10, 
        "font-family":font, "font-size":BONUS_R/2, "text-anchor":"middle"});
    switch(this.type) {
        case "immortalize":
            this.circle.setAttributeNS(null,"fill","#00CC00");
            this.text.textContent = "immortal";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            break;
        case "narrow":
            this.circle.setAttributeNS(null,"fill","#00FF33");
            this.text.textContent = "narrow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            this.dwidth = 0-5;
            break;
        case "slowdown":
            this.circle.setAttributeNS(null,"fill","#3300FF");
            this.text.textContent = "slow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            this.dspeed = 0-5;
            break;
        case "speedup":
            this.circle.setAttributeNS(null,"fill","#FF3300");
            this.text.textContent = "speed";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            this.dspeed = 5;
            break;
        case "turnSharply":
            this.circle.setAttributeNS(null,"fill","#FFFF00");
            this.text.textContent = "90°";
            this.text = elementSetAttributes(this.text,{"fill":"#000000",
                "font-size":BONUS_R,"y":y+BONUS_R/3});
            this.time = BONUS_TIME;
            break;
        case "warp":
            this.circle.setAttributeNS(null,"fill","#FFFFFF");
            this.text.textContent = "warp";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            break;
        case "widen":
            this.circle.setAttributeNS(null,"fill","#00CCFF");
            this.text.textContent = "widen";
            this.text.setAttributeNS(null,"fill","#000000");
            this.time = BONUS_TIME;
            this.dwidth = 5;
            break;
        case "mirrorKeys":
            this.circle.setAttributeNS(null,"fill","#000000");
            this.text.textContent = "mirror";
            this.text.setAttributeNS(null,"fill","#FFFFFF");
            this.time = BONUS_TIME;
            break;
        case "clear":
            this.circle.setAttributeNS(null,"fill","#000000");
            this.text.textContent = "clear";
            this.text.setAttributeNS(null,"fill","#FFFFFF");
            this.time = BONUS_TIME;
            break;
    }
    switch(this.effects) {
        case "self": this.circle.setAttributeNS(null,"stroke","green"); break;
        case "others": this.circle.setAttributeNS(null,"stroke","red"); break;
        case "all": this.circle.setAttributeNS(null,"stroke","blue"); break;
    }
    if (info.unknown) {
        this.circle.setAttributeNS(null,"fill","#FFFFFF");
        this.text.textContent = "???";
        this.text.setAttributeNS(null,"fill","#000000");
        this.circle.setAttributeNS(null,"stroke","black");
    }
    gamearea.appendChild(this.circle);
    gamearea.appendChild(this.text);
}
/* Removes (used) bonus */
function removeBonus() {
    gamearea.removeChild(this.circle);
    gamearea.removeChild(this.text);
    bonuses.splice(bonuses.indexOf(this),1);
}

/* Adds bonus */
function addBonus() {
    var x = m.floor(m.random()*(game_width-100)+50);
    var y = m.floor(m.random()*(game_height-100)+50);
    var a = m.floor(m.random()*BONUS_TYPES.length);
    bonuses.push(new bonus(BONUS_TYPES[a],x,y));
}

/* Check if given cordinates have a bonus */
function checkForBonus(x,y) {
    // Add code to check if player happened to hit a bonus
    for (var i in bonuses) {
        var distance = m.pow((x-bonuses[i].x),2)+m.pow((y-bonuses[i].y),2);
        if (distance < BONUS_R_POW2) return bonuses[i];
    } return false;
}

/* Deals with new bonus that player got */
function handleNewBonus(bonus,player) {
    switch(bonus.type) {
        case "clear":
            var lines = gamearea.getElementsByTagName("polyline");
            for (var i = lines.length - 1; i >= 0; i--) {
                gamearea.removeChild(lines[i]);
            }
            for (var i in players) {
                players[i].splitLine();
            }
            break;
        case "immortalize":
            player.break = true;
            break;
        case "mirrorKeys":
            for (var i in players) {
                if (players[i] != player) {
                    players[i].mirrorKeys();
                    players[i].bonus.push({"type":"keysMirrored",
                        "time":bonus.time});
                }
            }
            break;
        case "slowdown":
        case "speedup":
            if (bonus.effects == "self") {
                player.bonus.push({"type":"speed","time":bonus.time,
                    "dspeed":player.changeSpeed(bonus.dspeed)});
            } else {
                for (var i in players) {
                    if (players[i] != player) {
                        players[i].bonus.push({"type":"speed","time":bonus.time,
                            "dspeed":players[i].changeSpeed(bonus.dspeed)});
                    }
                }
            }
            break;
        case "turnSharply":
            if (bonus.effects == "self") {
                player.sharpTurns = true;
                player.bonus.push({"type":"turnSharply","time":bonus.time});
            } else {
                for (var i in players) {
                    if (players[i] != player) {
                        players[i].sharpTurns = true;
                        players[i].bonus.push({"type":"turnSharply",
                            "time":bonus.time});
                    }
                }
            }
            break;
        case "warp":
            if (bonus.effects == "self") {
                player.warp = true; 
                player.circle.setAttributeNS(null,"stroke","black");
                player.circle.setAttributeNS(null,"stroke-width",3);
                player.bonus.push({"type":"warp","time":bonus.time});
            } else {
                wallMode = "warp";
                commonBonuses.push({"type":"warp","time":bonus.time});
            }
            break;
        case "narrow":
        case "widen":
            if (bonus.effects == "self") {
                player.bonus.push({"type":"width","time":bonus.time,
                    "dwidth":player.changeWidth(bonus.dwidth)});
                player.addPoint(player.x,player.y);
            } else {
                for (var i in players) {
                    if (players[i] != player) {
                        players[i].bonus.push({"type":"width","time":bonus.time,
                            "dwidth":players[i].changeWidth(bonus.dwidth)});
                        players[i].addPoint(players[i].x,players[i].y);
                    }
                }
            }
            break;
    }
    bonus.remove();
}

/* Deals with bonuses that player already has */
function handlePlayersBonuses(player) {
    for (var j = player.bonus.length-1; j >= 0; j--) {
        if (player.bonus[j].time > 0) { // Every iteration
            if (player.bonus[j].type == "immortalize")
                player.breakcounter++;
            player.bonus[j].time--;
        } else { // Only when bonus ends
            switch(player.bonus[j].type) {
                case "immortalize": 
                    player.break = false;
                    player.splitLine();
                    player.addPoint();
                    break;
                case "width": 
                    player.changeWidth(0-player.bonus[j].dwidth);
                    player.addPoint(player.x,player.y);
                    break;
                case "speed": 
                    player.changeSpeed(0-player.bonus[j].dspeed); 
                    break;
                case "turnSharply": player.sharpTurns=false; break;
                case "warp": 
                    player.warp = false; 
                    player.circle.setAttributeNS(null,"stroke","none");
                    break;
                case "keysMirrored": player.mirrorKeys(); break;
            }
            player.bonus.splice(j,1);
        }
    }
}

/* Deals with common bonuses */
function handleCommonBonuses() {
    for (var j = commonBonuses.length-1; j >= 0; j--) {
        if (commonBonuses.time <= 0 && commonBonuses.type == "warp") {
            wallMode = "deathly";
            commonBonuses.splice(j,1);
        }
    }
    for (var j = commonBonuses.length-1; j >= 0; j--) {
        if (commonBonuses.type == "warp") {
            wallMode = "warp";
            commonBonuses[j].time--;
        }
    }
}
