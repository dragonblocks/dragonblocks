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
{
	dragonblocks = {};

	dragonblocks.backendCall = (call, plain, data) => {
		data = data || {};
		data.call = call;

		let fetchFunc = plain ? $.get : $.getJSON;

		let response = fetchFunc({
			url: "api.php",
			method: "POST",
			data: data,
		});

		return plain ? response.responseText : response.responseJSON;
	};

	dragonblocks.settings = $.getJSON("settings.json").responseJSON;

	let version = dragonblocks.version = $.getJSON("version.json").responseJSON;
	version.commit = version.development && (dragonblocks.backendCall("commitID", true) || "?");
	version.string = "Dragonblocks "
		+ version.major
		+ "." + version.minor
		+ (version.patch ? "." + version.patch : "")
		+ (version.development ? "-dev-" + version.commit : "");

	dragonblocks.isChromeApp = window.chrome && chrome.app;

	addEventListener("error", event => {
		if (confirm(event.message + "\nStack trace: \n" + event.error.stack + "\nPlease report this to the dragonblocks developers."))
			location.href = version.repo + "/issues/new?"
			+ "title=" + encodeURIComponent(event.message)
			+ "&body=" + encodeURIComponent(event.error.stack)
	});

	dragonblocks.backlog = "";

	dragonblocks.loadModList = _ => {
		dragonblocks.gamemods = dragonblocks.backendCall("getGamemods");
		dragonblocks.mods = dragonblocks.backendCall("getMods");
	};

	dragonblocks.loggedin = dragonblocks.backendCall("isLoggedin");
	dragonblocks.username = dragonblocks.loggedin ? dragonblocks.backendCall("getUsername", true) : "singleplayer";

	dragonblocks.log = text => {
		console.log("[Dragonblocks] " + text);
		dragonblocks.backlog += text + "\n";
	};

	dragonblocks.error = err => {
		let error = new Error(err);
		dragonblocks.backlog += error;

		throw error;
	};

	dragonblocks.getToken = _ => {
		return "#" + (Math.random() * 10).toString().replace(".", "");
	};

	dragonblocks.getModInfo = modname => {
		return dragonblocks.mods[modname] || dragonblocks.gamemods[modname];
	};

	dragonblocks.getModpath = modname => {
		return dragonblocks.getModInfo(modname).path;
	};

	let loadingMods = {};

	let loadMod = modname => {
		if (loadingMods[modname])
			dragonblocks.error("Circular Mod Dependencies: " + modname);

		if (dragonblocks.loadedMods[modname])
			return;

		let modinfo = dragonblocks.getModInfo(modname);

		if (! modinfo)
			dragonblocks.error("Unresolved Mod Dependencies: " + modname);

		loadingMods[modname] = true;

		for (let dependency of modinfo.dependencies)
			loadMod(dependency);

		$.getScript(modinfo.path + "/init.js");

		dragonblocks.loadedMods[modname] = modinfo;
		loadingMods[modname] = false;
	};

	dragonblocks.loadMods = selectedMods = _ => {
		dragonblocks.loadedMods = {};

		for (let mod in selectedMods)
			if (selectedMods[mod])
				loadMod(mod);

		for (let mod in dragonblocks.gamemods)
			loadMod(mod);
	};

	dragonblocks.start = worldProperties => {
		dragonblocks.log("Starting");

		for (let func of dragonblocks.onStartCallbacks)
			func();

		setTimeout(_ => {
			dragonblocks.world = new dragonblocks.World(worldProperties);
			dragonblocks.player = dragonblocks.world.player;

			for (let func of dragonblocks.onStartedCallbacks)
				func();
		});
	};

	dragonblocks.onStartCallbacks = [];
	dragonblocks.registerOnStart = func => {
		dragonblocks.onStartCallbacks.push(func);
	};

	dragonblocks.onStartedCallbacks = [];
	dragonblocks.registerOnStarted = func => {
		dragonblocks.onStartedCallbacks.push(func);
	};

	dragonblocks.quit = _ => {
		for (let func of dragonblocks.onQuitCallbacks)
			func();

		if (dragonblocks.loggedin)
			setTimeout(_ => {
				dragonblocks.player.despawn();
				dragonblocks.world.save();
				location.reload();
			});
		else
			location.reload();
	};

	dragonblocks.onQuitCallbacks = [];
	dragonblocks.registerOnQuit = func => {
		dragonblocks.onQuitCallbacks.push(func);
	};

	let modules = [
		"assets",
		"key_handler",
		"gui",
		"mapgen",
		"world",
		"item",
		"node",
		"tool",
		"group",
		"builtin",
		"map_node",
		"map_display",
		"map",
		"item_stack",
		"inventory",
		"out_stack",
		"inventory_group",
		"hudbar",
		"inventory_container",
		"creative_inventory",
		"recipe",
		"craftfield",
		"menu",
		"skin",
		"entity",
		"map_interaction",
		"spawned_entity",
		"item_entity",
		"falling_node",
		"timer",
		"player",
		"schematic",
		"chat",
		"chatcommands",
		"mainmenu",
	];

	let moduleCount = modules.length;

	let status = document.getElementById("elidragon.status");
	let loadbar = document.getElementById("elidragon.loadbar");

	let loadNextModuleRecursive = _ => {
		let nextModule = modules.shift();

		if (nextModule) {
			let filename = nextModule + ".js";
			status.innerHTML = filename;

			$.getScript({
				url: "engine/" + filename,
				async: true,
				cache: false,
				success: _ => {
					loadbar.style.width = (moduleCount - modules.length) / moduleCount * 100 + "%";
					loadNextModuleRecursive();
				},
			});
		}
	};

	loadNextModuleRecursive();
}
