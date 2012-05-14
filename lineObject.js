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

/* Line object (each player has one) */
/*
 * Methods:
 *  - addPoint, adds new point
 *  - mirrorKeys, mirrors players keys
 *  - moveCircle, moves line's circle (usually used by addPoint)
 *  - narrow, narrows line
 *  - slowdown, slows down moving speed
 *  - speedup, speeds up moving speed
 *  - widen, widens line
 */
function line(name,colour,keyL,keyR,isBot) {
    this.addPoint=addPoint;
    this.mirrorKeys=mirrorPlayerKeys;
    this.moveCircle=moveCircle;
    this.narrow=narrowLine;
    this.slowdown=slowdownLine;
    this.speedup=speedupLine;
    this.splitLine=splitLine;
    this.widen=widenLine;
    this.alive=true;
    this.bonus=new Array(); // [{"type":type_of_bonus,"time":time_left}, ...]
    this.bot=(isBot)?true:false;
    this.break=false;
    this.breakcounter=TIME_BETWEEN_BREAKS+m.floor(
        m.random()*TIME_BETWEEN_BREAKS);
    this.colour=colour;
    this.d=5;
    this.direction=m.random()*FULLCIRCLE;
    this.keyDown=false;
    this.keyL=keyL;
    this.keyR=keyR;
    this.keysMirrored=false;
    this.name=name;
    this.points=0;
    this.sharpTurns=false;
    this.speed=MOVINGSPEED;
    this.oldDirection;
    this.warp=false;
    this.x;
    this.y;
    this.circle = document.createElementNS(NS,"circle");
    this.circle = elementSetAttributes(this.circle, {"r":(this.d/2), 
        "fill":colour, "class":name});
    this.polyline = document.createElementNS(NS,"polyline");
    this.polyline = elementSetAttributes(this.polyline, {"points":"", 
        "fill":"none", "stroke":colour, "stroke-width":this.d, "class":name});
    gamearea.appendChild(this.circle);
    gamearea.appendChild(this.polyline);
}
/* Adds a point and moves the circle */
function addPoint(x,y,replaceOld) { 
    if (x == undefined || y == undefined) return;
    var points = this.polyline.getAttributeNS(null,"points");
    if (replaceOld == true) {
        points = points.replace(/ [\d\.]+,[\d\.]+$/,"");
        this.polyline.setAttributeNS(null,"points",points);
    }
    if (points) this.polyline.setAttributeNS(null,"points",points+" "+x+","+y);
    else this.polyline.setAttributeNS(null,"points",points+x+","+y);
    this.moveCircle(x,y);
}
/* Just moves the circle */
function moveCircle(x,y) { 
    this.circle = elementSetAttributes(this.circle,{"cx":x,"cy":y});
    this.x = x;
    this.y = y;
}
/* Begins a new line */
function splitLine() { 
    this.polyline = document.createElementNS(NS,"polyline");
    this.polyline = elementSetAttributes(this.polyline, {"points":"", 
        "fill":"none", "stroke":this.colour, "stroke-width":this.d, 
        "class":name});
    gamearea.appendChild(this.polyline);
}
/* Narrows line */
function narrowLine(amount) {
    if (amount) {
        if (this.d > amount) this.d -= amount;
    } else if (this.d > 1) this.d--;
    this.splitLine();
    return this.d;
}
/* Widens line */
function widenLine(amount) {
    if (amount) this.d += amount;
    else this.d++;
    this.splitLine();
    return this.d;
}
/* Slows down line */
function slowdownLine(amount) {
    if (amount) {
        if (this.speed > amount) this.speed -= amount;
    } else if (this.speed > 1) this.speed--;
    return this.speed;
}
/* Speeds up line */
function speedupLine(amount) {
    this.speed++;
    return this.speed;
}
/* Mirror keys */
function mirrorPlayerKeys() {
    this.keysMirrored = !this.keysMirrored;
    return this.keysMirrored;
}
