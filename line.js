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
var PLAYERS = 4; // Default amount of players
var COLORS = ["#0000CD","#008000","#FF0000","#FFA500"]; // Some colors
var DEFAULT_KEYS_LEFT = [37,65,74,97]; // Default left keys
var DEFAULT_KEYS_RIGHT = [39,68,76,99]; // Default right keys
var TURNINGSPEED = 0.1;
var MOVINGSPEED = 2;
var LOOPSPEED = 30;
var FULLCIRCLE = 2*m.PI;
var MOVINGSPEED_POW2 = m.pow(MOVINGSPEED,2);
var BETWEENBREAKS = 75;
var BREAKLENGTH = 10;
var WIDTH; // Will be set in init()
var HEIGHT; // Will be set in init()
var NS = "http://www.w3.org/2000/svg"; // SVG namespace
var fontSize = 25;
var font = "Courier New, monospace";

/* Global variables */
var game; // SVG element
var border; // Border's SVGrect element
var timeout;
var mainMenuOn;
var players = new Array(); // Array for line-objects

/* Initializing function */
function init() {
    game = document.getElementById("game");
    border = game.getElementById("border");
    WIDTH = game.getAttribute("width");
    HEIGHT = game.getAttribute("height");
    for (var i = 0; i < PLAYERS; i++) { // Create players
        players.push(new line("player"+(i+1),COLORS[i],DEFAULT_KEYS_LEFT[i],
        DEFAULT_KEYS_RIGHT[i]));
    }
	menu();
}

/* Starts the game */
function startGame() {
    mainMenuOn = false;
    for (var i = 0; i < players.length; i++) { // Setting up players ->
        if (i < playerAmount) {
            players[i] = new line("player"+(i+1),players[i].colour,
                players[i].keyL,players[i].keyR);
            var x = m.floor(m.random()*(WIDTH-200)+100);
            var y = m.floor(m.random()*(HEIGHT-200)+100);
            addPoint(players[i],x,y,false); // Add starting point
        } else { // Hack for non-playing players FIXME
            players[i].alive = false;
        }
    }
    timeout = setTimeout("main()",LOOPSPEED); // Start "loop"
    document.body.addEventListener("keydown",function(e){inputKeyDown(e)},
        true); // Begin input ->
    document.body.addEventListener("keyup",function(e){inputKeyUp(e)},true);
}

/* Main "loop" */
function main(bots) {
    var time = (new Date()).getTime(); // To count time of one loop
    if (wallMode == "deadly") // Set the borders if wallMode has changed
        border.setAttributeNS(null,"stroke-dasharray","");
    else if (wallMode == "warp") 
        border.setAttributeNS(null,"stroke-dasharray","4 4");
    for (i in players) {
        if (players[i].alive) {
            var warped = false;
            if (bots) botControl(players[i]); // Control bots
            else inputLoop(players[i]); // Control players
            var sameDirection = false; // Assume that players direction changed
            if (players[i].direction == players[i].oldDirection) 
                sameDirection = true;
            var old_x = players[i].x;
            var x = players[i].x + players[i].speed*m.sin(
                players[i].direction);
            var old_y = players[i].y;
            var y = players[i].y + players[i].speed*m.cos(
                players[i].direction);
            if (checkForCollision(x,y,old_x,old_y,players[i])) { // Collision
                if (!breaksOn || !players[i].break) {
                    players[i].alive = false;
                    spillBlood(x,y);
                }
            } else if ((wallMode == "warp") && // Warping ->
                    (x <= 0 || x >= WIDTH || y <= 0 || y >= HEIGHT)) {
                addPoint(players[i],x,y,sameDirection);
                if (x <= 0) { x = WIDTH; }
                else if (x >= WIDTH) { x = 0; }
                else if (y <= 0) { y = HEIGHT; }
                else if (y >= HEIGHT) { y = 0; }
                splitLine(players[i]);
                players[i].oldDirection="";
                warped = true;
            }
            if (breaksOn) { // Breaking ->
                if (!players[i].break && players[i].breakcounter <= 0) {
                    addPoint(players[i],x,y,sameDirection);
                    players[i].oldDirection="";
                    players[i].break = true;
                    players[i].breakcounter=BREAKLENGTH;
                } else if (players[i].break && players[i].breakcounter <= 0) {
                    splitLine(players[i]);
                    addPoint(players[i],x,y,false);
                    players[i].break = false;
                    players[i].breakcounter=BETWEENBREAKS+m.floor(
                        m.random()*BETWEENBREAKS);
                } else if (!players[i].break) { 
                    addPoint(players[i],x,y,sameDirection);
                    if (warped == false) players[i].oldDirection = 
                        players[i].direction;
                } else {
                    moveCircle(players[i],x,y);
                }
                players[i].breakcounter--;
            } else { // Normally drawing ->
                addPoint(players[i],x,y,sameDirection);
                if (warped == false) players[i].oldDirection = 
                    players[i].direction;
            }
        }
    }
    if (isGameOver()) { // When the game is over ->
        if (bots) botGameOver();
        else gameOver();
        return;
    }
    time = (new Date()).getTime()-time; // Looping ->
    looptime = LOOPSPEED - time;
    if (looptime < 0) looptime = 0;
    if (bots && timeout && mainMenuOn) timeout = setTimeout("main(true)",
        looptime);
    else if (timeout) timeout = setTimeout("main()",looptime);
}

/* Check for a collision */
function checkForCollision(dx,dy,cx,cy,player,dopti) {
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
    if (cx != null && cy != null)  {
        var length = 0;
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
                var fy = xy.slice(1,2)[0]; // Optimization =>
                if ((ex > cx && fx > cx && ex > dx && fx > dx) || 
                    (ex < cx && fx < cx && ex < dx && fx < dx) ||
                    (ey < cy && fy < cy && ey < dy && fy < dy) ||
                    (ey < cy && fy < cy && ey < dy && fy < dy))
                    continue; // Don't calculate unuseful ones
                if (length == 0) // Optimization ->
                    var length = m.pow(dx-cx,2)+m.pow(dy-cy,2);
                if (length > MOVINGSPEED_POW2 && dopti != null) {
                    cx = dx - player.speed*m.sin(player.direction);
                    cy = dy - player.speed*m.cos(player.direction);
                } // Calculations =>
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
        if (dx <= 0 || dx >= WIDTH || dy <= 0 || dy >= HEIGHT) {
            return true;
        }
    }
    return false;
}

/* Check if the game is over */
function isGameOver() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].alive) return false;
    } return true;
}

/* When a collision happens (cleaning up and informing user) */
function gameOver() {
    timeout = clearTimeout(timeout);
    document.body.removeEventListener("keyup",function(e){inputKeyUp(e)},true);
    document.body.removeEventListener("keydown",function(e){inputKeyDown(e)},
        true);
    var text = document.createElementNS(NS,"text");
    elementSetAttributes(text,{"x":100,"y":100,"fill":"red",
        "id":"gameover_text", "z-index":40});
    text.textContent="Game Over!";
    game.appendChild(text);
	retryMenu();
}

/* Adds attributes to an element */
function elementSetAttributes(element,values) {
    for (name in values) {
        element.setAttributeNS(null,name,values[name]);
    }
    return element;
}
