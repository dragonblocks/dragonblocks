/*
 * assets.js
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

let loadAssets = type => {
	let obj = {};
	dragonblocks[type] = obj;

	let paths = dragonblocks.backendCall("get" + type[0].toUpperCase() + type.slice(1, type.length));
	for (path of paths) {
		let name = path.slice(path.lastIndexOf("/") + 1, path.length);
		obj[name] = path;
	}
};

loadAssets("textures");
loadAssets("sounds");

dragonblocks.getTexture = name => {
	if (! name)
		return "none";

	let path = dragonblocks.textures[name];

	return path ? "url(" + path + ")" : name;
};

dragonblocks.resolveTextures = elem => {
	if (elem.nodeName == "IMG" && elem.attributes["texture"]) {
		let name = elem.attributes["texture"].nodeValue;
		elem.src = dragonblocks.textures[name] || name;
	}

	for (let child of elem.children)
		dragonblocks.resolveTextures(child);
};

dragonblocks.getSound = name => {
	if(! name)
		return "";

	return dragonblocks.sounds[name] || name;
};

dragonblocks.playSound = name => {
	new Audio(dragonblocks.getSound(name)).play();
};
