/*
 * tool.js
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
dragonblocks.Tool = class{
	constructor(obj){
		dblib.copy(this, obj);
		this.defaultDamage = this.defaultDamage || 1;
		this.interval = this.interval || 250;
		this.groups = this.groups || [];
		this.range = this.range || 4;
		dragonblocks.tools[this.name] = this;
		dragonblocks.registeredTools.push(this);
	}
	calculateDamage(node){
		var damage = -1;
		for(let group of this.groups){
			if(node.inGroup(group.name))
				damage = group.damage;
		}
		return damage / 1000 * this.interval;
	}
}
dragonblocks.tools = {};
dragonblocks.registeredTools = [];
dragonblocks.registerTool = function(obj){
	new dragonblocks.Tool(obj);
}
dragonblocks.getTool = function(name){
	return dragonblocks.tools[name];
}
