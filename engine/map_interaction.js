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

dragonblocks.MapInteraction = {
	initMapInteraction()
	{
		let crack = document.getElementById("dragonblocks.map").appendChild(document.createElement("div"));
		crack.id = "dragonblocks.crack[" + this.id + "]";
		crack.style.position = "absolute";
		crack.style.visibility = "hidden";
		crack.style.backgroundSize = "cover";
		crack.style.height = dragonblocks.settings.map.scale + "px";
		crack.style.width = dragonblocks.settings.map.scale + "px";
		crack.style.boxShadow = "0 0 0 1px black inset";
		crack.style.zIndex = 2;

		let self = this;

		crack.addEventListener("mouseleave", event => {
			self.digStop();
			let [x, y] = self.map.getScreenCoordinates(event.srcElement.offsetLeft, event.srcElement.offsetTop);
			self.map.getNodeDisplay(x, y).style.boxShadow = "none";
		});

		crack.addEventListener("mouseover", event => {
			let [x, y] = self.map.getScreenCoordinates(event.srcElement.offsetLeft + document.getElementById("dragonblocks.map").offsetLeft, event.srcElement.offsetTop + document.getElementById("dragonblocks.map").offsetTop);
			self.map.getNodeDisplay(x, y).style.boxShadow = "0 0 0 1px black inset";
		});
	},

	dig(map, x, y)
	{
		console.log(this);
		let node = map.getNode(x, y);

		if (! node)
			return false;

		let nodeDef = node.toNode();
		if (nodeDef.ondig && nodeDef.ondig(map, x, y) == false)
			return false;

		nodeDef.playSound("dug");

		map.setNode(x, y, "air");
		map.activate(map, x, y);

		return true;
	},

	digStart(x, y)
	{
		let node = this.map.getNode(x, y);
		let nodeDef = node.toNode();

		node.meta.hardness = nodeDef.hardness;
		node.meta.causedDamage = 0;

		if (! this.canReach(x, y))
			return;

		let crack = document.getElementById("dragonblocks.crack[" + this.id + "]")
		crack.style.visibility = "visible";
		crack.style.left = (x - this.map.displayLeft) * dragonblocks.settings.map.scale + "px";
		crack.style.top = (y - this.map.displayTop) * dragonblocks.settings.map.scale + "px";

		dragonblocks.log("Punched Node at (" + x + ", " + y + ")");

		nodeDef.onpunch && nodeDef.onpunch(this.map, x,y);

		this.map.activate(x, y);

		this.digTick(x, y);
	},

	digTick(x, y)
	{
		let self = this;

		let node = this.map.getNode(x, y);
		if (! node)
			return;

		let nodeDef = node.toNode();

		let damage = this.tool.calculateDamage(nodeDef);
		if (damage == -1)
			damage = this.tmp.defaultTool.calculateDamage(nodeDef);

		node.meta.hardness -= damage;
		node.meta.causedDamage += damage;

		if (isNaN(node.meta.hardness) || node.meta.hardness <= 0) {
			this.digEnd(x, y);
		} else {
			nodeDef.playSound("dig");

			let crack = document.getElementById("dragonblocks.crack[" + this.id + "]");
			crack.style.background = dragonblocks.getTexture("crack" + Math.floor(node.meta.causedDamage / nodeDef.hardness * 5) + ".png");
			crack.style.backgroundSize = "cover";
			crack.style.zIndex = nodeDef.zIndex || "1";

			this.tmp.digTimeout = setTimeout(_ => {
				self.digTick(x, y);
			}, this.tool.interval);
		}
	},

	digEnd(x, y)
	{
		let node = this.map.getNode(x, y);

		if (! node)
			return;

		let nodeDef = node.toNode();

		if (this.dig(this.map, x, y))
			dragonblocks.handleNodeDrop(this.tmp.mainInventory, nodeDef, this.map, x, y);

		document.getElementById("dragonblocks.crack[" + this.id + "]").style.visibility = "hidden";
	},

	digStop()
	{
		clearTimeout(this.tmp.digTimeout);
		document.getElementById("dragonblocks.crack[" + this.id + "]").style.visibility = "hidden";
	},

	place(map, x, y, node)
	{
		let oldNode = this.map.getNode(x, y);

		if (! oldNode || oldNode.stable)
			return false;

		if (node.onplace && node.onplace(map, x, y) == false)
			return false;

		map.setNode(x, y, node);
		map.activate(x, y);

		node.playSound("place");

		return true;
	},

	build(x, y)
	{
		if(this.canReach(x, y)) {
			let oldNodeDef = this.map.getNode(x, y).toNode();
			oldNodeDef.onclick && oldNodeDef.onclick(this.map, x, y);

			if (this.touch(this.map, x, y))
				return;

			let wielded = this.getWieldedItem();
			let itemstack = new dragonblocks.ItemStack();

			if(! itemstack.addOne(wielded))
				return;

			let itemDef = itemstack.toItem();

			if (itemDef instanceof dragonblocks.Node) {
				if (! this.place(this.map, x, y, itemDef) || this.meta.creative)
					wielded.add(itemstack);
			} else {
				if (! itemDef.onuse || ! itemDef.onuse(this.map, x, y))
					wielded.add(itemstack);
				else if (this.meta.creative)
					wielded.add(itemstack);
			}
		}
	},

	canReach(x, y)
	{
		return this.meta.creative || Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= this.tool.range;
	}
};

dragonblocks.handleNodeDrop = (inventory, nodeDef, map, x, y) => {
	dragonblocks.dropItem(inventory.add((nodeDef.drops instanceof Function) ? nodeDef.drops() : nodeDef.drops), map, x + 0.2, y + 0.2);
};
