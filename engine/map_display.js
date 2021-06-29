/*
 * map_display.js
 *
 * Copyright 2021 Elias Fleckenstein <eliasfleckenstein@web.de>
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

dragonblocks.MapDisplay = class
{
	constructor()
	{
		this.map = null;
		this.anchor = null;

		this.scale = dragonblocks.settings.mapDisplay.scale;
		this.width = Math.ceil(innerWidth / this.scale);
		this.height = Math.ceil(innerHeight / this.scale);
		this.left = 0;
		this.top = 0;

		this.element = document.body.insertBefore(document.createElement("div"), document.body.firstChild);
		this.element.style.width = this.width * this.scale + "px";
		this.element.style.height = this.height * this.scale + "px";
		this.element.style.position = "fixed";
		this.element.style.top = "0px";
		this.element.style.left = "0px";
		this.element.style.visibility = "hidden";

		this.nodes = [];
		for (let x = 0; x < this.width; x++) {
			this.nodes[x] = [];
			for (let y = 0; y < this.height; y++) {
				let node = this.nodes[x][y] = this.element.appendChild(document.createElement("div"));
				node.style.position = "absolute";
				node.style.top = y * this.scale + "px";
				node.style.left = x * this.scale + "px";
				node.style.width = this.scale + "px";
				node.style.height = this.scale + "px";
			}
		}
	}

	setActive()
	{
		let self = this;

		this.interval = setInterval(_ => {
			self.autoScroll();
		});

		this.element.style.visibility = "visible";
	}

	setInactive()
	{
		if (this.interval) {
			clearInterval(this.interval);
			delete this.interval;
		}

		this.map = null;
		this.anchor = null;

		this.element.style.visibility = "hidden";
	}

	setMap(map)
	{
		if (this.map)
			this.map.setInactive();

		this.map = map;
		this.map.setActive();

		this.autoScroll() || this.update();
	}

	setAnchor(anchor)
	{
		this.anchor = anchor;
		this.autoScroll();
	}

	setSkyColor(color)
	{
		this.element.style.backgroundColor = color;
	}

	getActiveEntityContainer()
	{
		return this.entityContainers[this.map];
	}

	isInitialized()
	{
		return this.map && this.anchor;
	}

	withinBounds(x, y)
	{
		return x < this.width && y < this.height && x >= 0 && y >= 0;
	}

	getNode(x, y)
	{
		return this.withinBounds(x, y) && this.nodes[x][y];
	}

	updateNode(x, y)
	{
		if (! this.isInitialized())
			return;

		let node = this.getNode(x - this.left, y - this.top);

		if (! node)
			return;

		let mapNodeDef = this.map.getNode(x, y).toNode();

		if (mapNodeDef) {
			node.style.background = dragonblocks.getTexture(mapNodeDef.texture);
			node.style.zIndex = mapNodeDef.zIndex || "1";
		} else {
			node.style.background = "black";
		}
	}

	autoScroll()
	{
		if (! this.isInitialized())
			return;

		let oldLeft, oldTop;
		oldLeft = this.left;
		oldTop = this.top;

		if (this.map.width >= this.width)
			this.left = parseInt(Math.max(Math.min(this.left, this.map.width - this.width, this.anchor.x - 3), 0, this.anchor.x + this.anchor.width + 3 - this.width));
		else
			this.left = parseInt((this.width - this.map.width) / 2);

		if (this.map.width >= this.width)
			this.top = parseInt(Math.max(Math.min(this.top, this.map.height - this.height, this.anchor.y - 3), 0, this.anchor.y + this.anchor.height + 3 - this.height));
		else
			this.top = parseInt((this.height - this.map.height) / 2);

		let changed = oldLeft != this.left || oldTop != this.top;

		if (changed)
			this.update();

		return changed;
	}

	update()
	{
		if (! this.isInitialized())
			return;

		this.map.entityContainer.style.left = -this.left * this.scale + "px";
		this.map.entityContainer.style.top = -this.top * this.scale + "px";

		for (let x = 0; x < this.width; x++)
			for(let y = 0; y < this.height; y++)
				this.updateNode(x + this.left, y + this.top);
	}
};

dragonblocks.mapDisplay = new dragonblocks.MapDisplay();

dragonblocks.registerOnQuit(_ => {
	dragonblocks.mapDisplay.setInactive();
});

dragonblocks.registerOnStarted(_ => {
	dragonblocks.mapDisplay.setSkyColor("skyblue");
	dragonblocks.mapDisplay.setMap(dragonblocks.world.map);
	dragonblocks.mapDisplay.setAnchor(dragonblocks.player);

	dragonblocks.mapDisplay.setActive();
});
