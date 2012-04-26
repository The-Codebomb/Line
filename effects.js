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

/* The blood effect */
function spillBlood(x,y) {
    var spills = new Array();
    for (var i = 0; i < 50; i++) {
        var nx = m.random()*30+x-15; // Trying to make some randomness
        if (nx < x-5) var ny = m.random()*10+y-10; // and a circular shape
        else if (nx > x+5) var ny = m.random()*10+y;
        else var ny = m.random()*30+y-15;
        spills.push(document.createElementNS(NS,"circle"));
        spills[i].setAttributeNS(null,"r",m.random());
        spills[i].setAttributeNS(null,"fill","red");
        spills[i].setAttributeNS(null,"class","blood");
        spills[i].setAttributeNS(null,"cx",nx);
        spills[i].setAttributeNS(null,"cy",ny);
        game.appendChild(spills[i]);
    }
}
