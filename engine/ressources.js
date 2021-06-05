/*
 * ressources.js
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
dragonblocks.Texture = class{
	constructor(path){
		this.name = path.slice(path.lastIndexOf("/") + 1, path.length);
		this.path = path;
		dragonblocks.textures[this.name] = this;
	}
}
dragonblocks.textures = {};
dragonblocks.loadTexture = function(path){
	new dragonblocks.Texture(path);
};
{
	let textures = $.getJSON({
		url: "api.php",
		method: "POST",
		data: {call: "getTextures"}
	}).responseJSON;
	for(let i in textures)
		dragonblocks.loadTexture(textures[i]);
}
dragonblocks.getTexture = function(texture){
	if(! texture)
		return "none";
	if(dragonblocks.textures[texture])
		return "url(" + dragonblocks.textures[texture].path + ")";
	else
		return texture;
};
dragonblocks.resolveTextures = function(elem){
	if(elem.nodeName == "IMG" && elem.attributes["texture"]){
		let texture = elem.attributes["texture"].nodeValue;
		elem.src = dragonblocks.textures[texture] ? dragonblocks.textures[texture].path : texture;
	}
	for(let child of elem.children)
		dragonblocks.resolveTextures(child);
}
dragonblocks.Sound = class{
	constructor(path){
		this.name = path.slice(path.lastIndexOf("/") + 1, path.length);
		this.path = path;
		dragonblocks.sounds[this.name] = this;
	}
}
dragonblocks.sounds = {};
dragonblocks.loadSound = function(path){
	new dragonblocks.Sound(path);
};
dragonblocks.getSound = function(sound){
	if(! sound)
			return "";
	if(dragonblocks.sounds[sound])
		return dragonblocks.sounds[sound].path;
	else
		return sound;
};
{
	let sounds = $.getJSON({
		url: "api.php",
		method: "POST",
		data: {call: "getSounds"}
	}).responseJSON;
	for(let i in sounds)
		dragonblocks.loadSound(sounds[i]);
}
dragonblocks.playSound = function(sound){
	new Audio(dragonblocks.getSound(sound)).play();
}
