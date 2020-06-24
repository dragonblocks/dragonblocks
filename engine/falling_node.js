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
	oncollide: entity => {
		if(! dragonblocks.getNode(Math.floor(entity.x), Math.floor(entity.y) + 1) || dragonblocks.getNode(Math.floor(entity.x), Math.floor(entity.y) + 1).mobstable){
			dragonblocks.setNode(Math.floor(entity.x), Math.floor(entity.y), entity.meta.nodeName);
			entity.despawn();
		}
	}
}); 

dragonblocks.registerOnActivateNode((x, y) => {
	if(! dragonblocks.getNode(x, y).toNode().physics || ! dragonblocks.getNode(x, y + 1) || dragonblocks.getNode(x, y + 1).mobstable)
		return;
	let name = 	dragonblocks.getNode(x, y).name;
	setTimeout(_ => {dragonblocks.map.activate(x, y);}, 50);
	dragonblocks.setNode(x, y, "air");
	let entity = dragonblocks.spawnEntity("dragonblocks:falling_node", x, y);
	entity.meta.nodeName = name;
	entity.texture = dragonblocks.nodes[name].texture;
	entity.updateTexture();
})
