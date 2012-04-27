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
function line(name,colour,keyL,keyR) {
    this.direction=m.random()*FULLCIRCLE;
    this.oldDirection;
    this.keyL=keyL;
    this.keyR=keyR;
    this.keyDown=false;
    this.name=name;
    this.colour=colour;
    this.alive=true;
    this.breakcounter=BETWEENBREAKS+m.floor(m.random()*BETWEENBREAKS);
    this.break=false;
    this.speed=MOVINGSPEED;
    this.x;
    this.y;
    this.d=1;
    this.polyline = document.createElementNS(NS,"polyline");
    this.polyline = elementSetAttributes(this.polyline, {"points":"", 
        "fill":"none", "stroke":colour, "stroke-width":this.d, "class":name});
    this.circle = document.createElementNS(NS,"circle");
    this.circle = elementSetAttributes(this.circle, {"r":m.round(this.d/2), 
        "fill":colour, "class":name});
    game.appendChild(this.polyline);
    game.appendChild(this.circle);
}
/* Adds a point and moves the circle */
function addPoint(lobj,x,y,replOld) { 
    var points = lobj.polyline.getAttributeNS(null,"points");
    if (replOld == true) {
        points = points.replace(/ [\d\.]+,[\d\.]+$/,"");
        lobj.polyline.setAttributeNS(null,"points",points);
    }
    if (points) lobj.polyline.setAttributeNS(null,"points",points+" "+x+","+y);
    else lobj.polyline.setAttributeNS(null,"points",points+x+","+y);
    moveCircle(lobj,x,y);
}
/* Just moves the circle */
function moveCircle(lobj,x,y) { 
    lobj.circle.setAttributeNS(null,"cx",x);
    lobj.circle.setAttributeNS(null,"cy",y);
    lobj.x = x;
    lobj.y = y;
}
/* Begins a new line */
function splitLine(lobj) { 
    lobj.polyline = document.createElementNS(NS,"polyline");
    lobj.polyline = elementSetAttributes(lobj.polyline, {"points":"", 
        "fill":"none", "stroke":lobj.colour, "stroke-width":lobj.d, 
        "class":name});
    game.appendChild(lobj.polyline);
}
