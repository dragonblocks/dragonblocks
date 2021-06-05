/*
 * menu.js
 * 
 * Copyright 2020 Elias Fleckenstein <eliasfleckenstein@web.de>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */
dragonblocks.Menu = class{
	constructor(){
		let display = document.createElement("div");
		display.id = "dragonblocks.menu";
		display.style.position = "fixed";
		display.style.backgroundColor = "#7E7E7E";
		display.style.width = "500px";
		display.style.height = "10px";
		display.style.visibility = "hidden";
		document.body.appendChild(display);
		display = document.getElementById(display.id);
		dblib.center(display);
		dblib.centerVertical(display);
		dragonblocks.keyHandler.down("Escape", _ => {
			dragonblocks.menu.toggle();
		});
		let headlineContainer = document.createElement("div");
		let headline = headlineContainer.appendChild(document.createElement("h2"));
		headline.innerHTML = "Options";
		headline.align = "center";
		this.addElement(headlineContainer);
	}
	toggle(){
		this.opened ? this.close() : this.open();
	}
	close(){
		this.opened = false;
		dragonblocks.gui.closeLayer();
		dragonblocks.keyHandler.unlockAll();
		document.getElementById("dragonblocks.menu").style.visibility = "hidden";
	}
	open(){
		this.opened = true;
		dragonblocks.gui.showLayer();
		dragonblocks.keyHandler.lockAll();
		dragonblocks.keyHandler.unlock("Escape");
		document.getElementById("dragonblocks.menu").style.visibility = "visible";
	}
	addElement(elem){
		let menu = document.getElementById("dragonblocks.menu");
		elem = menu.appendChild(elem);
		elem.style.position = "absolute";
		elem.style.top = menu.offsetHeight + "px";
		elem.style.width = "80%";
		dblib.center(elem);
		menu.style.height = menu.offsetHeight + 10 + elem.offsetHeight + "px"; 
		dblib.centerVertical(menu);
		return elem;
	}
	addButton(html, func){
		let elem = document.createElement("button");
		elem.innerHTML = html;
		elem.style.fontSize = "20px";
		elem.style.borderRadius = "0%";
		elem.addEventListener("click", event => {
			dragonblocks.menu.close();
			func && func(event);
		});
		this.addElement(elem);
	}
}
dragonblocks.menu = new dragonblocks.Menu();
dragonblocks.menu.addButton("Continue Playing");
dragonblocks.registerOnStarted( _ => {
	dragonblocks.menu.addButton(dragonblocks.loggedin ? "Save and Quit to Title" : "Quit to Title", dragonblocks.quit);
});
dragonblocks.keyHandler.down("F5", _ => {});
