/*
 * item.js
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
dragonblocks.Item = class{
	constructor(obj){
		if(! obj)
			dragonblocks.error("Can not register item: Missing argument");
		dblib.copy(this, obj);
		if(! this.name)
			dragonblocks.error("Can not register item: Missing name");
		if(! this.texture)
			dragonblocks.error("Can not register item: Missing texture");
		if(dragonblocks.items[this.name])
			dragonblocks.error("Can not register item '" + this.name + "': Item already exists");
		if(this.desc != "" && this.description != "")
			this.desc = this.description || this.desc || this.name;
		this.stacksize = this.stacksize || dragonblocks.settings.item.defaultStacksize;
		this.groups = this.groups || [];
		this.groups.push("default");
		dragonblocks.items[this.name] = this;
		dragonblocks.registeredItems.push(this);
	}
	inGroup(name){
		return (this.groups.indexOf(name) != -1);
	}
	playSound(s){
		if(this.sounds && this.sounds[s]){
			dragonblocks.playSound(this.sounds[s]);
			return;
		}
		else if(this.sounds && this.sounds[s] == "")
			return;
		for(let groupname of this.groups){
			let group = dragonblocks.groups[groupname];
			if(group && group.sounds && group.sounds[s]){
				dragonblocks.playSound(group.sounds[s]);
				return;
			}
			else if(group && group.sounds && group.sounds[s] == "")
				return;
		}
	}
}
dragonblocks.registeredItems = [];
dragonblocks.items = {};
dragonblocks.registerItem = function(obj){
	new dragonblocks.Item(obj);
}
dragonblocks.onUseItemFunctions = [];
dragonblocks.registerOnUseItem = function(func){
	dragonblocks.onUseItemFunctions.push(func);
};
dragonblocks.itemMatch = function(item1, item2){
	if(dragonblocks.items[item1])
		item1 = dragonblocks.items[item1];
	if(dragonblocks.items[item2])
		item2 = dragonblocks.items[item2];
	if(dragonblocks.groups[item1])
		item1 = dragonblocks.groups[item1];
	if(dragonblocks.groups[item2])
		item2 = dragonblocks.groups[item2];
	return item1 == item2 || item1 && item2 && (item1.name == item2.name || item1.inGroup && item1.inGroup(item2.name) || item2.inGroup && item2.inGroup(item1.name));
}
