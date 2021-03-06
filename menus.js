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

var playerAmount = 1; // How many players are playing
var mainMenuOn; // If main menu is on or not
var playerSetButtonText = "1 Player";

/* Displays main menu */
function menu(dontClean) {
	var OFFSETX = game_width/17; // Used to move whole menu
	var OFFSETY = 0;
    mainMenuOn = true;
    if (!dontClean) {
        timeout = clearTimeout(timeout);
        clearArea(menuarea);
        clearArea(gamearea);
        bonuses = new Array();
        startGameWithBots();
    }
    createText(game_width/2,160,"Line!","black",fontSize*2); // Title
    createButton(game_width/4+OFFSETX, game_height/4,
		400, 200, "Play", "play"); // Play
	createButton(game_width/3*2+OFFSETX, // Changes amount of players
		game_height/4,400, 100, playerSetButtonText, "plrAmount");
	
	// Write "Player x" texts + keys + set buttons
    var offset = 0;
    for (var i = 0; i < playerAmount; i++) {
        createText(game_width/6+OFFSETX, game_height/2+offset,
			players[i].name, players[i].colour);
		createText(game_width/3+30+OFFSETX, game_height/2+offset,
			getKeyFromCode(players[i].keyL));
		createText(game_width/2+30+OFFSETX, game_height/2+offset, 
			getKeyFromCode(players[i].keyR));
		createButton(game_width/3*2+OFFSETX,game_height/2+offset, 160, 90, 
            "Set", "plr"+(i+1)+"Set");
        offset += 100;
    }
	
	createText(game_width/3+30+OFFSETX, game_height/2-80, "Left");
	createText(game_width/2+30+OFFSETX, game_height/2-80, "Right");
    
    addSpaceHandler(function(){endBotGame();startGame();});
}

/* Displays retry menu, which is showed when all players are dead */
function retryMenu() {
	var retryButton = createButton(game_width/2, game_height/2-150, 400, 200, 
        "Play again", "retry");
	var menuButton = createButton(game_width/2, game_height/2+100, 400, 200,
        "Main Menu", "rtnMenu");
    addSpaceHandler(startGame);
}

/* Pauses the game */
function pauseGame() {
    timeout = clearTimeout(timeout); // Stop the "loop"
    removeInputKeyHandlers(); // Stop input system
    createText(game_width/2,game_height/3,"Press space to continue!");
    createButton(game_width/2,game_height/2,400,200,"Main menu",
        "rtnMenu");
    addSpaceHandler(continueGame);
}

/* Creates button with text and eventListener */
function createButton(x,y,width,height,text,type) {
	var btn = document.createElementNS(NS,"rect");
    btn = elementSetAttributes(btn,{"x":x-width/2, "y":y-height/2, 
        "width":width, "height":height, "fill":"#FFFFFF", "stroke":"black", 
        "stroke-width":2});
    
	var btnText = document.createElementNS(NS,"text");
    btnText = elementSetAttributes(btnText,{"x":x, "y":y+fontSize/4, 
        "font-family":font, "font-size":fontSize, "text-anchor":"middle"});
	btnText.textContent = text;
	
	menuarea.appendChild(btn);
	menuarea.appendChild(btnText);
    
	btn.addEventListener("click", 
        function(e){buttonClick(e,type,btn,btnText)},false);
	btnText.addEventListener("click",
		function(e){buttonClick(e,type,btn,btnText)},false);
	
	btn.addEventListener("mouseover",function(e){buttonHoverOn(e,btn,btnText)},
		false);	// for effects when hovering ->
	btnText.addEventListener("mouseover",
		function(e){buttonHoverOn(e,btn,btnText)},false);	
	btn.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,btnText)},
		false);	
	btnText.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,
		btnText)},false);
    return {"button":btn,"text":btnText}
}

/* Creates text */
function createText(x,y,text,colour,newFontSize,area) {
	var svgText = document.createElementNS(NS,"text");
    svgText = elementSetAttributes(svgText,{"x":x, "y":y, "font-family":font, 
        "font-size":fontSize, "text-anchor":"middle"});
	if (colour) {
		svgText = elementSetAttributes(svgText, {"fill":colour});
	}
	if (newFontSize) {
		svgText = elementSetAttributes(svgText, {"font-size":newFontSize});
	}
	svgText.textContent = text;
	if (area == "points") {
		pointsarea.appendChild(svgText);
	} else {
		menuarea.appendChild(svgText);
	}
    return svgText;
}

/* Changes rect/text to bold when hovering above it */
function buttonHoverOn(e,btn,btnText) {
	btnText.setAttributeNS(null, "font-size", fontSize + 2);
	btn.setAttributeNS(null, "stroke-width", 3);
}

/* Changes rect/text back to normal when no longer hovering above it */
function buttonHoverOff(e,btn,btnText) {
	btnText.setAttributeNS(null, "font-size", fontSize);
	btn.setAttributeNS(null, "stroke-width", 2);
}

/* Checks which button was clicked and handles what should happen */
function buttonClick(e,btnType,btn,btnText) {
	if (btnType == "play") {
        mainMenuOn = false;
        endBotGame();
		startGame();
	} else if (btnType == "plrAmount") {
		clearArea(menuarea);
		playerAmount++;	
		if (playerAmount > PLAYERS) {
			playerAmount = 1;
			playerSetButtonText = "1 Player";
		} else {
			playerSetButtonText = playerAmount + " Players";
		}
		menu(true);
	} else if (btnType == "retry") {
		startGame();
	} else if (btnType == "rtnMenu") {
		menu();
	} 
	
	for (var i = 1; i <= playerAmount; i++) {
		if (btnType == "plr"+i+"Set") {
			setButtons(i);
		}
	}
}

var setButtonsHandler; // Saves event handler
/* Sets buttons for given player (asks and sets) */
function setButtons(playerNum,e,leftOrRight) {
	clearArea(menuarea);
	if (leftOrRight == null) {
		createText(game_width/2,game_height/2, 
			"Press button for left button for player "+playerNum);
        setButtonsHandler = function(event){setButtons(playerNum,event,"left")};
		document.body.addEventListener("keydown",setButtonsHandler,true);
	} else if (leftOrRight == "left") {
		document.body.removeEventListener("keydown",setButtonsHandler,true);
		players[playerNum-1].keyL = e.which;
		createText(game_width/2,game_height/2, 
			"Press button for right button for player "+playerNum);
        setButtonsHandler = function(event){setButtons(playerNum,event,
            "right")};
		document.body.addEventListener("keydown",setButtonsHandler,true);
	} else if (leftOrRight == "right") {
		document.body.removeEventListener("keydown",setButtonsHandler,true);
		players[playerNum-1].keyR = e.which;
		menu();
	}
}

/* Returns readable string for key */
function getKeyFromCode(keycode) {
    if ((keycode >= 48 && keycode <= 58) || (keycode >= 65 && keycode <= 90))
        return String.fromCharCode(keycode); // Alfanumeric keys
    if (keycode == 37) return "Left"; // Arrow keys ->
    if (keycode == 38) return "Up";
    if (keycode == 39) return "Right";
    if (keycode == 40) return "Down";
    if (keycode == 33) return "Page Up"; // Other special keys ->
    if (keycode == 34) return "Page Down";
    if (keycode == 35) return "End";
    if (keycode == 36) return "Home";
    if (keycode == 45) return "Delete";
    if (keycode == 46) return "Delete";
    if (keycode == 16) return "Shift";
    if (keycode == 17) return "Ctrl";
    if (keycode == 18) return "Alt";
    if (keycode == 19) return "Pause";
    if (keycode == 13) return "Enter";
    if (keycode == 8) return "Backspace";
    if (keycode == 188) return ",";
    if (keycode == 190) return ".";
    if (keycode == 109) return "-";
    if (keycode == 61) return "+";
    if (keycode >= 106 && keycode <= 111) 
        return String.fromCharCode(keycode-64);
    if (keycode == 222) return "'";
    if (keycode == 145) return "ScrollLock";
    if (keycode >= 96 && keycode <= 106) // Numpad ->
        return "Numpad "+(String.fromCharCode(keycode-48));
    if (keycode == undefined) return "None"; // Just undefined
    return "BadKey";
}
