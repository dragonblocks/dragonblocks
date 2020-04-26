/*
 * inventory.js
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
dragonblocks.Inventory = class{
	constructor(slots, columns){
		this.id = dragonblocks.getToken();
		this.slots = slots;
		this.columns = columns;
		this.list = [];
		for(let i = 0; i < this.slots; i++){
			this.list[i] = new dragonblocks.createItemstack();
		}
		this.display = false;
	}
	stringify(){
		let str = ""
		for(let stack of this.list)
			str += stack.stringify() + ",";
		return str;
	}
	parse(str){
		for(let i in this.list)
			this.list[i].parse(str.split(",")[i]); 
	}
	add(itemstring){
		var itemstack = dragonblocks.createItemstack(itemstring);
		for(let stack of this.list)
			stack.item == itemstack.item && stack.add(itemstack);
		for(let stack of this.list)
			stack.add(itemstack);
		return itemstack;
	}
	isEmpty(){
		for(let stack of this.list)
			if(stack.item)
				return false;
		return true;
	}
	addUpdateListener(func){
		for(let stack of this.list)
			stack.addUpdateListener(func);
	}
	clear(){
		for(let stack of this.list)
			stack.clear();
	}
	calculateWidth(columns){
		return dragonblocks.settings.inventory.scale * 1.1 * this.columns + (dragonblocks.settings.inventory.scale * 0.1);
	}
	calculateHeight(){
		return dragonblocks.settings.inventory.scale * 1.1 * Math.ceil(this.slots/this.columns) + dragonblocks.settings.inventory.scale * 0.1
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
		display.id = "dragonblocks.inventory[" + this.id + "]";
		display.style.position = "absolute";
		display.style.left = x + "px";
		display.style.top = y + "px";
		display.style.width =  this.calculateWidth() + "px";
		display.style.height = this.calculateHeight() + "px";
		for(let i in this.list){
			let x = i % this.columns;
			let y = (i - x) / this.columns;
			dragonblocks.Inventory.drawStack(display, dragonblocks.settings.inventory.scale * 0.1 + x * dragonblocks.settings.inventory.scale * 1.1, dragonblocks.settings.inventory.scale * 0.1 +  y * dragonblocks.settings.inventory.scale * 1.1, this.list[i]);
		}
		parent.appendChild(display);
		this.display = true;
		return true;
	}
	remove(){
		dblib.remove(this.getDisplay());
		this.display = false;
	}
	show(){
		this.getDisplay().style.visibility = "inherit";
		this.update();
	}
	hide(){
		this.getDisplay().style.visibility = "hidden";
	}
	update(){
		for(let stack of this.list)
			stack.update();
	}
	getSlot(i){
		return this.list[i];
	}
	getDisplay(){
		return document.getElementById("dragonblocks.inventory[" + this.id + "]");
	}
	static drawStack(parent, x, y, stack){
		let stackDisplay = document.createElement("div");
		stackDisplay.id = "dragonblocks.itemstack[" + stack.id + "]";
		stackDisplay.stackid = stack.id;
		stackDisplay.style.borderStyle = "solid";
		stackDisplay.style.borderWidth = "1px";
		stackDisplay.style.borderColor = "#2D2D2D";
		stackDisplay.style.width = dragonblocks.settings.inventory.scale + "px";
		stackDisplay.style.height = dragonblocks.settings.inventory.scale + "px";
		stackDisplay.style.backgroundColor = "#343434";
		stackDisplay.style.position = "absolute";
		stackDisplay.style.left = x + "px";
		stackDisplay.style.top = y + "px";
		stackDisplay.addEventListener("mousedown", event => {
			let out = dragonblocks.Inventory.out;
			if(stack.action)
				return stack.action(out, event.which);
			switch(event.which){
				case 1:
					if(out.item)
						stack.add(out) || stack.swap(out);
					else
						out.add(stack);
					break;
				case 3:
					if(out.item)
						stack.addOne(out) || stack.swap(out);
					else
						out.addHalf(stack);
			}
		});
		stackDisplay.addEventListener("mouseover", event => {
			stack.focused = true;
			dragonblocks.Inventory.redrawStack(stack);
		});
		stackDisplay.addEventListener("mouseleave", event => {
			stack.focused = false;
			dragonblocks.Inventory.redrawStack(stack);
		});
		let stackDisplayCount = document.createElement("span");
		stackDisplayCount.id = "dragonblocks.itemstack[" + stack.id + "].count";
		stackDisplayCount.stackid = stack.id;
		stackDisplayCount.style.position = "absolute";
		stackDisplayCount.style.right = "5px";
		stackDisplayCount.style.bottom = "5px";
		stackDisplayCount.style.color = "white";
		stackDisplayCount.style.cursor = "default";
		stackDisplay.appendChild(stackDisplayCount);
		parent.appendChild(stackDisplay);
		stack.addUpdateListener(_ => {
			dragonblocks.Inventory.redrawStack(stack);
		});
		stack.update();
	}
	static redrawStack(stack){
		let stackDisplay = document.getElementById("dragonblocks.itemstack[" + stack.id + "]");
		if(! stackDisplay)
			return;
		let stackDisplayCount = document.getElementById("dragonblocks.itemstack[" + stack.id + "].count");
		stackDisplay.title = "";
		stackDisplay.style.background = "none";
		stackDisplayCount.innerHTML = "";
		if(stack.item){
			stackDisplay.style.background = dragonblocks.getTexture(stack.toItem().texture);
			stackDisplay.style.backgroundSize = "cover";
			stackDisplay.title = stack.toItem().desc;
			if(stack.count > 1)
				stackDisplayCount.innerHTML = stack.count;
		}
		stackDisplay.style.backgroundColor = "#343434";
		if(stack.focused)
			stackDisplay.style.backgroundColor = "#7E7E7E";
		if(stack.onredraw)
			stack.onredraw();
	}
	static getStackDisplay(id){
		return document.getElementById("dragonblocks.itemstack[" + id + "]");
	}
	static insertElement(elem){
		document.body.insertBefore(elem, dragonblocks.Inventory.getStackDisplay(dragonblocks.Inventory.out.id));
	}
};
setTimeout((function(){
	let out = dragonblocks.Inventory.out = new dragonblocks.createItemstack();
	dragonblocks.Inventory.drawStack(document.body, 0, 0, out);
	dragonblocks.Inventory.getStackDisplay(out.id).style.position = "fixed";
	out.addUpdateListener(_ => {
		dragonblocks.Inventory.redrawStack(out);
	});
	out.onredraw = _ => {
		dragonblocks.Inventory.getStackDisplay(out.id).style.backgroundColor = "";
		dragonblocks.Inventory.getStackDisplay(out.id).style.border = "none";
	};
	addEventListener("mousemove", event => {
		dragonblocks.Inventory.getStackDisplay(out.id).style.left = event.clientX + 5 + "px";
		dragonblocks.Inventory.getStackDisplay(out.id).style.top = event.clientY + 5 + "px";
	});
	out.update();
}));
