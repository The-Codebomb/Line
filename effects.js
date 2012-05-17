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
/*
 * This effect needs improvement, right now it tries to make some
 * circular shape without much success.
 */
function spillBlood(x,y) {
    for (var i = 0; i < 50; i++) {
        var nx = m.random()*30+x-15;
        if (nx < x-5) var ny = m.random()*10+y-10;
        else if (nx > x+5) var ny = m.random()*10+y;
        else var ny = m.random()*30+y-15;
        if (nx >= game_width) nx = game_width-1;
        else if(nx <= 0) nx = 1;
        if (ny >= game_height) ny = game_height-1;
        if (ny <= 0) ny = 1;
        spill = document.createElementNS(NS,"circle");
        spill = elementSetAttributes(spill,{"r":m.random(), 
            "fill":"red", "class":"blood", "cx":nx, "cy":ny});
        gamearea.appendChild(spill);
    }
}
