/*
 * mainmenu.js
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
dragonblocks.mainmenu = {};
dragonblocks.registerOnStart(_ => {
	document.getElementById("dragonblocks.mainmenu.content").innerHTML = "<h1 style='font-size:50px'>Loading...</h1>";
});
dragonblocks.registerOnStarted(_ => {
	document.getElementById("dragonblocks.mainmenu").style.visibility = "hidden";
});
dragonblocks.registerOnQuit(_ => {
	document.getElementById("dragonblocks.mainmenu").style.visibility = "visible";
	document.getElementById("dragonblocks.mainmenu.content").innerHTML = "<h1 style='font-size:50px'>Saving...</h1>";
});
{
	let mainmenu = document.body.insertBefore(document.createElement("div"), document.body.firstChild);
	mainmenu.id = "dragonblocks.mainmenu";
	mainmenu.style.visibility = "hidden";
	let center = mainmenu.appendChild(document.createElement("center"));
	let img = center.appendChild(document.createElement("img"));
	img.src = "textures/logo-mainmenu.png";
	let content = center.appendChild(document.createElement("div"));
	content.id = "dragonblocks.mainmenu.content";
	content.style.position = "relative";
	content.style.top = "50px";
	let buttons = [
		{
			text: "Load Saved World",
			action: _ => { dragonblocks.mainmenu.loadWorldGUI.open() },
			disabled: ! dragonblocks.loggedin,
		},
		{
			text: "Create New World", 
			action: _ => { dragonblocks.mainmenu.createWorldGUI.open() }
		},
		{
			text: "Credits", 
			action: _ => { dragonblocks.mainmenu.creditsGUI.open() }
		},
		{
			text: "Quit", 
			action: _ => { history.back() }
		}
	];
	for(let {text: text, action: action, disabled: disabled} of buttons){
		let button = content.appendChild(document.createElement("button"));
		button.style.fontSize = "40px";
		button.style.width = "100%";
		button.innerHTML = text;
		button.disabled = disabled;
		button.addEventListener("click", action);
		content.appendChild(document.createElement("br"));
		content.appendChild(document.createElement("br"));
	}
	for(let {text: text, side: side} of [{side: "left", text: dragonblocks.getVersion()}, {side: "right", text: dragonblocks.settings.version.copyright}]){
		let span = content.appendChild(document.createElement("span"));
		span.style.position = "fixed";
		span.style.bottom = "5px";
		span.style[side] = "5px";
		span.innerHTML = text;
	}
	document.title = dragonblocks.getVersion();
	img.addEventListener("load", _ => {
		document.body.style.backgroundColor = "skyblue";
		document.getElementById("elidragon").style.display = "none";
		content.style.width = img.offsetWidth + "px";
		mainmenu.style.visibility = "visible";
	});
}
if(dragonblocks.loggedin){
	dragonblocks.loadWorldlist();
	let gui = dragonblocks.mainmenu.loadWorldGUI = dragonblocks.gui.createBox();
	let headline = gui.create("h1");
	headline.innerHTML = "Select World";
	headline.align = "center";
	let worldlist = gui.create("ul");
	for(let world of dragonblocks.worlds){
		let worldDisplay = worldlist.appendChild(document.createElement("li"));
		worldDisplay.style.fontSize = "20px";
		worldDisplay.textContent = world;
		worldDisplay.style.postion = "relative";
		let button = worldDisplay.appendChild(document.createElement("button"));
		button.textContent = "Play";
		button.style.position = "absolute";
		button.style.right = "5px";
		button.style.fontSize = "12px";
		button.addEventListener("click", event => {
			event.srcElement.blur();
			gui.close();
			dragonblocks.loadWorld(world);
		});
	}
}
{	
	let gui = dragonblocks.mainmenu.createWorldGUI = dragonblocks.gui.createBox();
	let properties = {};
	let headline = gui.create("h1");
	headline.innerHTML = "New World";
	headline.align = "center";
	// Worldname
	gui.create("h2").innerHTML = "&ensp;World Name";
	let worldnameInput = gui.create("input");
	worldnameInput.type = "text";
	worldnameInput.style.position = "relative";
	worldnameInput.style.left = "40px";
	let worldnameAlert = gui.create("b");
	worldnameAlert.style.position = "relative";
	worldnameAlert.style.left = "50px";
	// Mods
	properties.mods = {};
	gui.create("h2").innerHTML = "&ensp;Mods";
	let modlist = gui.create("ul");
	for(let mod of dragonblocks.availableMods){
		let modDisplay = modlist.appendChild(document.createElement("li"));
		modDisplay.style.fontSize = "20px";
		modDisplay.innerHTML = mod;
		modDisplay.style.postion = "relative";
		$.get({
			url: "mods/" + mod + "/description.txt",
			success: data => {
				modDisplay.title = data;
			}
		});
		let checkbox = modDisplay.appendChild(document.createElement("input"));
		checkbox.type = "checkbox";
		checkbox.style.position = "absolute";
		checkbox.style.right = "5px";
		checkbox.addEventListener("input", _ => { properties.mods[mod] = checkbox.checked });
	}
	// Gamemode
	properties.gamemode = "creative";
	gui.create("h2").innerHTML = "&ensp;Gamemode";
	for(let gamemode of ["survival", "creative"]){
		let radiobox = gui.create("input");
		radiobox.name = "dragonblocks.mainmenu.createWorldGUI.gamemode";
		radiobox.type = "radio";
		radiobox.checked = (gamemode == properties.gamemode);
		radiobox.style.position = "relative";
		radiobox.style.left = "40px";
		radiobox.addEventListener("input", _ => {
			if(radiobox.checked)
				properties.gamemode = gamemode;
		});
		let label = gui.create("label");
		label.innerHTML = dblib.humanFormat(gamemode);
		label.for = radiobox.id;
		label.style.position = "relative";
		label.style.left = "40px";
	}
	// Mapgen
	gui.create("h2").innerHTML = "&ensp;Mapgen";
	let selectMapgen = gui.create("select");
	selectMapgen.style.position = "relative";
	selectMapgen.style.left = "40px";
	selectMapgen.addEventListener("input", _ => {
		properties.mapgen = selectMapgen.value;
	});
	for(let mapgen in dragonblocks.mapgen.list)
		selectMapgen.appendChild(document.createElement("option")).innerHTML = mapgen;
	properties.mapgen = selectMapgen.value;
	gui.create("br");
	gui.create("br");
	// Button
	let button = gui.create("button");
	button.style.position = "relative";
	button.style.left = "1%";
	button.style.width = "98%";
	button.innerHTML = "Create World";
	if(dragonblocks.loggedin)
		button.disabled = true;
	button.addEventListener("click", event => {
		event.srcElement.blur();
		gui.close();
		dragonblocks.createWorld(properties);
	});
	gui.create("br");
	gui.create("br");
	// World Name Check
	worldnameInput.addEventListener("input", _ => {
		if(! dragonblocks.loggedin){
			worldnameAlert.textContent = "You are not logged in and can not save worlds.";
			worldnameAlert.style.color = "#FF7D00";
			button.disabled = false;
		}
		else if(worldnameInput.value == ""){
			worldnameAlert.textContent = "";
			button.disabled = true;
		}
		else if(! dragonblocks.checkWorldSpelling(worldnameInput.value)){
			worldnameAlert.textContent = "This Worldname contains forbidden characters";
			worldnameAlert.style.color = "#FF001F";
			button.disabled = true;
		}
		else if(dragonblocks.checkWorldExistance(worldnameInput.value)){
			if(dragonblocks.checkWorldOwnership(worldnameInput.value)){
				worldnameAlert.textContent = "This will overwrite an existing world";
				worldnameAlert.style.color = "#FF7D00";
				button.disabled = false;
			}
			else{
				worldnameAlert.textContent = "This Worldname is taken";
				worldnameAlert.style.color = "#FF001F";
				button.disabled = true;
			}
		}
		else{
			worldnameAlert.textContent = "";
			button.disabled = false;
		}
		properties.worldname = worldnameInput.value;
	});	
}
{
	let gui = dragonblocks.mainmenu.creditsGUI = dragonblocks.gui.createBox();
	let properties = {
		content: $.getJSON("credits.json").responseJSON,
		stage: 0,
	};
	for(let dir of ["left", "right"]){
		let arrow = gui.create("div");
		arrow.style.position = "absolute";
		arrow.style.width = "80px";
		arrow.style.height = "80px";
		arrow.style.position = "absolute";
		arrow.style[dir] = "3px";
		arrow.style.background = dragonblocks.getTexture("arrow.png");
		arrow.style.backgroundSize = "cover";
		arrow.style.cursor = "pointer";
		if(dir == "right")
			arrow.style.transform = "rotate(180deg)";
		arrow.addEventListener("click", _ => {
			if(dir == "right")
				properties.stage++;
			else
				properties.stage--;
			gui.open();
		});
		dblib.centerVertical(arrow);
	}
	let content = gui.create("center");
	gui.onopen = _ => {
		if(properties.stage < 0)
			properties.stage = properties.content.length - 1;
		if(!properties.content[properties.stage])
			properties.stage = 0;
		content.innerHTML = properties.content[properties.stage];
		dragonblocks.resolveTextures(content);
	}
}
