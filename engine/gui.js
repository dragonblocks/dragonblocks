/*
 * gui.js
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
dragonblocks.gui = {};
dragonblocks.gui.toggleLayer = function(){
	dragonblocks.gui.layerShown ? dragonblocks.gui.hideLayer() : dragonblocks.gui.showLayer();
}
dragonblocks.gui.showLayer = dragonblocks.gui.openLayer = function(){
	dragonblocks.gui.layerShown = true;
	document.getElementById("dragonblocks.gui.layer").style.visibility = "visible";
}
dragonblocks.gui.hideLayer = dragonblocks.gui.closeLayer = function(){
	dragonblocks.gui.layerShown = false;
	document.getElementById("dragonblocks.gui.layer").style.visibility = "hidden";	
}
{
	let layer = document.createElement("div");
	layer.id = "dragonblocks.gui.layer";
	layer.style.opacity = 0.7;
	layer.style.position = "fixed";
	layer.style.width = "100%";
	layer.style.height = "100%";
	layer.style.top = "0px";
	layer.style.left = "0px";
	layer.style.backgroundColor = "black";
	layer.style.visibility = "hidden";
	document.body.appendChild(layer);
}
dragonblocks.gui.Box = class{
	constructor(properties){
		this.moveable = false;
		this.closeable = true;
		this.size = "big";
		this.layer = true;
		this.scroll = true;
		this.keylock = false;
		if(properties)
			dblib.copy(this, properties);
		let self = this;
		this.id = "dragonblocks.gui.box[" + dragonblocks.getToken() + "]";
		this.x = 0;
		this.y = 0;
		this.dragging = false;
		let display = document.createElement("div");
		display.id = this.id;
		display.style.width = "500px";
		display.style.height = "300px";
		if(this.size == "big"){
			display.style.width = "700px";
			display.style.height = "500px";
		}
		display.style.position = "fixed";
		display.style.backgroundColor = "#7E7E7E";
		display.style.visibility = "hidden";
		if(this.scroll)
			display.style.overflowY = "scroll";
		let moveField = document.createElement("div");
		moveField.id = this.id + ".moveField";
		moveField.style.position = "absolute";
		moveField.style.left = "0px";
		moveField.style.top = "0px";
		moveField.style.width = "30px";
		moveField.style.height = "30px";
		if(this.size == "big"){
			moveField.style.width = "50px";
			moveField.style.height = "50px";
		}
		moveField.style.background = dragonblocks.getTexture("move.png");
		moveField.style.backgroundSize = "cover"
		moveField.style.cursor = "move";
		if(this.moveable)
			display.appendChild(moveField);
		let closeField = document.createElement("div");
		closeField.id = this.id + ".closeField";
		closeField.style.position = "absolute";
		closeField.style.right = "0px";
		closeField.style.top = "0px";
		closeField.style.width = "30px";
		closeField.style.height = "30px";
		if(this.size == "big"){
			closeField.style.width = "50px";
			closeField.style.height = "50px";
		}
		closeField.style.background = dragonblocks.getTexture("close.png");
		closeField.style.backgroundSize = "cover";
		closeField.style.cursor = "pointer";
		closeField.addEventListener("mousedown", _ => {
			self.close();
		});
		if(this.closeable)
			display.appendChild(closeField);
		display.addEventListener("mousedown", event => {
			if(event.srcElement.id != moveField.id)
				return;
			self.x = event.clientX;
			self.y = event.clientY;
			self.dragging = true;
		});
		display.addEventListener("mousemove", event => {
			if(! self.dragging)
				return;
			let display = self.getDisplay();
			let posX = self.x - event.clientX;
			let posY = self.y - event.clientY;
			self.x = event.clientX;
			self.y = event.clientY;
			display.style.left = display.offsetLeft - posX + "px";
			display.style.top = display.offsetTop - posY + "px";
		});
		addEventListener("mouseup", event => {
			self.dragging = false;
		});
		document.body.appendChild(display);
		dblib.center(this.getDisplay());
		dblib.centerVertical(this.getDisplay());
	}
	getDisplay(){
		return document.getElementById(this.id);
	}
	setContent(html){
		this.getDisplay().innerHTML = html;
	}
	open(){
		this.getDisplay().style.visibility = "visible";
		if(this.layer)
			dragonblocks.gui.openLayer();
		if(this.keylock)
			dragonblocks.keyHandler.lockAll();
		this.onopen && this.onopen();
	}
	close(){
		this.getDisplay().style.visibility = "hidden";
		if(this.layer)
			dragonblocks.gui.closeLayer();
		if(this.keylock)
			dragonblocks.keyHandler.unlockAll();
		this.onclose && this.onclose();
	}
	add(elem){
		return this.getDisplay().appendChild(elem);
	}
	create(elementname){
		return this.add(document.createElement(elementname));
	}
}
dragonblocks.gui.createBox = function(properties){
	return new dragonblocks.gui.Box(properties);
}
