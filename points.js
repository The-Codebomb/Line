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
    var background = document.createElementNS(NS,"rect"); // Add background ->
    elementSetAttributes(background,{"id":"p_background", "x":game_width, 
        "width":POINTS_WIDTH, "height":game_height, "fill":"white", 
        "stroke":"black", "stroke-width":"1"});
    pointsarea.appendChild(background);
	
    var title = createText(game_width+POINTS_WIDTH/2,160,"Points","",
		"", "points")// Add title ->
		
    var text = createText(game_width+POINTS_WIDTH/2,100, "Points needed",
		"", fontSize/2, "points");
		
    var text2 = createText(game_width+POINTS_WIDTH/2,100+fontSize/2,
		"to win: "+points_to_end, "", fontSize/2, "points");
		
    var offset = 0; // Add text for every player ->
    var i = 0;
    while (players[i] && players[i].alive) {
        points_texts[i] = createText(game_width+POINTS_WIDTH/2,200+i*30,"",
			players[i].colour, fontSize/3*2, "points");
        i++;
    }
    updatePoints(); // Add texts
}

/* Updates displayed game status */
function updatePoints() {
    var points = new Array(); // Sort points ->
    for (var i = 0; i < PLAYERS; i++) {
        if (players[i] && players[i].playing) {
            if (points.length == 0) { // Add first
                points.push({"name":players[i].name, 
                    "points":players[i].points,
					"colour":players[i].colour});
                continue;
            }
            var added = false;
            for (var j in points) { // Next ones
                if (points[j].points < players[i].points) {
                    points.splice(j,0,
                        {"name":players[i].name, "points":players[i].points,
							"colour":players[i].colour});
                    added = true;
                    break;
                }
            }
            if (!added) 
                points.push({"name":players[i].name, 
                    "points":players[i].points,
					"colour":players[i].colour});
        }
    }
    for (var i in points) { // Change texts ->
        points_texts[i].textContent = points[i].name+": "+points[i].points;
		elementSetAttributes(points_texts[i],{"fill":points[i].colour});
    }
}
