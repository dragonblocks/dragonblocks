/*
 * map_node.js
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
dragonblocks.MapNode = class{
	constructor(node){
		if(! node)
			return;
		if(dragonblocks.nodes[node])
			this.createFromNode(dragonblocks.nodes[node]);
		else if(node instanceof dragonblocks.Node)
			this.createFromNode(node)
		else if(node instanceof dragonblocks.MapNode)
			this.createFromMapNode(node);
		else
			dragonblocks.error("Can not create Map Node: Invalid argument.");
		this.tmp = {};
	}
	createFromNode(node){
		this.meta = {};
		this.name = node.name;
		this.stable = node.stable;
		this.mobstable = node.mobstable;
		return this;
	}
	createFromMapNode(mapnode){
		dblib.copy(this, mapnode);
		return this;
	}
	toNode(){
		return dragonblocks.nodes[this.name];
	}
}
