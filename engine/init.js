/*
 * init.js
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
$.ajaxSetup({
	async: false,
	cache: false
});
addEventListener("contextmenu", event => {
	event.preventDefault();
});
dragonblocks = {};
dragonblocks.settings = $.getJSON("settings.json").responseJSON;
dragonblocks.backlog = "";
dragonblocks.mods = [];
dragonblocks.gamemods = $.getJSON({
	method: "POST",
	url: "api.php",
	data: {call: "getGamemods"},
}).responseJSON;
dragonblocks.availableMods = $.getJSON({
	method: "POST",
	url: "api.php",
	data: {call: "getMods"},
}).responseJSON;
dragonblocks.loggedin = $.getJSON({
	url: "api.php",
	method: "POST",
	data: {call: "isLoggedin"}
}).responseJSON;
dragonblocks.username = "singleplayer";
if(dragonblocks.loggedin){
	dragonblocks.username = $.post({
		url: "api.php",
		data: {call: "getUsername"}
	}).responseText;
}
dragonblocks.log = function(text){
	console.log("[Dragonblocks] " + text);
	dragonblocks.backlog += text + "\n";
} 
dragonblocks.error = function(err){
	let error = new Error(err);
	dragonblocks.backlog += error;
	throw error;
}
dragonblocks.getToken = function(){
	return "#" + (Math.random() * 10).toString().replace(".", "");
}
dragonblocks.getModpath = function(mod){
	if(dragonblocks.availableMods.indexOf(mod) != -1)
		return "mods/" + mod;
	if(dragonblocks.gamemods.indexOf(mod) != -1)
		return "game/" + mod;
}
dragonblocks.getVersion = function(){
	let version = dragonblocks.settings.version;
	return "Dragonblocks " + version.major + "." + version.minor + (version.patch ? "." + version.patch : "") + (version.snapshot ? "-dev-" + version.snapshot : "");
}
dragonblocks.start = function(){
	for(let func of dragonblocks.onStartFunctions)
		func();
	setTimeout(_ => {
		for(let mod of dragonblocks.gamemods)
			dragonblocks.loadMod(mod);
		for(let mod of dragonblocks.mods)
			dragonblocks.loadMod(mod);
		new dragonblocks.Map();
		new dragonblocks.Player();
		if(! dragonblocks.worldIsLoaded)
			dragonblocks.generateMap();
		for(let func of dragonblocks.onStartedFunctions)
			func();
	});
}
dragonblocks.onStartFunctions = [];
dragonblocks.registerOnStart = function(func){
	dragonblocks.onStartFunctions.push(func);
}
dragonblocks.onStartedFunctions = [];
dragonblocks.registerOnStarted = function(func){
	dragonblocks.onStartedFunctions.push(func);
}
dragonblocks.addFinalStep = function(step){
	dragonblocks.registerOnStarted(step);
	dragonblocks.log("dragonblocks.addFinalStep(...) is deprecated. Use dragonblocks.registerOnStarted instead. Trace:");
	console.trace();
}
dragonblocks.quit = function(){
	for(let func of dragonblocks.onQuitFunctions)
		func();
	if(dragonblocks.loggedin)
		setTimeout(_ => {
			dragonblocks.save();
			location.reload();
		});
	else
		location.reload();
}
dragonblocks.onQuitFunctions = [];
dragonblocks.registerOnQuit = function(func){
	dragonblocks.onQuitFunctions.push(func);
}
dragonblocks.loadWorld = function(world){
	dragonblocks.worldIsLoaded = true;
	dragonblocks.worldname = world;
	dragonblocks.world = $.getJSON("worlds/" + world + "/world.json").responseJSON;
	dragonblocks.mods = dragonblocks.world.mods;
	dragonblocks.start();
}
dragonblocks.createWorld = function(properties){
	dragonblocks.worldIsLoaded = false;
	dragonblocks.worldname = properties.worldname;
	dragonblocks.world = dragonblocks.getEmptyWorld();
	dragonblocks.entities["dragonblocks:player"].meta.creative = (properties.gamemode == "creative");
	for(mod in properties.mods)
		properties.mods[mod] && dragonblocks.mods.push(mod);
	dragonblocks.mapgen.selected = properties.mapgen;
	dragonblocks.start();
}
dragonblocks.loadedMods = [];
dragonblocks.loadingMods = {};
dragonblocks.loadMod = function(modname){
	if(! modname)
		return;
	if(dragonblocks.loadingMods[modname])
		dragonblocks.error("Circular Mod Dependencies: " + modname);
	if(dragonblocks.loadedMods.indexOf(modname) != -1)
		return;
	if(dragonblocks.gamemods.indexOf(modname) != -1)
		var modpath = "game/" + modname;
	else if(dragonblocks.availableMods.indexOf(modname) != -1)
		var modpath = "mods/" + modname;
	else
		dragonblocks.error("Unsolved Mod Dependencies: " + modname);
	let dependencyRequest = $.get(modpath + "/dependencies.txt");
	if(dependencyRequest.status == 200){
		let dependencies = dependencyRequest.responseText.split("\n");
		for(let dependency of dependencies)
			dragonblocks.loadMod(dependency);
	}
	$.getScript(modpath + "/init.js");
	dragonblocks.loadedMods.push(modname);
	dragonblocks.loadingMods[modname] = false;
}
dragonblocks.modules = ["ressources", "key_handler", "gui", "mapgen", "world", "item", "node", "tool", "group", "builtin", "map_node", "map", "itemstack", "inventory", "inventory_group", "hudbar", "inventory_container", "creative_inventory", "recipe", "craftfield", "menu", "skin", "entity", "map_interaction", "spawned_entity", "item_entity", "falling_node", "timer", "player", "pixel_manipulator", "chat", "chatcommands", "mainmenu"];
dragonblocks.moduleCount = dragonblocks.modules.length;
dragonblocks.loadModule = function(){
	if(dragonblocks.modules[0]){
		document.getElementById("elidragon.status").innerHTML = dragonblocks.modules[0] + ".js";
		$.getScript({
			url: "engine/" + dragonblocks.modules.shift() + ".js",
			async: true,
			success: _ => {
				document.getElementById("elidragon.loadbar").style.width = (dragonblocks.moduleCount - dragonblocks.modules.length) / dragonblocks.moduleCount * 100 + "%";
				dragonblocks.loadModule();
			},
		});
	}
}
dragonblocks.loadModule();
