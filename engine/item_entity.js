/*
 * item_entity.js
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
	name: "dragonblocks:item_entity",
	width: 0.4,
	height: 0.4,
	gravity: true,
	verticalSpeed: 2,
	onpunch: self => {
		dragonblocks.dropItem(dragonblocks.player.give(self.meta.itemstring), self.x, self.y);
		self.despawn();
	},
	oncollide: self => {
		self.jump();
	},
});

dragonblocks.dropItem = function(itemstack, x, y) {
	if (! itemstack || ! itemstack.item || ! itemstack.count)
		return;
	let entity = dragonblocks.spawnEntity("dragonblocks:item_entity", x, y);
	entity.meta.itemstring = itemstack.stringify();
	entity.texture = itemstack.toItem().texture;
	entity.updateTexture();
}
