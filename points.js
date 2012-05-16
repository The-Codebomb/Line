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
function newPointsDisplay() {
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
        "y":160, "font-family":font, "font-size":fontSize, 
        "text-anchor":"middle"});
    title.textContent = "Points";
    pointsarea.appendChild(title);
    var text = document.createElementNS(NS,"text"); // Add "points to finish" ->
    elementSetAttributes(text,{"x":game_width+POINTS_WIDTH/2, 
        "y":100, "font-family":font, "font-size":fontSize/2, 
        "text-anchor":"middle"});
    text.textContent = "Points needed";
    pointsarea.appendChild(text);
    var text2 = document.createElementNS(NS,"text");
    elementSetAttributes(text2,{"x":game_width+POINTS_WIDTH/2, 
        "y":100+fontSize/2, "font-family":font, "font-size":fontSize/2, 
        "text-anchor":"middle"});
    text2.textContent = "to win: "+points_to_end;
    pointsarea.appendChild(text2);
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
    var points = new Array(); // Sort points ->
    for (var i = 0; i < PLAYERS; i++) {
        if (players[i]) {
            if (points.length == 0) { // Add first
                points.push({"name":players[i].name, 
                    "points":players[i].points});
                continue;
            }
            var added = false;
            for (var j in points) { // Next ones
                if (points[j].points < players[i].points) {
                    points.splice(j,0,
                        {"name":players[i].name, "points":players[i].points});
                    added = true;
                    break;
                }
            }
            if (!added) 
                points.push({"name":players[i].name, 
                    "points":players[i].points});
        }
    }
    for (var i in points_texts) { // Change texts ->
        points_texts[i].textContent = points[i].name+": "+points[i].points;
    }
}
