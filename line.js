/**
   Copyright (c) 2012, Tomi Leppänen aka Tomin
   Copyright (c) 2012, Anssi "Miffyli" Kanervisto
        members of group 'The Codebomb'
   
   Line!
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

/**
 * Achtung, die Kurve! is a game of G. Burg Internet Solutions and
 * This Game called 'Line!' has nothing to do with them, but is a 
 * independently developed title that has many similarities with 
 * the Original Game. If you have something to complain or praise 
 * about This Game, write about it to code@codebomb.dy.fi .
 * 
 * Code contributions are welcome, when they are made with care and
 * passion. Git commit messages should be written well (nowadays). 
 * Forks are allowed of course.
 * 
 * Check LICENSE file in this directory for more information about 
 * licensing.
 * 
 * This Game is allowed distribute in minified form when this and 
 * above comment are included in readable form. Also GPL license 
 * of version 2 or later is recommended to be provided as a separate 
 * file.
 * 
 * You may want to check out http://codebomb.dy.fi/
 */

/* Some configs */
var breaksOn = true; // is breaking used or not
var wallMode = "deadly"; // valid values are "deadly" and "warp"

/* Constants */
m = Math;
var PLAYERS = 4; // Default amount of players
var COLORS = ["#0000CD","#008000","#FF0000","#FFA500"]; // Colors
var NAMES = ["Player 1","Player 2","Player 3","Player 4"]; // Names
var DEFAULT_KEYS_LEFT = [37,65,74,97]; // Default left keys
var DEFAULT_KEYS_RIGHT = [39,68,76,99]; // Default right keys
var TURNINGSPEED = 0.1;
var MOVINGSPEED = 2;
var LOOPSPEED = 30;
var FULLCIRCLE = 2*m.PI;
var MOVINGSPEED_POW2 = m.pow(MOVINGSPEED,2); // Optimization
var TIME_BETWEEN_BREAKS = 75;
var BREAKLENGTH = 10;
var MAX_TIME_BETWEEN_BONUSES = 800;
var MAX_BONUSES = 5;
var BONUS_TIME = 500; // How many loops bonuses affect
var NS = "http://www.w3.org/2000/svg"; // SVG namespace
var fontSize = 25;
var font = "Courier New, monospace";

/* Global variables */
var game; // SVG element
var gamearea; // SVG element
var menuarea; // SVG element
var border; // Border's SVGrect element
var timeout;
var game_width; // Gamearea width
var game_height; // Gamearea height
var next_bonus_in = m.floor(m.random()*MAX_TIME_BETWEEN_BONUSES);
var players = new Array(); // Array for line-objects

/* Initializing function */
function init() {
    game = document.getElementById("game"); // Setting up variables ->
    gamearea = document.getElementById("gamearea");
    menuarea = document.getElementById("menu");
    border = game.getElementById("border"); // Setting up correct height =>
    if (game.getBoundingClientRect().height > window.innerHeight) {
        window.addEventListener("resize",function(){fixGameHeight()},false);
        fixGameHeight();
    }
    game_width = game.viewBox.baseVal.width;
    game_height = game.viewBox.baseVal.height;
    for (var i = 0; i < PLAYERS; i++) { // Create players ->
        players.push(new line(NAMES[i],COLORS[i],DEFAULT_KEYS_LEFT[i],
        DEFAULT_KEYS_RIGHT[i]));
    }
	menu(); // Display menus
}

/* Begins the game */
function startGame() {
    document.body.removeEventListener("keydown",startGameKeyHandler,true);
    mainMenuOn = false;
    for (var i = 0; i < players.length; i++) { // Setting up players ->
        if (i < playerAmount) {
            players[i] = new line(players[i].name,players[i].colour,
                players[i].keyL,players[i].keyR);
            var x = m.floor(m.random()*(game_width-200)+100);
            var y = m.floor(m.random()*(game_height-200)+100);
            players[i].addPoint(x,y,false); // Add starting point
        } else { // Hack for non-playing players FIXME
            players[i].alive = false;
        }
    }/*
    if (playerAmount == 1) { // On one player game, add one bot
        players[1] = new line(players[1].name,players[1].colour,
            players[1].keyL,players[1].keyR,true);
        var x = m.floor(m.random()*(game_width-200)+100);
        var y = m.floor(m.random()*(game_height-200)+100);
        players[1].addPoint(x,y,false); // Add starting point
        players[1].alive = true;
    }*/
    wallMode = "deadly";
    timeout = setTimeout("main()",LOOPSPEED); // Start "loop" and input ->
    document.body.addEventListener("keydown",inputKeyDownHandler,true);
    document.body.addEventListener("keyup",inputKeyUpHandler,true);
}

/* Main "loop" */
/*
 * This function handles running the game motor:
 *  - Checks wall mode and sets walls according to that
 *  - Runs player's inputLoop (or bot's botControl) (external)
 *  - Calculates new line ending
 *  - Checks if player hit something (external)
 *  - Warps if needed
 *  - Checks if player hit bonus (external) and handles it
 *  - Handles bonuses that player already has
 *  - Breaks or continues line
 *  - Draws some new line
 *  - Adds new bonuses (partially external)
 *  - Checks if game is over (external)
 *  - Sets timeout for next iteration
 */
function main(bots) {
    var time = (new Date()).getTime(); // To count time of one loop
    if (wallMode == "deadly") // Set the borders if wallMode has changed
        border.setAttributeNS(null,"stroke-dasharray","");
    else if (wallMode == "warp") 
        border.setAttributeNS(null,"stroke-dasharray","4 4");
    for (var i in players) {
        if (players[i].alive) {
            var warped = false;
            if (players[i].bot) botControl(players[i]); // Control bots
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
            if (checkForCollision(x,y,old_x,old_y,players[i])) {
                players[i].alive = false;
                spillBlood(x,y);
            }
            if ((wallMode == "warp" || players[i].warp) && // Warping ->
                    (x <= 0 || x >= game_width || y <= 0 || y >= game_height)){
                if (!players[i].break) players[i].addPoint(x,y,sameDirection);
                if (x <= 0) { x = game_width; }
                else if (x >= game_width) { x = 0; }
                else if (y <= 0) { y = game_height; }
                else if (y >= game_height) { y = 0; }
                players[i].splitLine();
                players[i].oldDirection="";
                warped = true;
            } // Bonus system =>
            var bonus = checkForBonus(x,y); // Check if player hit a bonus ->
            if (bonus) { // When a new bonus is used
                players[i].bonus.push({"type":bonus.type,"time":BONUS_TIME});
                switch(bonus.type) {
                    case "immortalize": players[i].break = true; break;
                    case "narrow": 
                        players[i].narrow(2);
                        players[i].addPoint(old_x,old_y);
                        break;
                    case "slowdown": players[i].slowdown(); break;
                    case "speedup": players[i].speedup(); break;
                    case "turnSharply": players[i].sharpTurns = true; break;
                    case "warp": players[i].warp = true; break;
                    case "widen": 
                        players[i].widen(2);
                        players[i].addPoint(old_x,old_y);
                        break;
                    case "mirrorKeys": 
                        for (var k in players) {
                            if (k != i) {
                                players[k].mirrorKeys();
                                players[k].bonus.push({"type":"keysMirrored",
                                    "time":BONUS_TIME});
                            }
                        }
                        break;
                    case "narrowOthers": 
                        for (var k in players) {
                            if (k != i) {
                                players[k].narrow(2);
                                players[k].addPoint(old_x,old_y);
                                players[k].bonus.push({"type":"narrow",
                                    "time":BONUS_TIME});
                            }
                        } break;
                    case "slowdownOthers": 
                        for (var k in players) {
                            if (k != i) 
                                players[k].slowdown();
                                players[k].bonus.push({"type":"slowdown",
                                    "time":BONUS_TIME});
                        } break;
                    case "speedupOthers": 
                        for (var k in players) {
                            if (k != i) {
                                players[k].speedup();
                                players[k].bonus.push({"type":"speedup",
                                    "time":BONUS_TIME});
                            }
                        } break;
                    case "turnOthersSharply": 
                        for (var k in players) {
                            if (k != i) {
                                players[k] // FIXME
                                players[k].bonus.push({"type":"turnSharply",
                                    "time":BONUS_TIME});
                            }
                        }
                        break;
                    case "widenOthers": 
                        for (var k in players) {
                            if (k != i) {
                                players[k].widen(2);
                                players[k].addPoint(old_x,old_y);
                                players[k].bonus.push({"type":"widen",
                                    "time":BONUS_TIME});
                            }
                        } break;
                    case "clear": 
                        var lines = gamearea.getElementsByTagName("polyline");
                        for (var k = lines.length - 1; k >= 0; k--) {
                            gamearea.removeChild(lines[k]);
                        }
                        for (var k in players) {
                            players[k].splitLine();
                        }
                        break;
                }
                console.log(bonus.type);
                bonus.remove();
            } // Handle bonuses that player has got =>
            for (var j = players[i].bonus.length-1; j >= 0; j--) {
                if (players[i].bonus[j].time > 0) { // Every iteration
                    switch(players[i].bonus[j].type) {
                        case "immortalize": players[i].breakcounter++; break;
                        case "mirrorKeys": break;
                        case "warpAll": wallMode = "warp"; break;
                    }
                    players[i].bonus[j].time--;
                } else { // Only when bonus ends
                    switch(players[i].bonus[j].type) {
                        case "immortalize": 
                            players[i].break = false;
                            players[i].splitLine();
                            players[i].addPoint();
                            break;
                        case "narrow": 
                            players[i].widen(2);
                            players[i].addPoint(old_x,old_y);
                            break;
                        case "slowdown": players[i].speedup(); break;
                        case "speedup": players[i].slowdown(); break;
                        case "turnSharply": players[i].sharpTurns=false; break;
                        case "warp": players[i].warp = false; break;
                        case "widen": 
                            players[i].narrow(2);
                            players[i].addPoint(old_x,old_y);
                            break;
                        case "keysMirrored": players[i].mirrorKeys(); break;
                        case "warpAll": wallMode = "deadly"; break;
                    }
                    players[i].bonus.splice(
                        players[i].bonus.indexOf(players[i].bonus[j]),1);
                }
            }
            if (breaksOn) { // Breaking ->
                if (!players[i].break && players[i].breakcounter <= 0) {
                    players[i].addPoint(x,y,sameDirection);
                    players[i].oldDirection="";
                    players[i].break = true;
                    players[i].breakcounter=BREAKLENGTH;
                } else if (players[i].break && players[i].breakcounter <= 0) {
                    players[i].splitLine();
                    players[i].addPoint(x,y,false);
                    players[i].break = false;
                    players[i].breakcounter=TIME_BETWEEN_BREAKS+m.floor(
                        m.random()*TIME_BETWEEN_BREAKS);
                } else if (!players[i].break) { 
                    players[i].addPoint(x,y,sameDirection);
                    if (warped == false) players[i].oldDirection = 
                        players[i].direction;
                } else {
                    players[i].moveCircle(x,y);
                }
                players[i].breakcounter--;
            } else { // Normally drawing ->
                players[i].addPoint(x,y,sameDirection);
                if (warped == false) players[i].oldDirection = 
                    players[i].direction;
            }
        }
    }
    if (next_bonus_in <= 0) {
        if (bonuses.length < MAX_BONUSES) addBonus();
        next_bonus_in = m.floor(m.random()*MAX_TIME_BETWEEN_BONUSES);
    } else next_bonus_in--;
    if (isGameOver()) { // When the game is over ->
        if (bots) botGameOver();
        else gameOver();
        return;
    }
    time = (new Date()).getTime()-time; // Looping ->
    looptime = LOOPSPEED - time;
    if (looptime < 0) {looptime = 0; console.log("warning: too slow system");}
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
     * and all boring stuff is before them. The boring stuff 
     * means all string manipulations and such things that are 
     * needed getting other line segments' cordinates
     */
    if ((cx != null && cy != null) && !player.break)  {
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
        } // Check if player hit a wall =>
    } if (wallMode == "deadly" && !player.warp) {
        if (dx <= 0 || dx >= game_width || dy <= 0 || dy >= game_height) {
            return true;
        }
    } return false;
}

/* Check if the game is over */
/*
 * Game ends if only one player is alive
 */
function isGameOver() {
    //skippedOne = false
    skippedOne = true
    for (var i = 0; i < players.length; i++) {
        if (players[i].alive) {
            if (!skippedOne) skippedOne = true;
            else return false;
        }
    } return true;
}

/* Ends game */
/* 
 * Called when a collision happens 
 * Does some cleaning up and informing user (Game Over text)
 */
function gameOver() {
    timeout = clearTimeout(timeout);
    document.body.removeEventListener("keyup",inputKeyUpHandler,true);
    document.body.removeEventListener("keydown",inputKeyDownHandler,
        true);
    var text = document.createElementNS(NS,"text");
    elementSetAttributes(text,{"x":game_width/2-45,"y":game_height/4,
        "fill":"red","id":"gameover_text"});
    text.textContent="Game Over!";
    menuarea.appendChild(text);
	retryMenu();
}

/* Adds attributes to an element */
function elementSetAttributes(element,values) {
    for (var name in values) {
        element.setAttributeNS(null,name,values[name]);
    }
    return element;
}

/* Fixes game height for some (stupid) browsers */
/*
 * At least Opera and Firefox need this
 * Used in init and body.onresize
 */
function fixGameHeight() {
    game.setAttributeNS(null,"height",m.floor(window.innerHeight*0.95));
}

/* Pauses the game */
function pauseGame() {
    timeout = clearTimeout(timeout); // Stop the "loop" and input ->
    document.body.removeEventListener("keyup",inputKeyUpHandler,true);
    document.body.removeEventListener("keydown",inputKeyDownHandler,true);
    var text = document.createElementNS(NS,"text"); // Add informative text ->
    text = elementSetAttributes(text,{"x":game_width/2-90,"y":game_height/4,
        "fill":"black","id":"pause_text"});
    text.textContent="Press space to continue!";    
    menuarea.appendChild(text); // Key handler for space =>
    setTimeout('document.body.addEventListener("keyup",keyHandlerPause,true)', 
        300);
}

/* Continues the game */
function continueGame() {
    document.body.removeEventListener("keyup",keyHandlerPause,true)
    menuarea.removeChild(menuarea.getElementById("pause_text"));
    timeout = setTimeout("main()",LOOPSPEED); // Start "loop" and input ->
    document.body.addEventListener("keydown",inputKeyDownHandler,true);
    document.body.addEventListener("keyup",inputKeyUpHandler,true);
}

/* Key handler when paused */
function keyHandlerPause(event) {
    if (event.which == 32) {
        continueGame();
        return false;
    } return true;
}
