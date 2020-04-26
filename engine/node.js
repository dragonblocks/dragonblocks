/*
 * node.js
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
dragonblocks.Node = class extends dragonblocks.Item{
	constructor(obj){
		super(obj);
		if(this.drops == "")
			this.drops = " ";
		if(this.drop == "")
			this.drop = " ";
		this.drops = this.drops || this.drop || this.name;
		if(this.mobstable == undefined)
			this.mobstable = this.stable;
		let self = this;
		if(this.physics){
			dragonblocks.registerEntity({
				name: this.name,
				gravity: true,
				width: 1,
				height: 1,
				texture: this.texture,
				oncollide: entity => {
					if(! dragonblocks.getNode(Math.floor(entity.x), Math.floor(entity.y) + 1) || dragonblocks.getNode(Math.floor(entity.x), Math.floor(entity.y) + 1).mobstable){
						dragonblocks.setNode(Math.floor(entity.x), Math.floor(entity.y), entity.name);
						entity.despawn();
					}
				}
			});
		}
		if(this.liquid){
			this.hardness = 1;
			let oldOndig = this.ondig;
			this.ondig =  (x, y) => {
				if(oldOndig)
					return oldOndig(x, y);
				return false;
			};
			let oldBlast = this.onblast;
			this.onblast = (x, y) => {
				if(oldBlast)
					return oldBlast(x, y);
				return false;
			};
			let oldOnset = this.onset;
			this.onset = (x, y) => {
				let meta = dragonblocks.getNode(x, y).meta;
				meta.liquidInterval = setInterval(_ => {
					for(let [ix, iy] of [[x + 1, y], [x - 1, y], [x, y + 1]]){
						let mapNode = dragonblocks.getNode(ix, iy);
						if(! mapNode || mapNode.stable || mapNode.toNode().liquid)
							continue;
						dragonblocks.setNode(ix, iy, self.name);
					}
				}, self.liquidTickSpeed || 2000);
				if(oldOnset)
					oldOnset(x, y);
				return meta;
			}
			let oldOnremove = this.onremove;
			this.onremove = (x, y) => {
				clearInterval(dragonblocks.getNode(x, y).meta.liquidInterval)
				if(oldOnremove)
					oldOnremove(x, y);
			}
		}
		dragonblocks.nodes[this.name] = this;
		dragonblocks.registeredNodes.push(this);
	}
}
dragonblocks.nodes = {};
dragonblocks.registeredNodes = [];
dragonblocks.registerNode = function(obj){
	new dragonblocks.Node(obj);
}
dragonblocks.onSetNodeFunctions = [];
dragonblocks.registerOnSetNode = function(func){
	dragonblocks.onSetNodeFunctions.push(func);
}
dragonblocks.onRemoveNodeFunctions = [];
dragonblocks.registerOnRemoveNode = function(func){
	dragonblocks.onRemoveNodeFunctions.push(func);
}
dragonblocks.onPlaceNodeFunctions = [];
dragonblocks.registerOnPlaceNode = function(func){
	dragonblocks.onPlaceNodeFunctions.push(func);
}
dragonblocks.onDigNodeFunctions = [];
dragonblocks.registerOnDigNode = function(func){
	dragonblocks.onDigNodeFunctions.push(func);
}
dragonblocks.onClickNodeFunctions = [];
dragonblocks.registerOnClickNode = function(func){
	dragonblocks.onClickNodeFunctions.push(func);
}
dragonblocks.onActivateNodeFunctions = [];
dragonblocks.registerOnActivateNode = function(func){
	dragonblocks.onActivateNodeFunctions.push(func);
}
dragonblocks.onPunchNodeFunctions = [];
dragonblocks.registerOnPunchNode = function(func){
	dragonblocks.onPunchNodeFunctions.push(func);
}
dragonblocks.registerOnActivateNode((x, y) => {
	if(! dragonblocks.getNode(x, y).toNode().physics || ! dragonblocks.getNode(x, y + 1) || dragonblocks.getNode(x, y + 1).mobstable)
		return;
	let name = 	dragonblocks.getNode(x, y).name;
	setTimeout(_ => {dragonblocks.map.activate(x, y);}, 50);
	dragonblocks.setNode(x, y, "air");
	dragonblocks.spawnEntity(name, x, y);
})
