/*
 * skin.js
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

dragonblocks.registeredSkins = {};

dragonblocks.registerSkin = def => {
	if (! def || ! def.name || ! def.texture)
		dragonblocks.error("Cannot register skin");

	dragonblocks.registeredSkins[def.name] = def;
};

{
	let gui = new dragonblocks.gui.Box({keylock: true});

	let headline = gui.create("h1");
	headline.innerHTML = "Skins";
	headline.align = "center";

	let status = gui.create("span");
	status.style.position = "absolute";
	status.style.top = "5px";
	status.style.left = "5px";

	let columns = parseInt(parseInt(gui.display.style.width) / (dragonblocks.settings.mapDisplay.scale * 1.5));

	let container = gui.create("div");
	container.style.width = parseInt(columns * dragonblocks.settings.mapDisplay.scale * 1.5) + "px";
	container.style.position = "absolute";
	container.style.top = "80px";
	dblib.center(container);

	dragonblocks.registerOnStarted(_ => {
		status.innerHTML = dragonblocks.player.skin;

		let i = 0;

		for (let skin in dragonblocks.registeredSkins) {
			let x = i % columns;
			let y = (i - x) / columns;

			i++;

			let def = dragonblocks.registeredSkins[skin];

			let skinDisplay = container.appendChild(document.createElement("div"));
			skinDisplay.style.position = "absolute";
			skinDisplay.style.left = parseInt(x * dragonblocks.settings.map.scale * 1.5) + "px";
			skinDisplay.style.top = parseInt(y * dragonblocks.settings.map.scale * 2 * 1.5) + "px";
			skinDisplay.style.width = parseInt(dragonblocks.settings.map.scale) + "px";
			skinDisplay.style.height = parseInt(dragonblocks.settings.map.scale * 2) + "px";
			skinDisplay.style.background = dragonblocks.getTexture(def.texture);
			skinDisplay.title = def.name + (def.desc ? "\n" + def.desc : "");

			if (dragonblocks.player.skin == def.name)
				skinDisplay.style.boxShadow = "0 0 0 3px #BEBEBE";

			skinDisplay.addEventListener("click", event => {
				event.srcElement.style.boxShadow = "0 0 0 3px #BEBEBE";

				dragonblocks.player.skin = def.name;
				status.innerHTML = dragonblocks.player.skin;

				container.dispatchEvent(new Event("update"));
			});

			container.addEventListener("update", event => {
				if (dragonblocks.player.skin != def.name)
					skinDisplay.style.boxShadow = "none";
			});

			skinDisplay.addEventListener("mouseover", event => {
				if (dragonblocks.player.skin != def.name)
					event.srcElement.style.boxShadow = "0 0 0 1px black";
			});

			skinDisplay.addEventListener("mouseleave", event => {
				if (dragonblocks.player.skin != def.name)
					event.srcElement.style.boxShadow = "none";
			});
		}
	});

	dragonblocks.menu.addButton("Change Skin", _ => {
		gui.open();
	});
}
