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

/* inputLoop replacement for bot players */
function botControl(bot) { // Needs more intelligent AI(s)
    var keypress=m.random();
    if (bot.bot_direction == undefined) bot.bot_direction=0;
    if (bot.bot_intelligence == "idiot") { // Does whatever she wants
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
    } else {
        bot.bot_intelligence=(m.random()>=0.5)?"stupid":"idiot";
        bot.bot_intelligence="stupid";
    }
}
function botInputLeft(old_direction) {
    var new_direction = old_direction+TURNINGSPEED;
    if (new_direction > FULLCIRCLE) return new_direction-FULLCIRCLE;
    else return new_direction;
}
function botInputRight(old_direction) {
    var new_direction = old_direction-TURNINGSPEED;
    if (new_direction < 0) return new_direction+FULLCIRCLE;
    else return new_direction;
}

/* When all bots are dead */
function botGameOver() {
            var lines = game.getElementsByTagName("polyline");
            for (var i = lines.length-1; i >= 0; i--) {
                game.removeChild(lines[0]);
            }
            var circles = game.getElementsByTagName("circle");
            for (var i = circles.length-1; i >= 0; i--) {
                game.removeChild(circles[0]);
            }
            game.removeChild(game.getElementById("gameover_text"));
            timeout = setTimeout("init()",1000);
            return;
}
