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

/* Creates menu buttons etc. */
function menu() {
	// Needed atm for proper buttons! PLEASE REMOVE THESE
	var playBtn, playBtnT; // Why are these needed at all?
	var plrBtn, plrBtnT;
	var plr1Set, plr1SetT;
	var plr2Set, plr2SetT;
	var plr3Set, plr3SetT;
	var plr4Set, plr4SetT;
	var plr1Left, plr1Right;
	var plr2Left, plr2Right;
	var plr3Left, plr3Right;
	var plr4Left, plr4Right; // Why is any of these needed?
	var nullHolder; // Can be used to make not-changing text/button;
	createButton(WIDTH/4-100, HEIGHT/4-50, 200, 100, "Play", "play", playBtn,
		playBtnT);
	createButton(WIDTH/3*2-100, HEIGHT/4-25, 200, 50, "1 Player",
		"plrAmount",plrBtn, plrBtnT);
	// Button setting functios
	createButton(WIDTH/3*2, HEIGHT/2-25, 80, 50, "Set", "plr1Set", plr1Set, 
        plr1SetT);
	createButton(WIDTH/3*2, HEIGHT/2+35, 80, 50, "Set", "plr2Set", plr2Set, 
        plr2SetT);
	createButton(WIDTH/3*2, HEIGHT/2+95, 80, 50, "Set", "plr3Set", plr3Set, 
        plr3SetT);
	createButton(WIDTH/3*2, HEIGHT/2+155, 80, 50, "Set", "plr4Set", plr4Set,
        plr4SetT);
	
	createText(WIDTH/6, HEIGHT/2 , "Player 1", nullHolder);
	createText(WIDTH/6, HEIGHT/2+60, "Player 2", nullHolder);
	createText(WIDTH/6, HEIGHT/2+120, "Player 3", nullHolder);
	createText(WIDTH/6, HEIGHT/2+180, "Player 4", nullHolder);
	
	createText(WIDTH/3+30, HEIGHT/2-45, "Left", nullHolder);
	createText(WIDTH/2+30, HEIGHT/2-45, "Right", nullHolder);
	
	createText(WIDTH/3+30, HEIGHT/2, String.fromCharCode(pl1btnL), nullHolder);
	createText(WIDTH/3+30, HEIGHT/2+60, String.fromCharCode(pl2btnL), 
        nullHolder);
	createText(WIDTH/3+30, HEIGHT/2+120, String.fromCharCode(pl3btnL), 
        nullHolder);
	createText(WIDTH/3+30, HEIGHT/2+180, String.fromCharCode(pl4btnL), 
        nullHolder);
	
	createText(WIDTH/2+30, HEIGHT/2, String.fromCharCode(pl1btnR), nullHolder);
	createText(WIDTH/2+30, HEIGHT/2+60, String.fromCharCode(pl2btnR), 
        nullHolder);
	createText(WIDTH/2+30, HEIGHT/2+120, String.fromCharCode(pl3btnR), 
        nullHolder);
	createText(WIDTH/2+30, HEIGHT/2+180, String.fromCharCode(pl4btnR), 
        nullHolder);
}

/* Retry menu, which is showed when all players are dead */
function retryMenu() {
	var retryBtn, retryBtnT;
	var menuBtn, menuBtnT;
	createButton(WIDTH/2-100, HEIGHT/2-125, 200, 100, "Play again", "retry",
		retryBtn, retryBtnT);
	createButton(WIDTH/2-100, HEIGHT/2+25, 200, 100, "Main Menu", "rtnMenu",
		menuBtn, menuBtnT);
}

/* Create button with text and eventlistener */
function createButton(x,y,width,height,text,btnType,btn,btnText) {
	btn = document.createElementNS(NS,"rect");
	btn.setAttributeNS(null, "x", x);
	btn.setAttributeNS(null, "y", y);
	btn.setAttributeNS(null, "width", width);
	btn.setAttributeNS(null, "height", height);
	btn.setAttributeNS(null, "fill", "#FFFFFF");
	btn.setAttributeNS(null, "stroke", "black");
	btn.setAttributeNS(null, "stroke-width", 2);
    
	btnText = document.createElementNS(NS,"text");
	btnText.setAttributeNS(null, "x", x + width / 2);
	btnText.setAttributeNS(null, "y", y + height / 2 + fontSize / 4);
	btnText.setAttributeNS(null, "font-family", font);
	btnText.setAttributeNS(null, "font-size", fontSize);
	btnText.textContent = text;	// Can screw up in other browsers than FF
	btnText.setAttributeNS(null, "text-anchor", "middle");
	
	game.appendChild(btn);
	game.appendChild(btnText);
    
	btn.addEventListener("click", // two listeners, fix this
        function(e){buttonClick(e,btnType,btn,btnText)},false);
	btnText.addEventListener("click",
		function(e){buttonClick(e,btnType,btn,btnText)},false);
	
	btn.addEventListener("mouseover",function(e){buttonHoverOn(e,btn,btnText)},
		false);	// for effects when hovering
	btnText.addEventListener("mouseover",
		function(e){buttonHoverOn(e,btn,btnText)},false);	
	btn.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,btnText)},
		false);	
	btnText.addEventListener("mouseout",function(e){buttonHoverOff(e,btn,
		btnText)},false);
}

/* Create new text */
function createText(x,y,text,writenText) {
	writenText = document.createElementNS(NS,"text");
	writenText.setAttributeNS(null, "x", x);
	writenText.setAttributeNS(null, "y", y + fontSize / 4);
	writenText.setAttributeNS(null, "font-family", font);
	writenText.setAttributeNS(null, "font-size", fontSize);
	writenText.textContent = text;	//Can screw up in other browsers than FF.
	writenText.setAttributeNS(null, "text-anchor", "middle");
	game.appendChild(writenText);
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
	if (btnType == "play") {/*
		if (player1) {		// CHANGE FOR MANY PLAYERS!
			clearGround();
		}*/
		removeBtns();
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
	} else if (btnType == "retry") {/*
		if (player1) {		// CHANGE FOR MANY PLAYERS!
			clearGround();
		}*/
		removeBtns();
		startGame();
	} else if (btnType == "rtnMenu") {
		removeBtns();
		playerAmount = 1;
		menu();
	} else if (btnType == "plr1Set") {
		removeBtns();
		setButtons(1);
	} else if (btnType == "plr2Set") {
		removeBtns();
		setButtons(2);
	} else if (btnType == "plr3Set") {
		removeBtns();
		setButtons(3);
	} else if (btnType == "plr4Set") {
		removeBtns();
		setButtons(4);
	}
	
}

/* ??? */
function clearGround() {
	var lines = game.getElementsByTagName("polyline");
	for (i = lines.length - 1; i >= 0;i--) {
		game.removeChild(lines[i]);
	}
			
	var circles = game.getElementsByTagName("circle");
	for (i = circles.length - 1; i >= 0;i--) {
		game.removeChild(circles[i]);
	}
}

/* ??? */
function removeBtns() {
	var rects = game.getElementsByTagName("rect");	// Remove box buttons
	// Keep the first rect, which is border
	for (var i = rects.length - 1; i >= 1;i--) {
		game.removeChild(rects[i]);
	}		
	var texts = game.getElementsByTagName("text");	// Remove texts
	for (var i = texts.length - 1; i >= 0;i--) {
		game.removeChild(texts[i]);
	}
}

/* ??? */
function setButtons(playerNum) {
	// Asking for buttons here
	menu();
}
