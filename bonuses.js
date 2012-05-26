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

/* Creates bonus object and adds it to gamearea */
/*
 * Methods:
 *  - remove, removes itself from bonuses array and gamearea
 */
/*
 * Valid types and their circle colours are (stroke,fill):
 *  - immortalize (green,green)
 *  - narrow (green,lighter green)
 *  - slowdown (green, darker blue)
 *  - speedup (green,red)
 *  - turnSharply (green,yellow)
 *  - warp (green,white)
 *  - widen (green,lighter blue)
 *  - mirrorKeys (red, black)
 *  - narrowOthers (red,lighter green)
 *  - turnOthersSharply (green,yellow)
 *  - slowdownOthers (red,darker blue)
 *  - speedupOthers (red,red)
 *  - warpAll (blue,white)
 *  - widenOthers (red,lighher blue)
 *  - clear (blue,black)
 *  - immortalizeAll (blue,green)
 */
function bonus(name,x,y) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.remove = removeBonus;
    this.circle = document.createElementNS(NS,"circle");
    this.circle = elementSetAttributes(this.circle,{"cx":this.x, "cy":this.y, 
        "r":BONUS_R, "stroke-width":6, "id":"bonus_"+x+"_"+y});
    this.text = document.createElementNS(NS,"text");
    this.text = elementSetAttributes(this.text,{"x":x, "y":y+BONUS_R/10, 
        "font-family":font, "font-size":BONUS_R/2, "text-anchor":"middle"});
    switch(name) {
        case "immortalize":
            this.circle.setAttributeNS(null,"fill","#00CC00");
            this.text.textContent = "immortal";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "immortalize";
            this.time = BONUS_TIME;
            break;
        case "narrow":
            this.circle.setAttributeNS(null,"fill","#00FF33");
            this.text.textContent = "narrow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "width";
            this.time = BONUS_TIME;
            this.dwidth = 0-WIDTHSTEP;
            break;
        case "slowdown":
            this.circle.setAttributeNS(null,"fill","#3300FF");
            this.text.textContent = "slow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "speed";
            this.time = BONUS_TIME;
            this.dspeed = 0-SPEEDSTEP;
            break;
        case "speedup":
            this.circle.setAttributeNS(null,"fill","#FF3300");
            this.text.textContent = "speed";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "speed";
            this.time = BONUS_TIME;
            this.dspeed = SPEEDSTEP;
            break;
        case "turnSharply":
            this.circle.setAttributeNS(null,"fill","#FFFF00");
            this.text.textContent = "90°";
            this.text = elementSetAttributes(this.text,{"fill":"#000000",
                "font-size":BONUS_R,"y":y+BONUS_R/3});
            this.effects = "self";
            this.type = "turnSharply";
            this.time = BONUS_TIME;
            break;
        case "warp":
            this.circle.setAttributeNS(null,"fill","#FFFFFF");
            this.text.textContent = "warp";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "warp";
            this.time = BONUS_TIME;
            break;
        case "widen":
            this.circle.setAttributeNS(null,"fill","#00CCFF");
            this.text.textContent = "widen";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "self";
            this.type = "width";
            this.time = BONUS_TIME;
            this.dwidth = WIDTHSTEP;
            break;
        case "mirrorKeys":
            this.circle.setAttributeNS(null,"fill","#000000");
            this.text.textContent = "mirror";
            this.text.setAttributeNS(null,"fill","#FFFFFF");
            this.effects = "others";
            this.type = "mirrorKeys";
            this.time = BONUS_TIME;
            break;
        case "narrowOthers":
            this.circle.setAttributeNS(null,"fill","#00FF33");
            this.text.textContent = "narrow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "others";
            this.type = "width";
            this.time = BONUS_TIME;
            this.dwidth = 0-WIDTHSTEP;
            break;
        case "slowdownOthers":
            this.circle.setAttributeNS(null,"fill","#3300FF");
            this.text.textContent = "slow";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "others";
            this.type = "speed";
            this.time = BONUS_TIME;
            this.dspeed = 0-SPEEDSTEP;
            break;
        case "speedupOthers":
            this.circle.setAttributeNS(null,"fill","#FF3300");
            this.text.textContent = "speed";
            this.text.setAttributeNS(null,"fill","000000");
            this.effects = "others";
            this.type = "speed";
            this.time = BONUS_TIME;
            this.dspeed = SPEEDSTEP;
            break;
        case "turnOthersSharply":
            this.circle.setAttributeNS(null,"fill","#FFFF00");
            this.text.textContent = "90°";
            this.text = elementSetAttributes(this.text,{"fill":"#000000",
                "font-size":BONUS_R,"y":y+BONUS_R/3});
            this.effects = "others";
            this.type = "turnSharply";
            this.time = BONUS_TIME;
            break;
        case "warpAll":
            this.circle.setAttributeNS(null,"fill","#FFFFFF");
            this.text.textContent = "warp";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "all";
            this.type = "warp";
            this.time = BONUS_TIME;
            break;
        case "widenOthers":
            this.circle.setAttributeNS(null,"fill","#00CCFF");
            this.text.textContent = "widen";
            this.text.setAttributeNS(null,"fill","#000000");
            this.effects = "others";
            this.type = "width";
            this.time = BONUS_TIME;
            this.dwidth = WIDTHSTEP;
            break;
        case "clear":
            this.circle.setAttributeNS(null,"fill","#000000");
            this.text.textContent = "clear";
            this.text.setAttributeNS(null,"fill","#FFFFFF");
            this.effects = "all";
            this.type = "clear";
            this.time = BONUS_TIME;
            break;
    }
    switch(this.effects) {
        case "self": this.circle.setAttributeNS(null,"stroke","green"); break;
        case "others": this.circle.setAttributeNS(null,"stroke","red"); break;
        case "all": this.circle.setAttributeNS(null,"stroke","blue"); break;
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
    var type = m.ceil(m.random()*15);
    switch(type) {
        case 1: type = "immortalize"; break;
        case 2: type = "narrow"; break;
        case 3: type = "slowdown"; break;
        case 4: type = "speedup"; break;
        case 5: type = "turnSharply"; break;
        case 6: type = "warp"; break;
        case 7: type = "widen"; break;
        case 8: type = "mirrorKeys"; break;
        case 9: type = "narrowOthers"; break;
        case 10: type = "slowdownOthers"; break;
        case 11: type = "speedupOthers"; break;
        case 12: type = "turnOthersSharply"; break;
        case 13: type = "warpAll"; break;
        case 14: type = "widenOthers"; break;
        case 15: type = "clear"; break;
    }
    bonuses.push(new bonus(type,x,y));
}

function checkForBonus(x,y) {
    // Add code to check if player happened to hit a bonus
    for (var i in bonuses) {
        var distance = m.pow((x-bonuses[i].x),2)+m.pow((y-bonuses[i].y),2);
        if (distance < BONUS_R_POW2) return bonuses[i];
    } return false;
}
