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

/* Starts the game with bots */
function startGameWithBots() {
    for (var i = 0; i < players.length; i++) { // Setting up players
        players[i] = new line("player"+(i+1),players[i].colour,players[i].keyL,
            players[i].keyR,true);
        var x = m.floor(m.random()*(game_width-200)+100);
        var y = m.floor(m.random()*(game_height-200)+100);
        players[i].addPoint(x,y,false); // Add starting point
    }
    timeout = setTimeout("main(true)",LOOPSPEED); // Start "loop"
}

/* inputLoop replacement for bot players */
function botControl(bot) { // Needs more intelligent AI(s)
    var keypress=m.random();
    if (bot.bot_intelligence == "idiot") { // Does whatever she wants
        if (bot.bot_direction == undefined) bot.bot_direction=0;
        if ((bot.bot_direction > 0 && bot.bot_direction < 10) 
                || keypress < 0.4) {
            bot.bot_direction++;
            bot.direction = botInputLeft(bot.direction);
        } else if ((bot.bot_direction < 0 && bot.bot_direction > -10) 
                || keypress > 0.6) {
            bot.bot_direction--;
            bot.direction = botInputRight(bot.direction);
        }
        if (bot.bot_direction >= 10 || bot.bot_direction <= -10) 
            bot.bot_direction=0;
    } else if (bot.bot_intelligence == "stupid") { // Has (?) some intelligence
        if (bot.bot_direction == undefined) bot.bot_direction=0;
        if (bot.bot_phase == undefined) bot.bot_phase=0;
        if ((!bot.bot_wallZone) && ((bot.x < 50) || (bot.x > 750) || 
                (bot.y < 50) || (bot.y > 550))) {
            bot.bot_direction = -10;
            bot.bot_wallZone=true;
        } else if ((bot.x > 50) && (bot.x < 750) && 
            (bot.y > 50) && (bot.y < 550)) bot.bot_wallZone=false;
        if (bot.bot_phase == 0) {
            bot.bot_direction++;
            bot.direction = botInputLeft(bot.direction);
            if (bot.bot_direction > 20) { 
                bot.bot_phase=1;
                bot.bot_direction=0;
            }
        } else {
            bot.bot_direction++;
            bot.direction = botInputRight(bot.direction);
            if (bot.bot_direction > 20) { 
                bot.bot_phase=0;
                bot.bot_direction=0;
            }
        }
    } else if (bot.bot_intelligence == "abitsmart") { // Regonizes obstacles
        if (bot.bot_phase == undefined) bot.bot_phase=0;
        if (bot.bot_phase == 0) { // Straight forward
            // check for future collision and change phase according to that
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 30*m.sin(bot.direction);
            var by = ay + 30*m.cos(bot.direction);
            if (checkForCollision(bx,by,ax,ay,bot,true)) {
                bx = ax + 60*m.sin(bot.direction+m.PI/4);
                by = ay + 60*m.cos(bot.direction+m.PI/4);
                if (checkForCollision(bx,by,ax,ay,bot,true))
                    bot.bot_phase = 2;
                else bot.bot_phase = 1;
            }
        } else if (bot.bot_phase == 1) { // Turn left
            bot.direction = botInputLeft(bot.direction);
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 50*m.sin(bot.direction);
            var by = ay + 50*m.cos(bot.direction);
            if (!checkForCollision(bx,by,ax,ay,bot,true))
                bot.bot_phase = 0;
        } else if (bot.bot_phase == 2) { // Turn right
            bot.direction = botInputRight(bot.direction);
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 50*m.sin(bot.direction);
            var by = ay + 50*m.cos(bot.direction);
            if (!checkForCollision(bx,by,ax,ay,bot,true))
                bot.bot_phase = 0;
        }
    } else if (bot.bot_intelligence == "cheater") { // What do you think
        if (bot.bot_phase == undefined) bot.bot_phase=0; // she does?
        if (bot.bot_phase == 0) { // Straight forward
            // check for future collision and change phase according to that
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 30*m.sin(bot.direction);
            var by = ay + 30*m.cos(bot.direction);
            if (checkForCollision(bx,by,ax,ay,bot,true)) {
                bx = ax + 30*m.sin(bot.direction+m.PI/2);
                by = ay + 30*m.cos(bot.direction+m.PI/2);
                if (checkForCollision(bx,by,ax,ay,bot,true))
                    bot.bot_phase = 1;
                else bot.bot_phase = 2;
            }
        } else if (bot.bot_phase == 1) { // Turn left
            bot.direction = botInputLeft(bot.direction,m.PI/2);
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 30*m.sin(bot.direction);
            var by = ay + 30*m.cos(bot.direction);
            if (!checkForCollision(bx,by,ax,ay,bot,true))
                bot.bot_phase = 0;
        } else if (bot.bot_phase == 2) { // Turn right
            bot.direction = botInputRight(bot.direction,m.PI/2);
            var ax = bot.x;
            var ay = bot.y;
            var bx = ax + 30*m.sin(bot.direction);
            var by = ay + 30*m.cos(bot.direction);
            if (!checkForCollision(bx,by,ax,ay,bot,true))
                bot.bot_phase = 0;
        }
    } else {
        var rnd = m.random();
        if (rnd <= 0.20) bot.bot_intelligence = "stupid";
        else if (rnd <= 0.50) bot.bot_intelligence = "idiot";
        else bot.bot_intelligence = "abitsmart";
    }
}
function botInputLeft(old_direction,turn) {
    if (turn == null) var new_direction = old_direction+TURNINGSPEED;
    else var new_direction = old_direction+turn;
    if (new_direction > FULLCIRCLE) return new_direction-FULLCIRCLE;
    else return new_direction;
}
function botInputRight(old_direction,turn) {
    if (turn == null) var new_direction = old_direction-TURNINGSPEED;
    else var new_direction = old_direction-turn
    if (new_direction < 0) return new_direction+FULLCIRCLE;
    else return new_direction;
}

/* When all bots are dead */
function botGameOver() {
    timeout = clearTimeout(timeout);
    var lines = gamearea.getElementsByTagName("polyline");
    for (var i = lines.length-1; i >= 0; i--) {
        gamearea.removeChild(lines[0]);
    }
    var circles = gamearea.getElementsByTagName("circle");
    for (var i = circles.length-1; i >= 0; i--) {
        gamearea.removeChild(circles[0]);
    }
    timeout = setTimeout("startGameWithBots()",1000);
}

/* Force ending bot game */
function endBotGame() {
    timeout = clearTimeout(timeout);
    var lines = gamearea.getElementsByTagName("polyline");
    for (var i = lines.length-1; i >= 0; i--) {
        gamearea.removeChild(lines[0]);
    }
    var circles = gamearea.getElementsByTagName("circle");
    for (var i = circles.length-1; i >= 0; i--) {
        gamearea.removeChild(circles[0]);
    }
    bonuses = new Array();
}
