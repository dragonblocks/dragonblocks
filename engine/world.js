/*
 * world.js
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

dragonblocks.getSavestring = _ => {
	dragonblocks.world.map = dragonblocks.map;
	dragonblocks.world.mods = dragonblocks.mods;
	dragonblocks.world.spawnedEntities = dblib.removeTmp(dragonblocks.spawnedEntities);

	return JSON.stringify(dragonblocks.world);
}

dragonblocks.save = _ => {
	if (dragonblocks.loggedin)
		return dragonblocks.backendCall("saveWorld", true, {name: dragonblocks.worldname, world: dragonblocks.getSavestring()});
};

dragonblocks.checkWorldnameSpelling = name => {
	return name.match(/^[a-zA-Z0-9]+$/);
};

dragonblocks.loadWorldList = _ => {
	dragonblocks.worlds = dragonblocks.backendCall("getWorlds");
};

dragonblocks.getEmptyWorld = function(){
	return {
		map:{
			data: Array(dragonblocks.settings.map.width).fill(Array(dragonblocks.settings.map.width).fill(new dragonblocks.MapNode("air"))),
			width: dragonblocks.settings.map.width,
			height: dragonblocks.settings.map.height,
			displayTop: dragonblocks.settings.map.height / 2,
			displayLeft: dragonblocks.settings.map.width / 2 - 5,
		},
		structures: {},
	};
}
