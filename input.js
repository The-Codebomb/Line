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

/* Input system */
function inputKeyUp(event) {
    for (i in players) {
        var player = players[i];
        if (event.which == player.keyDown) {
            player.keyDown = false;
            return false;
        } return true;
    }
}
function inputKeyDown(event) {
    for (i in players) {
        var player = players[i];
        if (event.which == player.keyL || event.which == player.keyR) {
            player.keyDown = event.which;
            return false;
        } if (event.which == 87) {
            if (wallMode == "deadly") wallMode = "warp";
            else if (wallMode == "warp") wallMode = "deadly";
            return false;
        } if (event.which == 66) {
            breaksOn = !breaksOn;
            return false;
        } if (event.which == 75) {
            gameOver();
            return false;
        } return true;
    }
}
function inputLoop(player) {
    if (player.keyDown == player.keyL) {
        var new_direction = player.direction+TURNINGSPEED;
        if (new_direction > FULLCIRCLE) 
            player.direction = new_direction-FULLCIRCLE;
        else player.direction = new_direction;
    } else if (player.keyDown == player.keyR) {
        var new_direction = player.direction-TURNINGSPEED;
        if (new_direction < 0)
            player.direction = new_direction+FULLCIRCLE;
        else player.direction = new_direction;
    }
}
