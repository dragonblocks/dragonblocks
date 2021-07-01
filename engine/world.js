/*
 * world.js
 *
 * Copyright 2021 Elias Fleckenstein <eliasfleckenstein@web.de>
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

dragonblocks.World = class
{
	constructor(properties)
	{
		this.name = properties.name;
		this.isLoaded = properties.isLoaded;

		if (this.isLoaded) {
			this.load();
		} else {
			this.mods = properties.mods;
			this.loadMods();

			this.maps = {};
			this.mapgen = properties.mapgen;
			this.loadMaps({});

			this.player = new dragonblocks.Player(null, this.maps["dragonblocks:map"]);
			this.player.setGamemode(properties.gamemode);
		}
	}

	serialize()
	{
		let data = {
			mods: this.mods,
			player: this.player.serialize(),
			maps: {},
			mapgen: this.mapgen,
		};

		for (let name in this.maps)
			data.maps[name] = this.maps[name].serialize();

		return data;
	}

	deserialize(data)
	{
		this.mods = data.mods;
		this.loadMods();

		this.maps = {};
		this.mapgen = data.mapgen;
		this.loadMaps(data.maps);

		this.player = new dragonblocks.Player(data.player, this.maps["dragonblocks:map"]);
	}

	save()
	{
		if (dragonblocks.loggedin)
			return dragonblocks.backendCall("saveWorld", true, {name: this.name, world: JSON.stringify(this.serialize())});
	}

	load()
	{
		this.deserialize($.getJSON("worlds/" + this.name + "/world.json").responseJSON);
	}

	loadMods()
	{
		dragonblocks.loadMods(this.mods);
	}

	loadMaps(data)
	{
		for (let name in dragonblocks.mapMgr.defs)
			this.maps[name] = dragonblocks.mapMgr.create(name, data[name], this.mapgen);
	}
};

dragonblocks.World.Properties = class
{
	constructor(isLoaded)
	{
		this.name = "";
		this.isLoaded = isLoaded;

		if (! isLoaded) {
			this.mods = [];

			this.gamemode = dragonblocks.settings.defaultWorldOptions.gamemode;
			this.mapgen = dragonblocks.settings.defaultWorldOptions.mapgen;
		}
	}

	checkSpelling()
	{
		return this.name.match(/^[a-zA-Z0-9]+$/);
	}
};
