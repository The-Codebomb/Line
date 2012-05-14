/*
   Copyright (c) 2012, Tomi Leppänen
   
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
/*
 * Handles drawing points area and updating it
 */

var points_texts;

/* Draws points area */
/*
 * Must be called before game begins
 */
function addPointsDisplay() {
    points_texts = new Array();
    while (pointsarea.lastChild) { // Clear points area ->
        pointsarea.removeChild(pointsarea.lastChild);
    }
    var border = document.createElementNS(NS,"rect"); // Add borders ->
    elementSetAttributes(border,{"id":"border", "x":game_width, 
        "width":POINTS_WIDTH, "height":game_height, "fill":"none", 
        "stroke":"black", "stroke-width":"1"});
    pointsarea.appendChild(border);
    var title = document.createElementNS(NS,"text"); // Add title ->
    elementSetAttributes(title,{"x":game_width+POINTS_WIDTH/2, 
        "y":160, "font-family":font, 
        "font-size":fontSize, "text-anchor":"middle"});
    title.textContent = "Points";
    pointsarea.appendChild(title);
    var offset = 0; // Add text for every player ->
    var i = 0;
    while (players[i] && players[i].alive) {
        points_texts[i] = document.createElementNS(NS,"text");
        elementSetAttributes(points_texts[i],{"x":game_width+POINTS_WIDTH/2, 
            "y":200+i*30, "font-family":font, "font-size":fontSize/3*2, 
            "text-anchor":"middle"});
        pointsarea.appendChild(points_texts[i]);
        i++;
    }
    updatePoints(); // Add texts
}

/* Updates displayed game status */
function updatePoints() {
    var points = new Array(); // Sort points (unfinished) ->
    for (var i = 0; i < PLAYERS; i++) {
        if (players[i]) {
            points.push({"name":players[i].name, "points":players[i].points});
        }
    }
    for (var i = 0; i < PLAYERS; i++) { // Change texts ->
        if (players[i] && players[i].alive) {
            points_texts[i].textContent = points[i].name+": "+points[i].points;
        }
    }
}
