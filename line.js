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

/* Some configs */
var breaksOn = true; // is breaking used or not
var wallMode = "deadly"; // valid values are "deadly" and "warp"

/* Constants */
m = Math;
var TURNINGSPEED = 0.1;
var MOVINGSPEED = 2;
var LOOPSPEED = 30;
var FULLCIRCLE = 2*m.PI;
var BETWEENBREAKS = 75;
var BREAKLENGTH = 10;
var WIDTH = 800;	// CHANGE THESE IF YOU CHANGE CANVAS SIZE!
var HEIGHT = 600;
var NS = "http://www.w3.org/2000/svg"; // SVG namespace
var fontSize = 25;
var font = "Courier New, monospace";

/* Global variables */
var game; // SVG element
var border; // Border's SVGrect element
var timeout;
var bots; // Are bots used (for menus) MAY BE REMOVED IN FUTURE
var players = new Array(); // Array for line-objects

/* Initializing function */
function init() { // Will be mostly redone when menus are implemented
    game = document.getElementById("game");
    border = game.getElementById("border");
	menu();
}

/* Starts the game */
function startGame() { // Adding one player -> FIXME
	player1 = new line("player","#0000cd",pl1btnL,pl1btnR); 
    var x = m.floor(m.random()*(WIDTH-200)+100);
    var y = m.floor(m.random()*(HEIGHT-200)+100);
    addPoint(player1,x,y,false); // Add starting point
    timeout = setTimeout("main()",LOOPSPEED); // Start "loop"
    document.body.addEventListener("keydown",function(e){inputKeyDown(e)},
        true); // Begin input ->
    document.body.addEventListener("keyup",function(e){inputKeyUp(e)},true);
}

/* Main "loop" */
function main() {
    var time = (new Date()).getTime(); // To count time of one loop
    var warped = 0;
    if (wallMode == "deadly") // Set the borders if wallMode has changed
        border.setAttributeNS(null,"stroke-dasharray","");
    else if (wallMode == "warp") 
        border.setAttributeNS(null,"stroke-dasharray","4 4");
    for (i in players) {
        var player = players[i];
        if (bots) { // If just bots are playing
            botControl(player);
            if (!player.alive) {
                timeout = setTimeout("botGameOver()",1000);
                return;
            }
        } else inputLoop(player); // Check input system
        var sameDirection = false; // New cordinates ->
        if (player.direction == player.oldDirection) sameDirection = true;
        var x = player.x + player.speed*m.sin(player.direction);
        var y = player.y + player.speed*m.cos(player.direction);
        if (checkForCollision(x,y,player)) { // Collision detection ->
            if (!breaksOn || !player.break) {
                spillBlood(x,y);
                gameOver();
                if (!bots) return; else timeout=true;
            }
        } else if (wallMode == "warp" && // Warping ->
            (x <= 0 || x >= 800 || y <= 0 || y >= 600)) {
            addPoint(player,x,y,sameDirection);
            if (x <= 0) { x = 800; }
            else if (x >= 800) { x = 0; }
            else if (y <= 0) { y = 600; }
            else if (y >= 600) { y = 0; }
            splitLine(player);
            player.oldDirection="";
            warped = 2;
        }
        if (breaksOn) { // Breaking ->
            if (!player.break && player.breakcounter <= 0) {
                addPoint(player,x,y,sameDirection);
                player.oldDirection="";
                player.break = true;
                player.breakcounter=BREAKLENGTH;
            } else if (player.break && player.breakcounter <= 0) {
                splitLine(player);
                addPoint(player,x,y,false);
                player.break = false;
                player.breakcounter=BETWEENBREAKS+m.floor(
                    m.random()*BETWEENBREAKS);
            } else if (!player.break) { 
                addPoint(player,x,y,sameDirection);
                if (warped <= 0) player.oldDirection = player.direction;
                else if (warped > 0) warped--; 
            } else {
                moveCircle(player,x,y);
            }
            player.breakcounter--;
        } else { // Normally drawing ->
            addPoint(player,x,y,sameDirection);
            if (warped <= 0) player.oldDirection = player.direction;
            else if (warped > 0) warped--; 
        }
    }
    time = (new Date()).getTime()-time; // Looping ->
    looptime = LOOPSPEED - time;
    if (looptime < 0) looptime = 0;
    if (timeout) timeout = setTimeout("main()",looptime);
}

/* Check for a collision */
function checkForCollision(x,y,player) {
    /*
     * Collision between lines is detected by calculating 
     * points that are common to two segments. Segment means
     * here the part of line between two points.
     *
     * The first segment is the one we just have drawn.
     * To get the other one we must get all lines,
     * then split their points and now we get two points
     * for each segment.
     *
     * So we repeat this to nearly all segments of all lines:
     *  - Calculate x-cordinate that is common to two segments
     *  - Check that the cordinate is part of both segments
     *    - If it is return true (player collided)
     *    - If it isn't continue
     * 
     * The calculations and checks are last lines of this part
     * and all boring stuff is before them.
     */
    var cline = player.polyline.getAttributeNS(null,"points");
    cline = cline.match(/[\d\.]+,[\d\.]+ [\d\.]+,[\d\.]+$/);
    if (cline != null)  {
        cline = cline[0].split(" ");
        var xy = cline[0].split(",");
        var cx = xy.slice(0,1)[0];
        var cy = xy.slice(1,2)[0];
        var dx = x;
        var dy = y;
        var polylines = game.getElementsByTagName("polyline");
        for (var i = 0; i < polylines.length; i++) {
            var points = polylines[i].getAttributeNS(null,"points");
            points = points.split(" ");
            if (polylines[i] == player.polyline) { // Working around the 
                if (points.length > 2) { // player's own segments
                    points = points.splice(0,points.length-2);
                } else points = points.splice(0,0);
            }
            for (var j = 0; j < points.length-1; j++) {
                var eline = new Array(points[j], points[j+1]);
                var xy = eline[0].split(",");
                var ex = xy.slice(0,1)[0];
                var ey = xy.slice(1,2)[0];
                var xy = eline[1].split(",");
                var fx = xy.slice(0,1)[0];
                var fy = xy.slice(1,2)[0];
                if ((ex > cx && fx > cx && ex > dx && fx > dx) || 
                    (ex < cx && fx < cx && ex < dx && fx < dx) ||
                    (ey < cy && fy < cy && ey < dy && fy < dy) ||
                    (ey < cy && fy < cy && ey < dy && fy < dy))
                    continue; // Don't calculate unuseful ones
                var res = (((cx*dy-cy*dx)*(ex-fx)-(cx-dx)*(ex*fy-ey*fx))/
                    ((cx-dx)*(ey-fy)-(cy-dy)*(ex-fx)));
                if ((cx <= res && res <= dx)||(cx >= res && res >= dx)) {
                    if ((ex <= res && res <= fx)||(ex >= res && res >= fx))
                        return true;
                }
            }
        }
    }
    if (wallMode == "deadly") { // Check if player hit the wall
        if (x <= 0 || x >= WIDTH || y <= 0 || y >= HEIGHT) {
            return true;
        }
    }
    return false;
}

/* When a collision happens (cleaning up and informing user) */
function gameOver() {
    timeout = clearTimeout(timeout);
    document.body.removeEventListener("keyup",function(e){inputKeyUp(e)},true);
    document.body.removeEventListener("keydown",function(e){inputKeyDown(e)},
        true);
    var GOtext = document.createElementNS(NS,"text");
    GOtext.setAttributeNS(null,"x","100");
    GOtext.setAttributeNS(null,"y","100");
    GOtext.setAttributeNS(null,"fill","red");
    GOtext.textContent="Game Over!";
    game.appendChild(GOtext);
	retryMenu();
}

/* Adds attributes to an element */
function elementSetAttributes(element,values) {
    for (name in values) {
        element.setAttributeNS(null,name,value[name]);
    }
    return element;
}
