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
		this.active = false;

		this.entityContainer = dragonblocks.mapDisplay.element.appendChild(document.createElement("div"));
		this.entityContainer.style.position = "absolute";
		this.entityContainer.style.visibility = "hidden";

		this.deserialize(data);
	}

	serialize()
	{
		return {
			width: this.width,
			height: this.height,
			sky: this.sky,
			data: this.data,
			entities: dblib.removeTmp(this.entities),
			structures: this.structures,
		};
	}

	deserialize(data)
	{
		this.width = data.width;
		this.height = data.height;
		this.sky = data.sky;
		this.data = [];
		this.entities = [];
		this.structures = data.structures || {};

		for (let x = 0; x < this.width; x++) {
			this.data[x] = [];
			for (let y = 0; y < this.height; y++)
				this.setNode(x, y, data.data ? new dragonblocks.MapNode().createFromMapNode(data.data[x][y]) : new dragonblocks.MapNode("air"));
		}

		if (data.entities)
			for (let entity of data.entities)
				new dragonblocks.SpawnedEntity(entity, this);
	}

	setActive()
	{
		this.active = true;
		this.entityContainer.style.visibility = "inherit";
	}

	setInactive()
	{
		this.active = false;
		this.entityContainer.style.visibility = "hidden";
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

			this.active && dragonblocks.mapDisplay.updateNode(x, y);
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

	setSky(sky)
	{
		this.sky = sky;

		if (this.active)
			dragonblocks.mapMgr.setSky(this.sky);
	}
};

dragonblocks.mapMgr = new dragonblocks.ContentMgr(dragonblocks.Map);

dragonblocks.onActivateCallbacks = [];
dragonblocks.registerOnActivate = func => {
	dragonblocks.onActivateCallbacks.push(func);
};
