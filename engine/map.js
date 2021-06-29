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

dragonblocks.Map = class
{
	constructor(data)
	{
		if (data)
			this.deserialize(data);
		else
			this.clear();

		this.initGraphics();
		this.updateGraphics();
	}

	serialize()
	{
		return {
			data: this.data,
			width: this.width,
			height: this.height,
			displayLeft: this.displayLeft,
			displayTop: this.displayTop,
			structures: this.structures,
			entities: dblib.removeTmp(this.entities),
		};
	}

	deserialize(data)
	{
		this.data = [];
		this.width = data.width;
		this.height = data.height;
		this.displayLeft = data.displayLeft;
		this.displayTop = data.displayTop;
		this.entities = [];
		this.structures = data.structures;

		for (let x = 0; x < this.width; x++) {
			this.data[x] = [];
			for (let y = 0; y < this.height; y++)
				this.setNode(x, y, new dragonblocks.MapNode().createFromMapNode(data.data[x][y]));
		}

		for (let entity of data.entities)
			new dragonblocks.SpawnedEntity(entity);
	}

	clear()
	{
		this.data = [];
		this.width = dragonblocks.settings.map.width;
		this.height = dragonblocks.settings.map.height;
		this.displayTop = dragonblocks.settings.map.height / 2;
		this.displayLeft = dragonblocks.settings.map.width / 2 - 5;
		this.entities = [];
		this.structures = {};

		for (let x = 0; x < this.width; x++) {
			this.data[x] = [];
			for (let y = 0; y < this.height; y++)
				this.setNode(x, y, new dragonblocks.MapNode("air"));
		}
	}

	withinBounds(x, y)
	{
		return x < this.width && y < this.height && x >= 0 && y >= 0;
	}

	getNode(x, y)
	{
		if (this.withinBounds(x, y))
			return this.data[x][y];
	}

	setNode(x, y, node)
	{
		node = new dragonblocks.MapNode(node);

		if (this.withinBounds(x, y)) {
			let oldNode = this.data[x][y];
			let oldNodeDef = oldNode instanceof dragonblocks.MapNode && oldNode.toNode();
			oldNodeDef && oldNodeDef.onremove && oldNodeDef.onremove(this, x, y);

			this.data[x][y] = node;

			let nodeDef = node.toNode();
			nodeDef.onset && nodeDef.onset(this, x, y);

			this.updateNodeGraphics(x, y);
		}
	}

	activate(x, y)
	{
		for (let ix = x - 1; ix <= x + 1; ix++) {
			for (let iy = y - 1; iy <= y + 1; iy++) {
				let node = this.getNode(ix, iy);

				if (! node)
					continue;

				let nodeDef = node.toNode();
				nodeDef.onactivate && nodeDef.onactivate(this, ix, iy);

				for (let func of dragonblocks.onActivateCallbacks)
					func(this, ix, iy);
			}
		}
	}

	getNodeDisplay(x, y)
	{
		return document.getElementById("dragonblocks.map.node[" + (x - this.displayLeft) + "][" + (y - this.displayTop) + "]");
	}

	getScreenCoordinates(x, y)
	{
		return [Math.floor(x / dragonblocks.settings.map.scale) + this.displayLeft, Math.floor(y / dragonblocks.settings.map.scale) + this.displayTop];
	}

	updateNodeGraphics(x, y)
	{
		let nodeDisplay = this.getNodeDisplay(x, y);

		if (! nodeDisplay)
			return;

		let nodeDef = this.getNode(x, y).toNode();

		if (! nodeDef)
			return;

		nodeDisplay.style.background = dragonblocks.getTexture(nodeDef.texture);
		nodeDisplay.style.backgroundSize = "cover";
		nodeDisplay.style.zIndex = nodeDef.zIndex || "1";
	}

	updateGraphics()
	{
		if (this.displayLeft < 0)
			this.displayLeft = 0;
		else if (this.displayLeft + this.displayWidth > this.width)
			this.displayLeft = this.width - this.displayWidth;

		if (this.displayTop < 0)
			this.displayTop = 0;
		else if (this.displayTop + this.displayHeight > this.height)
			this.displayTop = this.height - this.displayHeight;

		for (let x = 0; x < this.displayWidth; x++) {
			for(let y = 0; y < this.displayHeight; y++) {
				this.updateNodeGraphics(x + this.displayLeft, y + this.displayTop);
			}
		}
	}

	initGraphics()
	{
		this.displayWidth = Math.min(Math.ceil(innerWidth / dragonblocks.settings.map.scale), this.width);
		this.displayHeight = Math.min(Math.ceil(innerHeight / dragonblocks.settings.map.scale), this.height);

		let display = document.body.insertBefore(document.createElement("div"), document.body.firstChild);
		display.id = "dragonblocks.map";
		display.style.width = this.displayWidth * dragonblocks.settings.map.scale + "px";
		display.style.height = this.displayHeight * dragonblocks.settings.map.scale + "px";
		display.style.position = "fixed";
		display.style.top = "0px";
		display.style.left = "0px";
		display.style.backgroundColor = "skyblue";
		display.style.visibility = "hidden";

		for (let x = 0; x < this.displayWidth; x++){
			for (let y = 0; y < this.displayHeight; y++){
				let nodeDisplay = display.appendChild(document.createElement("div"));
				nodeDisplay.id = "dragonblocks.map.node[" + x + "][" + y + "]";
				nodeDisplay.style.position = "absolute";
				nodeDisplay.style.top = y * dragonblocks.settings.map.scale + "px";
				nodeDisplay.style.left = x * dragonblocks.settings.map.scale + "px";
				nodeDisplay.style.width = dragonblocks.settings.map.scale + "px";
				nodeDisplay.style.height = dragonblocks.settings.map.scale + "px";
			}
		}
	}

	addStructure(name, msg, pos)
	{
		this.structures[name] = this.structures[name] || [];
		this.structures[name].push({msg, pos});
	}

	spawnEntity(name, x, y)
	{
		let def = dragonblocks.entities[name];

		if (def)
			return new dragonblocks.SpawnedEntity(def, this, x, y);
	}

};

dragonblocks.onActivateCallbacks = [];
dragonblocks.registerOnActivate = func => {
	dragonblocks.onActivateCallbacks.push(func);
};

dragonblocks.registerOnStarted(_ => {
	document.getElementById("dragonblocks.map").style.visibility = "visible";
});

dragonblocks.registerOnQuit(_ => {
	document.getElementById("dragonblocks.map").style.visibility = "hidden";
});
