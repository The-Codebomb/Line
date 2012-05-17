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

/* Begins the game with bots */
function startGameWithBots() {
    for (var i in players) { // Setting up players ->
        players[i] = new line(players[i].name,players[i].colour,players[i].keyL,
            players[i].keyR,true);
    }
    points_to_end = 10*(PLAYERS-1);
    newPointsDisplay();
    startNewRoundWithBots();
}

/* Begins new round with bots */
function startNewRoundWithBots() {
    clearGround(); // In menus.js
    timeout = clearTimeout(timeout);
    for (var i in players) { // Setting up players ->
        players[i].splitLine();
        var x = m.floor(m.random()*(game_width-200)+100);
        var y = m.floor(m.random()*(game_height-200)+100);
        players[i].alive = true;
        players[i].addPoint(x,y,false); // Add starting point
        gamearea.appendChild(players[i].circle); // FIXME?
    }
    wallMode = "deadly";
    timeout = setTimeout("main(true)",LOOPSPEED); // Start "loop"
}

/* inputLoop replacement for bot players */
function botControl(bot) { // Needs an intelligent AI
    /*
     * Idiot bot that uses random values to decide where to go
     * This one is used because it's the least annoying
     */
    var keypress=m.random();
    if (keypress < 0.3) {
        botInputLeft(bot);
    } else if (keypress > 0.7) {
        botInputRight(bot);
    }
}
function botInputLeft(bot) {
    if (bot.sharpTurns) var new_direction = bot.direction+m.PI/2;
    else var new_direction = bot.direction+TURNINGSPEED;
    if (new_direction > FULLCIRCLE) bot.direction = new_direction-FULLCIRCLE;
    else bot.direction = new_direction;
}
function botInputRight(bot) {
    if (bot.sharpTurns) var new_direction = bot.direction-m.PI/2;
    else var new_direction = bot.direction-TURNINGSPEED;
    if (new_direction < 0) bot.direction = new_direction+FULLCIRCLE;
    else bot.direction = new_direction;
}

/* Ends a bot round */
/*
 * Called when all bots are dead
 */
function botRoundOver() {
    timeout = setTimeout("startNewRoundWithBots()",1000);
}

/* Ends a bot game */
/* 
 * Called when bots finish playing
 */
function botGameOver() {
    timeout = setTimeout("startGameWithBots()",1000);
}

/* Forces ending a bot game */
/*
 * Called when starting real game from main menu
 */
function endBotGame() {
    timeout = clearTimeout(timeout);
    clearGround(); // In menus.js
}
