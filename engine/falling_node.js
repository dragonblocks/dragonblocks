/*
 * falling_node.js
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

dragonblocks.registerEntity({
	name: "dragonblocks:falling_node",
	gravity: true,
	width: 1,
	height: 1,
	texture: this.texture,
	oncollide: self => {
		let under = self.map.getNode(Math.floor(self.x), Math.floor(self.y) + 1);

		if (! under || under.mobstable) {
			self.map.setNode(Math.floor(self.x), Math.floor(self.y), self.meta.nodeName);
			self.despawn();
		}
	}
});

dragonblocks.registerOnActivate((map, x, y) => {
	let node = map.getNode(x, y);
	if (! node.toNode().physics)
		return;

	let under = map.getNode(x, y + 1);
	if (under && ! under.mobstable)
		dragonblocks.spawnFallingNode(node.name, map, x, y)
});

dragonblocks.spawnFallingNode = (nodename, map, x, y) => {
	setTimeout(_ => {
		map.activate(x, y);
	}, 50);

	map.setNode(x, y, "air");

	let entity = map.spawnEntity("dragonblocks:falling_node", x, y);
	entity.meta.nodeName = nodename;
	entity.texture = dragonblocks.nodes[nodename].texture;
	entity.updateTexture();
};
