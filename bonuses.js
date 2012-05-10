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

var bonuses = new Array(); // Array to save bonuses
var BONUS_R = 15; // Radius of bonuses
var BONUS_R_POW2 = m.pow(BONUS_R,2); // Optimization

/* Creates bonus and adds it to gamearea */
/*
 * Valid types are:
 *  - widen
 *  - narrow
 *  - immortalize
 *  - others to be added
 */
function bonus(type,x,y) {
    this.circle = document.createElementNS(NS,"circle");
    this.x = x;
    this.y = y;
    this.type = type;
    this.remove = removeBonus;
    this.circle = elementSetAttributes(this.circle,{"cx":this.x, "cy":this.y, 
        "r":BONUS_R, "id":"bonus_"+x+"_"+y, "z-index":10});
    if (type == "widen") {
        this.circle = elementSetAttributes(this.circle, {"fill":"blue"});
    } else if (type == "narrow") {
        this.circle = elementSetAttributes(this.circle, {"fill":"green"});
    } else if (type == "immortalize") {
        this.circle = elementSetAttributes(this.circle, {"fill":"red"});
    }
    game.appendChild(this.circle);
}
/* Removes (used) bonus */
function removeBonus() {
    game.removeChild(this.circle);
    bonuses.splice(bonuses.indexOf(this),1);
}

/* Adds bonus */
function addBonus() {
    var x = m.floor(m.random()*(WIDTH-100)+50);
    var y = m.floor(m.random()*(HEIGHT-100)+50);
    var type = m.floor(m.random()*3)
    switch(type) {
        case 1: type = "widen"; break;
        case 2: type = "narrow"; break;
        default: type = "immortalize"; break;
    }
    bonuses.push(new bonus(type,x,y));
}

function checkForBonus(x,y) {
    // Add code to check if player happened to hit a bonus
    for (z in bonuses) {
        var distance = m.pow((x-bonuses[z].x),2)+m.pow((y-bonuses[z].y),2);
        if (distance < BONUS_R_POW2) return bonuses[z];
    } return false;
}
