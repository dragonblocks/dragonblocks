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

			this.map = new dragonblocks.Map();

			this.player = new dragonblocks.Player(null, this.map);
			this.player.setGamemode(properties.gamemode);

			dragonblocks.mapgen.generate(properties.mapgen, this.map);
		}
	}

	serialize()
	{
		return {
			mods: this.mods,
			map: this.map.serialize(),
			player: this.player.serialize(),
		};
	}

	deserialize(data)
	{
		this.mods = data.mods;

		this.loadMods();

		this.map = new dragonblocks.Map(data.map);
		this.player = new dragonblocks.Player(data.player, this.map);
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
