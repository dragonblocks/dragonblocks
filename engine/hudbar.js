/*
 * hudbar.js
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
dragonblocks.Hudbar = class{
	constructor(inventory, slots){
		this.id = dragonblocks.getToken();
		this.inventory = inventory;
		this.slots = slots;
		this.selectedSlot = 0;
		let display = document.createElement("div");
		display.id = "dragonblocks.hudbar[" + this.id + "]";
		display.style.position = "fixed";
		display.style.bottom = "5px";
		display.style.height = "60px";
		display.style.width = "445px";
		for(let i = 0; i < this.slots; i++){
			let slotDisplay = document.createElement("div");
			slotDisplay.id = "dragonblocks.hudbar[" + this.id + "].slot[" + i + "]";
			slotDisplay.style.position = "absolute";
			slotDisplay.style.top = "3px";
			slotDisplay.style.left = i * 53 + "px";
			slotDisplay.style.width = "50px";
			slotDisplay.style.height = "50px";
			slotDisplay.style.backgroundColor = "black";
			slotDisplay.style.boxShadow = "0 0 0 3px #C5C5C5";
			let slotCountDisplay = document.createElement("span");
			slotCountDisplay.id = slotDisplay.id + ".count";
			slotCountDisplay.style.position = "absolute";
			slotCountDisplay.style.right = "5px";
			slotCountDisplay.style.bottom = "5px";
			slotCountDisplay.style.color = "white";
			slotDisplay.appendChild(slotCountDisplay);
			display.appendChild(slotDisplay);
		}
		let selectorDisplay = document.createElement("div");
		selectorDisplay.id = "dragonblocks.hudbar[" + this.id + "].selector";
		selectorDisplay.style.position = "absolute";
		selectorDisplay.style.top = "3px";
		selectorDisplay.style.width = "50px";
		selectorDisplay.style.height = "50px";
		selectorDisplay.style.boxShadow = "0 0 0 5px #999999";
		display.appendChild(selectorDisplay);
		let itemnameDisplay = document.createElement("span");
		itemnameDisplay.id = "dragonblocks.hudbar[" + this.id + "].itemname";
		itemnameDisplay.style.position = "absolute";
		itemnameDisplay.style.bottom = "60px";
		itemnameDisplay.style.color = "white";
		itemnameDisplay.style.fontSize = "20px";
		display.appendChild(itemnameDisplay);
		display = document.body.insertBefore(display, document.getElementById("dragonblocks.map").nextSibling);
		dblib.center(display);
		this.update();
	}
	nextItem(){
		(this.selectedSlot++ == 7) && (this.selectedSlot = 0);
		this.update();
	}
	previousItem(){
		(this.selectedSlot-- == 0) && (this.selectedSlot = 7);
		this.update();
	}
	select(i){
		this.selectedSlot = i;
		this.update();
	}
	update(){
		let display = document.getElementById("dragonblocks.hudbar[" + this.id + "]");
		if(! display)
			return;
		for(let i = 0; i < this.slots; i++){
			let itemstack = this.inventory.getSlot(i);
			let slotDisplay = document.getElementById("dragonblocks.hudbar[" + this.id + "].slot[" + i + "]");
			slotDisplay.style.background = itemstack.item ? dragonblocks.getTexture(itemstack.toItem().texture) : "black";
			slotDisplay.style.backgroundSize = "cover";
			slotDisplay.style.opacity = itemstack.item ? 1 : 0.3;
			document.getElementById(slotDisplay.id + ".count").innerHTML = (itemstack.count <= 1) ? "" : itemstack.count;
			if(i == this.selectedSlot){
				document.getElementById("dragonblocks.hudbar[" + this.id + "].selector").style.left = slotDisplay.style.left;
				document.getElementById("dragonblocks.hudbar[" + this.id + "].itemname").innerHTML = itemstack.item ? itemstack.toItem().desc : "";
				dblib.center(document.getElementById("dragonblocks.hudbar[" + this.id + "].itemname"));
			}
		}
	}
	getSelectedItem(){
		return this.inventory.getSlot(this.selectedSlot);
	}
} 
