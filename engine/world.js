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
dragonblocks.getSavestring = function(){
	dragonblocks.world.map = dragonblocks.map;
	dragonblocks.world.mods = dragonblocks.mods;
	dragonblocks.world.spawnedEntities = dblib.removeTmp(dragonblocks.spawnedEntities)
	return JSON.stringify(dragonblocks.world);
}
dragonblocks.save = function(){
	if(dragonblocks.loggedin)
		$.post({
			url: "api.php",
			data: {call: "saveWorld", name: dragonblocks.worldname, world: dragonblocks.getSavestring()}
		});
}
dragonblocks.checkWorldOwnership = function(name){
	return $.get("worlds/" + name + "/owner.txt").responseText == dragonblocks.username;
}
dragonblocks.checkWorldExistance = function(name){
	return $.get("worlds/" + name).status == 200;
}
dragonblocks.checkWorldSpelling = function(name){
	return $.getJSON({
		url: "api.php",
		method: "POST",
		data: {call: "checkWorldname", name: name},
	}).responseJSON;
}
dragonblocks.loadWorldlist = function(){
	dragonblocks.worlds = [];
	let allWorlds = $.getJSON({
		url: "api.php",
		method: "POST",
		data: {call: "getWorlds"}
	}).responseJSON;
	for(let world of allWorlds){
		if(dragonblocks.checkWorldOwnership(world))
			dragonblocks.worlds.push(world);
	}
}
dragonblocks.getEmptyWorld = function(){
	return {
		map:{
			content: Array(dragonblocks.settings.map.width).fill(Array(dragonblocks.settings.map.width).fill(new dragonblocks.MapNode("air"))),
			width: dragonblocks.settings.map.width,
			height: dragonblocks.settings.map.height,
			displayTop: dragonblocks.settings.map.height / 2,
			displayLeft: dragonblocks.settings.map.width / 2 - 5,
		},
		structures: {},
	};
}
