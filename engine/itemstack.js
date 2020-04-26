/*
 * itemstack.js
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
dragonblocks.Itemstack = class{
	constructor(){
		this.count = 0;
		this.item = null;
		this.id = dragonblocks.getToken();
		dragonblocks.itemstacks[this.id] = this;
	}
	parse(itemstring){
		this.item = itemstring ? itemstring.split(" ")[0] : null;
		this.count = itemstring ? parseInt(itemstring.split(" ")[1]) || 1 : 1;
		if(this.item && ! this.toItem())
			return false;
		this.update();
		return true;
	}
	getStacksize(){
		return (this.toItem() && this.toItem().stacksize) || dragonblocks.settings.item.defaultStacksize;
	}
	update(){
		if(this.count < 1)
			this.item = null;
		if(!this.item)
			this.count = 0;
		if(this.onupdate)
			this.onupdate();
	}
	addUpdateListener(func){
		let oldOnupdate = this.onupdate;
		this.onupdate = _ => {
			if(oldOnupdate)
				oldOnupdate();
			func();
		}		
	}
	toItem(){
		return dragonblocks.items[this.item];
	}
	swap(itemstack){
		[this.count, itemstack.count] = [itemstack.count, this.count];
		[this.item, itemstack.item] = [itemstack.item, this.item];
		itemstack.update();
		this.update();
	}
	clear(){
		this.item = null;
		this.count = 0;
		this.update();
	}
	addItems(itemstack, count){
		this.update();
		itemstack.update();
		if(! itemstack.item)
			return false;
		if(! this.item)
			this.item = itemstack.item;
		if(this.item != itemstack.item)
			return false;
		if(this.count == this.getStacksize())
			return false;
		itemstack.count -= count;
		this.count += count;
		let less = -itemstack.count;
		if(less > 0){
			itemstack.count += less;
			this.count -= less;
		}
		let more = this.count - this.getStacksize();
		if(more > 0){
			this.count -= more;
			itemstack.count += more;
		}
		this.update();
		itemstack.update();
		return true;
	}
	add(itemstack){
		return this.addItems(itemstack, itemstack.count);
	}
	addOne(itemstack){
		return this.addItems(itemstack, 1);
	}
	addHalf(itemstack){
		return this.addItems(itemstack, Math.ceil(itemstack.count / 2));
	}
	stringify(){
		if(! this.item)
			return "";
		return this.item + " " + this.count;
	}
}; 
dragonblocks.itemstacks = {};
dragonblocks.createItemstack = function(itemstring){
	let itemstack = new dragonblocks.Itemstack();
	if(itemstring)
		itemstack.parse(itemstring);
	return itemstack;
}
dragonblocks.isValidItemstring = function(itemstring){
	return new dragonblocks.Itemstack().parse(itemstring);
}
