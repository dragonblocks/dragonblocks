/*
 * creative_inventory.js
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
dragonblocks.CreativeInventory = class extends dragonblocks.Inventory{
	constructor(slots, list, columns){
		super(slots, columns);
		this.fullList = list || this.list;
		this.page = 0;
		this.pages = Math.ceil(this.fullList.length / this.list.length);
		let inventory = this;
		for(let i = 0; i < this.slots; i++){
			i = parseInt(i);
			this.list[i].addUpdateListener(_ => {
				if(inventory.list[i].refilling)
					return;
				inventory.list[i].refilling = true;
				inventory.list[i].parse(inventory.fullList[inventory.slots * inventory.page + i] || "");
				inventory.list[i].refilling = false;
			});
		}
	}
	calculateHeight(){
		return super.calculateHeight() + dragonblocks.settings.inventory.scale;
	}
	draw(parent, x, y){
		if (!super.draw(parent, x, y))
			return false;
		let inventory = this;
		this.getDisplay().style.height = this.calculateHeight();
		let creativeDisplay = document.createElement("div");
		creativeDisplay.id = "dragonblocks.inventory[" + this.id + "].creative";
		creativeDisplay.style.height = dragonblocks.settings.inventory.scale + "px";
		creativeDisplay.style.width = this.calculateWidth();
		creativeDisplay.style.left = "0px";
		creativeDisplay.style.top = super.calculateHeight() + "px";
		creativeDisplay.style.position = "absolute";
		this.getDisplay().appendChild(creativeDisplay);
		creativeDisplay = document.getElementById(creativeDisplay.id);
		let pageDisplay = document.createElement("span");
		pageDisplay.id = "dragonblocks.inventory[" + this.id + "].creative.page";
		pageDisplay.style.color = "343434";
		pageDisplay.style.position = "absolute";
		pageDisplay.style.left = dragonblocks.settings.inventory.scale * 1.1 + "px";
		pageDisplay.style.width = "100%";
		pageDisplay.style.fontSize = dragonblocks.settings.inventory.scale / (5/3) + "px";
		pageDisplay.style.height = dragonblocks.settings.inventory.scale / (5/3) + "px";
		creativeDisplay.appendChild(pageDisplay);
		dblib.centerVertical(document.getElementById(pageDisplay.id));
		for(let dir of ["left", "right"]){
			let arrow = document.createElement("div");
			arrow.id = "dragonblocks.inventory[" + this.id + "].creative.arrow." + dir;
			arrow.style.position = "absolute";
			arrow.style.width = dragonblocks.settings.inventory.scale + "px";
			arrow.style.height = dragonblocks.settings.inventory.scale + "px";
			arrow.style.position = "absolute";
			arrow.style[dir] = "0px";
			arrow.style.background = dragonblocks.getTexture("arrow.png");
			arrow.style.backgroundSize = "cover";
			arrow.style.cursor = "pointer";
			if(dir == "right")
				arrow.style.transform = "rotate(180deg)";
			arrow.addEventListener("click", _ => {
				if(dir == "right")
					inventory.page++;
				else
					inventory.page--;
				inventory.update();
			});
			creativeDisplay.appendChild(arrow);
			dblib.centerVertical(document.getElementById(arrow.id));
		}
		this.update();
	}	
	update(){
		if(this.page == -1)
			this.page = 0;
		if(this.page == this.pages)
			this.page--;
		document.getElementById("dragonblocks.inventory[" + this.id + "].creative.page").textContent = "Page " + (this.page + 1 ) + " of " + this.pages;
		for(let slot of this.list)
			slot.update();
	}
}
