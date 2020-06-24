/*
 * map_interaction.js
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
dragonblocks.MapIntercation = {
	initMapInteraction(){
		let self = this;
		let crack = document.createElement("div");
		crack.id = "dragonblocks.crack[" + this.id + "]";
		crack.style.position = "absolute";
		crack.style.visibility = "hidden";
		crack.style.backgroundSize = "cover";
		crack.style.height = dragonblocks.settings.map.scale + "px";
		crack.style.width = dragonblocks.settings.map.scale + "px";
		crack.style.boxShadow = "0 0 0 1px black inset";
		crack.style.zIndex = 2;
		crack.addEventListener("mouseleave", event => {
			self.digStop();
			let [x, y] = dragonblocks.map.getCoordinate(event.srcElement.offsetLeft, event.srcElement.offsetTop);
			dragonblocks.map.getNodeGraphics(x, y).style.boxShadow = "none";
		});
		crack.addEventListener("mouseover", event => {
			let [x, y] = dragonblocks.map.getCoordinate(event.srcElement.offsetLeft + document.getElementById("dragonblocks.map").offsetLeft, event.srcElement.offsetTop + document.getElementById("dragonblocks.map").offsetTop);
			dragonblocks.map.getNodeGraphics(x, y).style.boxShadow = "0 0 0 1px black inset";
		});
		document.getElementById("dragonblocks.map").appendChild(crack);
	},
	dig(x, y){
		let mapNode = dragonblocks.getNode(x, y);
		if(! mapNode)
			return false;
		let node = mapNode.toNode();
		if(node.ondig && node.ondig(x, y) == false)
			return false;
		for(let func of dragonblocks.onDigNodeFunctions)
			if(func(x, y) == false)
				return false;
		node.playSound("dug");
		dragonblocks.setNode(x, y, "air");
		dragonblocks.map.activate(x, y);
		return true;
	},
	digStart(x, y){
		let mapNode = dragonblocks.getNode(x, y);
		let node = mapNode.toNode();
		mapNode.meta.hardness = node.hardness;
		mapNode.meta.causedDamage = 0;
		if(! this.canReach(x, y))
			return;
		let crack = document.getElementById("dragonblocks.crack[" + this.id + "]")
		crack.style.visibility = "visible";
		crack.style.left = (x - dragonblocks.map.displayLeft) * dragonblocks.settings.map.scale + "px";
		crack.style.top = (y - dragonblocks.map.displayTop) * dragonblocks.settings.map.scale + "px";
		dragonblocks.log("Punched Node at (" + x + ", " + y + ")");
		node.onpunch && node.onpunch(x,y);
		for(let func of dragonblocks.onPunchNodeFunctions)
			func(x, y);
		dragonblocks.map.activate(x, y);
		this.digTick(x, y);
	},
	digTick(x, y){
		let self = this;
		let mapNode = dragonblocks.getNode(x, y);
		if(! mapNode)
			return;
		let node = mapNode.toNode();
		let damage = this.tool.calculateDamage(node);
		if(damage == -1)	
			damage = this.tmp.defaultTool.calculateDamage(node);
		mapNode.meta.hardness -= damage;
		mapNode.meta.causedDamage += damage;
		if(mapNode.meta.hardness <= 0 || isNaN(mapNode.meta.hardness))
			this.digEnd(x, y);
		else{
			node.playSound("dig");
			let crack = document.getElementById("dragonblocks.crack[" + this.id + "]");
			crack.style.background = dragonblocks.getTexture("crack" + Math.floor(mapNode.meta.causedDamage / mapNode.toNode().hardness * 5) + ".png");
			crack.style.backgroundSize = "cover";
			this.tmp.digTimeout = setTimeout(_ => { self.digTick(x, y) }, this.tool.interval);
		}
	},
	digEnd(x, y){
		let mapNode = dragonblocks.getNode(x, y);
		if(! mapNode)
			return;
		let node = mapNode.toNode();
		if (this.dig(x, y))
			dragonblocks.handleNodeDrop(this.tmp.mainInventory, node, x, y);
		document.getElementById("dragonblocks.crack[" + this.id + "]").style.visibility = "hidden";
	},
	digStop(){
		clearTimeout(this.tmp.digTimeout);
		document.getElementById("dragonblocks.crack[" + this.id + "]").style.visibility = "hidden";
	},
	place(x, y, node){
		if(! dragonblocks.getNode(x, y) || dragonblocks.getNode(x, y).stable)
			return false;
		if(node.onplace && node.onplace(x, y) == false)
			return false;
		for(let func of dragonblocks.onPlaceNodeFunctions)
			if(func(node, x, y) == false)
				return false;
		dragonblocks.setNode(x, y, node);
		dragonblocks.map.activate(x, y);
		node.playSound("place");
		return true;
	},
	build(x, y){
		if(this.canReach(x, y)){
			let old = dragonblocks.getNode(x, y).toNode();
			old.onclick && old.onclick(x, y);
			for(let func of dragonblocks.onClickNodeFunctions)
				func(x, y);
			if(this.touch(x, y))
				return;
			var buildstack = dragonblocks.createItemstack();
			if(! buildstack.addOne(this.getWieldedItem()))
				return;
			if(buildstack.toItem() instanceof dragonblocks.Node){
				if(! this.place(x, y, buildstack.toItem()) || this.meta.creative)
					this.getWieldedItem().add(buildstack);
			}
			else{
				if(! buildstack.toItem().onuse || ! buildstack.toItem().onuse(x, y))
					this.getWieldedItem().add(buildstack);
				else{
					for(let func of dragonblocks.onUseItemFunctions)
						func(buildstack.toItem(), x, y);
					if(this.meta.creative)
						this.getWieldedItem().add(buildstack);
				}
			}
		}
	},
	canReach(x, y){
		return (Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= this.tool.range) || this.meta.creative;
	},
} 

dragonblocks.handleNodeDrop = function(inventory, node, x, y) {
	dragonblocks.dropItem(inventory.add((node.drops instanceof Function) ? node.drops() : node.drops), x + 0.2, y + 0.2);
}
