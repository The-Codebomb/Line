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
var playerAmount = 1;

/* Creates menu buttons etc. */
function menu() {
    mainMenuOn = true;
    timeout = clearTimeout(timeout);
    clearGround();
    startGameWithBots();
    var playButton = createButton(game_width/4-100, game_height/4-50, 200, 
        100, "Play", "play");
	var playersButton = createButton(game_width/3*2-100, game_height/4-25, 
        200, 50, "1 Player", "plrAmount");
	// Button setting functios
	var player1Set = createButton(game_width/3*2, game_height/2-25, 80, 50, 
        "Set", "plr1Set");
	var player2Set = createButton(game_width/3*2, game_height/2+35, 80, 50, 
        "Set", "plr2Set");
	var player3Set = createButton(game_width/3*2, game_height/2+95, 80, 50, 
        "Set", "plr3Set");
	var player4Set = createButton(game_width/3*2, game_height/2+155, 80, 50, 
        "Set", "plr4Set");
	
	createText(game_width/6, game_height/2 , "Player 1");
	createText(game_width/6, game_height/2+60, "Player 2");
	createText(game_width/6, game_height/2+120, "Player 3");
	createText(game_width/6, game_height/2+180, "Player 4");
	
	createText(game_width/3+30, game_height/2-45, "Left");
	createText(game_width/2+30, game_height/2-45, "Right");
	
	createText(game_width/3+30, game_height/2, 
        getKeyFromCode(players[0].keyL));
	createText(game_width/3+30, game_height/2+60, 
        getKeyFromCode(players[1].keyL));
	createText(game_width/3+30, game_height/2+120, 
        getKeyFromCode(players[2].keyL));
	createText(game_width/3+30, game_height/2+180, 
        getKeyFromCode(players[3].keyL));
	
	createText(game_width/2+30, game_height/2, 
        getKeyFromCode(players[0].keyR));
	createText(game_width/2+30, game_height/2+60, 
        getKeyFromCode(players[1].keyR));
	createText(game_width/2+30, game_height/2+120, 
        getKeyFromCode(players[2].keyR));
	createText(game_width/2+30, game_height/2+180, 
        getKeyFromCode(players[3].keyR));
}

/* Retry menu, which is showed when all players are dead */
function retryMenu() {
	var retryButton = createButton(game_width/2-100, game_height/2-125, 200, 
        100, "Play again", "retry");
	var menuButton = createButton(game_width/2-100, game_height/2+25, 200, 100, 
        "Main Menu", "rtnMenu");
}

/* Create button with text and eventlistener */
function createButton(x,y,width,height,text,type) {
	var btn = document.createElementNS(NS,"rect");
    btn = elementSetAttributes(btn,{"x":x, "y":y, "width":width, 
        "height":height, "fill":"#FFFFFF", "stroke":"black", 
        "stroke-width":2});
    
	var btnText = document.createElementNS(NS,"text");
    btnText = elementSetAttributes(btnText,{"x":x+width/2, 
        "y":y+height/2+fontSize/4, "font-family":font, "font-size":fontSize, 
        "text-anchor":"middle"});
	btnText.textContent = text;
	
	menuarea.appendChild(btn);
	menuarea.appendChild(btnText);
    
	btn.addEventListener("click", // two listeners, fix this
        function(e){buttonClick(e,type,btn,btnText)},false);
	btnText.addEventListener("click",
		function(e){buttonClick(e,type,btn,btnText)},false);
	
	btn.addEventListener("mouseover",function(e){buttonHoverOn(e,btn,btnText)},
		false);	// for effects when hovering
	btnText.addEventListener("mouseover",
		function(e){buttonHoverOn(e,btn,btnText)},false);	
	btn.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,btnText)},
		false);	
	btnText.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,
		btnText)},false);
    return {"button":btn,"text":btnText}
}

/* Create new text */
function createText(x,y,text) {
	var svgText = document.createElementNS(NS,"text");
    svgText = elementSetAttributes(svgText,{"x":x, "y":y, "font-family":font, 
        "font-size":fontSize, "text-anchor":"middle"});
	svgText.textContent = text;
	menuarea.appendChild(svgText);
    return svgText;
}

/* Changes rect/text settings back to "bold" when hovering above it */
function buttonHoverOn(e,btn,btnText) {
	btnText.setAttributeNS(null, "font-size", fontSize + 2);
	btn.setAttributeNS(null, "stroke-width", 3);
}

/* Changes rect/text settings back to normal when not hovering above it */
function buttonHoverOff(e,btn,btnText) {
	btnText.setAttributeNS(null, "font-size", fontSize);
	btn.setAttributeNS(null, "stroke-width", 2);
}

/* Checks which button was clicked, and handles what should happen */
function buttonClick(e,btnType,btn,btnText) {
	if (btnType == "play") {
        endBotGame();
		clearGround();
		removeButtons();
		startGame();
	} else if (btnType == "plrAmount") {
		playerAmount++;
		if (playerAmount == 2) {
			btnText.textContent = "2 Players";
		} else if (playerAmount == 3) {
			btnText.textContent = "3 Players";
		} else if (playerAmount == 4) {
			btnText.textContent = "4 Players";
		} else if (playerAmount == 5) {
			playerAmount = 1;
			btnText.textContent = "1 Player";
		}
	} else if (btnType == "retry") {
        clearGround();
		removeButtons();
		startGame();
	} else if (btnType == "rtnMenu") {
		removeButtons();
		playerAmount = 1;
		menu();
	} else if (btnType == "plr1Set") {
		setButtons(0);
	} else if (btnType == "plr2Set") {
		setButtons(1);
	} else if (btnType == "plr3Set") {
		setButtons(2);
	} else if (btnType == "plr4Set") {
		setButtons(3);
	}
}

/* removes ALL polylines and circles from the screen */
function clearGround() {
	var lines = gamearea.getElementsByTagName("polyline");
	for (i = lines.length - 1; i >= 0;i--) {
		gamearea.removeChild(lines[i]);
	}
			
	var circles = gamearea.getElementsByTagName("circle");
	for (i = circles.length - 1; i >= 0;i--) {
		gamearea.removeChild(circles[i]);
	}
}

/* Removes ALL buttons from the screen (and rects and texts) */
function removeButtons() {
	var rects = menuarea.getElementsByTagName("rect");	// Remove box buttons
	for (var i = rects.length - 1; i >= 0;i--) {
		menuarea.removeChild(rects[i]);
	}		
	var texts = menuarea.getElementsByTagName("text");	// Remove texts
	for (var i = texts.length - 1; i >= 0;i--) {
		menuarea.removeChild(texts[i]);
	}
}

var setButtonsHandler; // Saves event handler
/* Sets buttons for given player (asks and sets) */
function setButtons(playerNum,e,leftOrRight) {
	removeButtons();
	if (leftOrRight == null) {
		createText(game_width/2,game_height/2, 
			"Press button for left button for player "+(playerNum+1));
        setButtonsHandler = function(event){setButtons(playerNum,event,"left")}
		document.body.addEventListener("keydown",setButtonsHandler,true);
	} else if (leftOrRight == "left") {
		document.body.removeEventListener("keydown",setButtonsHandler,true);
		players[playerNum].keyL = e.which;
		createText(game_width/2,game_height/2, 
			"Press button for right button for player "+(playerNum+1));
        setButtonsHandler = function(event){setButtons(playerNum,event,
            "right")}
		document.body.addEventListener("keydown",setButtonsHandler,true);
	} else if (leftOrRight == "right") {
		document.body.removeEventListener("keydown",setButtonsHandler,true);
		players[playerNum].keyR = e.which;
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
    return "BadKey";
}
