/*
 * inventory_container.js
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
dragonblocks.InventoryContainer = class{
	constructor(obj){
		dblib.copySimple(this, obj);
	}
	draw(parent, x, y){
		if(this.display){
			if(this.getDisplay().parentElement != parent)
				this.remove();
			else{
				this.getDisplay().style.left = x + "px";
				this.getDisplay().style.top = y + "px";
				return false;
			}
		}
		let display = document.createElement("div");
		display.id = "dragonblocks.inventoryContainer[" + this.inventory.id + "]";
		display.style.width = this.calculateWidth() + "px";
		display.style.height = this.calculateHeight() + "px";
		display.style.left = x + "px";
		display.style.top = y + "px";
		display = parent.appendChild(display);
		this.inventory.draw(display, dragonblocks.settings.inventory.scale * 1.1 * this.left, dragonblocks.settings.inventory.scale * 1.1 * this.top);
		this.display = true;
		return true;
	}
	parse(str){
		this.inventory.parse(str);
	}
	stringify(str){
		return this.inventory.stringify();
	}
	addUpdateListener(func){
		this.inventory.addUpdateListener(func);
	}
	remove(){
		dblib.remove(this.getDisplay());
	}
	show(){
		this.getDisplay().style.visibility = "inherit";
		this.update();
	}
	hide(){
		this.getDisplay().style.visibility = "hidden";
	}
	calculateWidth(){
		return this.inventory.calculateWidth() + dragonblocks.settings.inventory.scale * 1.1 * (this.left + this.right);
	}
	calculateHeight(){
		return this.inventory.calculateHeight() + dragonblocks.settings.inventory.scale * 1.1 * (this.top + this.bottom);	
	}
	getDisplay(){
		return document.getElementById("dragonblocks.inventoryContainer[" + this.inventory.id + "]");
	}
	update(){
		this.inventory.update();
	}
}
