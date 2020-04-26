/*
 * inventory_group.js
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
dragonblocks.InventoryGroup = class{
	constructor(){
		this.id = dragonblocks.getToken();
		this._elements = [];
		this.opened = false;
		var display = document.createElement("div");
		display.id = "dragonblocks.inventoryGroup[" + this.id + "]";
		display.style.position = "fixed";
		display.style.backgroundColor = "#535353";
		display.style.visibility = "hidden";
		dragonblocks.Inventory.insertElement(display);
	}
	close(){
		this.opened = false;
		document.getElementById("dragonblocks.inventoryGroup[" + this.id + "]").style.visibility = "hidden";
		dragonblocks.Inventory.getStackDisplay(dragonblocks.Inventory.out.id).style.visibility = "hidden";
		if(this.onNextClose)
			this.onNextClose();
		this.onNextInventoryClose = null;
	}
	open(){
		this.opened = true;
		document.getElementById("dragonblocks.inventoryGroup[" + this.id + "]").style.visibility = "visible";
		dragonblocks.Inventory.getStackDisplay(dragonblocks.Inventory.out.id).style.visibility = "visible";
	}
	toggle(){
		this.opened ? this.close() : this.open();
	}
	set elements(elements){
		for(let element of this.elements)
			element.hide();
		this._elements = elements;
		let height = 0;
		let width = 0;
		let container = document.getElementById("dragonblocks.inventoryGroup[" + this.id + "]");
		for(let element of this.elements){
			element.draw(container, 0, height);
			height += element.calculateHeight();
			width = Math.max(width, element.calculateWidth());
			element.show();
		}
		container.style.width = width + "px"; 
		container.style.height = height + "px";
		dblib.center(container);
		dblib.centerVertical(container);
	}
	get elements(){
		return this._elements;
	}
} 
