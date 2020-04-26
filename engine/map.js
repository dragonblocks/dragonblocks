/*
 * map.js
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
dragonblocks.Map = class{
	constructor(){
		dragonblocks.map = this;
		dblib.copy(this, dragonblocks.world.map);
		this.graphicsInit();
		for(let x = 0; x < this.width; x++)
			for(let y = 0; y < this.height; y++)
				this.setNode(x, y, new dragonblocks.MapNode().createFromMapNode(this.content[x][y]));
	}
	setNode(x, y, node){
		if(this.contains(x, y)){
			if(this.content[x][y] instanceof dragonblocks.MapNode && this.content[x][y].toNode().onremove)
				this.content[x][y].toNode().onremove(x, y);
			for(let func of dragonblocks.onRemoveNodeFunctions)
				func(x, y);
			this.content[x][y] = node;
			if(node.toNode().onset)
				node.toNode().onset(x, y);
			for(let func of dragonblocks.onSetNodeFunctions)
				func(x, y);
			this.graphicsUpdateNode(x, y);
		}
	}
	activate(x, y){
		for(let ix = x - 1; ix <= x + 1; ix++){
			for(let iy = y - 1; iy <= y + 1; iy++){
				if(! this.getNode(ix, iy))
					continue;
				if(this.getNode(ix, iy).toNode().onactivate)
					this.getNode(ix, iy).toNode().onactivate(ix, iy);
				for(let func of dragonblocks.onActivateNodeFunctions)
					func(ix, iy);
			}
		}
	}
	getNode(x, y){
		if(this.contains(x, y))
			return this.content[x][y];
	}
	contains(x, y){
		return x < this.width && y < this.height && x >= 0 && y >= 0;
	}
	getNodeGraphics(x, y){
		return document.getElementById("dragonblocks.map.node[" + (x - this.displayLeft) + "][" + (y - this.displayTop) + "]");
	}
	getCoordinate(x, y){
		return [Math.floor(x / dragonblocks.settings.map.scale) + this.displayLeft, Math.floor(y / dragonblocks.settings.map.scale) + this.displayTop];
	}
	graphicsUpdateNode(x, y){
		let nodeDisplay = this.getNodeGraphics(x, y);
		let node = this.getNode(x, y).toNode();
		if(!nodeDisplay || !node)
			return;
		nodeDisplay.style.background = dragonblocks.getTexture(node.texture);
		nodeDisplay.style.backgroundSize = "cover";
		nodeDisplay.style.zIndex = node.zIndex || "1";
	}
	graphicsUpdate(){
		if(this.displayLeft < 0)
			this.displayLeft = 0;
		else if(this.displayLeft + this.displayWidth > this.width)
			this.displayLeft = this.width - this.displayWidth;
		if(this.displayTop < 0)
			this.displayTop = 0;
		else if(this.displayTop + this.displayHeight > this.height)
			this.displayTop = this.height - this.displayHeight;
		for(let x = 0; x < this.displayWidth; x++){
			for(let y = 0; y < this.displayHeight; y++){
				this.graphicsUpdateNode(x + this.displayLeft, y + this.displayTop);
			}
		}
	}
	graphicsInit(){
		this.displayWidth = Math.min(Math.ceil(innerWidth / dragonblocks.settings.map.scale), this.width);
		this.displayHeight = Math.min(Math.ceil(innerHeight / dragonblocks.settings.map.scale), this.height);
		var map = document.createElement("div");
		map.id = "dragonblocks.map";
		map.style.width = this.displayWidth * dragonblocks.settings.map.scale + "px";
		map.style.height = this.displayHeight * dragonblocks.settings.map.scale + "px";
		map.style.position = "fixed";
		map.style.top = "0px";
		map.style.left = "0px";
		map.style.backgroundColor = "skyblue";
		map.style.visibility = "hidden";
		for(let x = 0; x < this.displayWidth; x++){
			for(let y = 0; y < this.displayHeight; y++){
				var node = document.createElement("div");
				node.id = "dragonblocks.map.node[" + x + "][" + y + "]";
				node.style.position = "absolute";
				node.style.top = y * dragonblocks.settings.map.scale + "px";
				node.style.left = x * dragonblocks.settings.map.scale + "px";
				node.style.width = dragonblocks.settings.map.scale + "px";
				node.style.height = dragonblocks.settings.map.scale + "px";
				map.appendChild(node);
			}
		}
		document.body.insertBefore(map, document.body.firstChild);
	}
}
dragonblocks.setNode = function(x, y, node){
	dragonblocks.map.setNode(x, y, new dragonblocks.MapNode(node));
}
dragonblocks.getNode = function(x, y){
	return dragonblocks.map.getNode(x, y);
}
dragonblocks.registerOnStarted(_ => {
	document.getElementById("dragonblocks.map").style.visibility = "visible";
});
dragonblocks.registerOnQuit(_ => {
	document.getElementById("dragonblocks.map").style.visibility = "hidden";
});
