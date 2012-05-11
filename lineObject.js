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
function line(name,colour,keyL,keyR,isBot) {
    this.addPoint=addPoint;
    this.moveCircle=moveCircle;
    this.splitLine=splitLine;
    this.direction=m.random()*FULLCIRCLE;
    this.oldDirection;
    this.keyL=keyL;
    this.keyR=keyR;
    this.keyDown=false;
    this.name=name;
    this.colour=colour;
    this.alive=true;
    this.breakcounter=TIME_BETWEEN_BREAKS+m.floor(
        m.random()*TIME_BETWEEN_BREAKS);
    this.break=false;
    this.speed=MOVINGSPEED;
    this.x;
    this.y;
    this.d=1;
    this.bonus=new Array(); // [{"type":type_of_bonus,"time":time_left}, ...]
    this.bot=(isBot)?true:false;
    this.polyline = document.createElementNS(NS,"polyline");
    this.polyline = elementSetAttributes(this.polyline, {"points":"", 
        "fill":"none", "stroke":colour, "stroke-width":this.d, "class":name});
    this.circle = document.createElementNS(NS,"circle");
    this.circle = elementSetAttributes(this.circle, {"r":m.round(this.d/2), 
        "fill":colour, "class":name});
    gamearea.appendChild(this.polyline);
    gamearea.appendChild(this.circle);
}
/* Adds a point and moves the circle */
function addPoint(x,y,replaceOld) { 
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
