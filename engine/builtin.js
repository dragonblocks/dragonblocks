/*
 * builtin.js
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

dragonblocks.registerNode({
	name: "air",
	texture: "none",
	stable: false,
	hidden: true,
	hardness: 1,
	zIndex: -1,
	ondig: _ => {
		return false;
	}
});

dragonblocks.registerGroup({
	name: "default",
	sounds: {
		dig: "sounds/dig.ogg",
		dug: "sounds/dug.ogg",
		place: "sounds/place.ogg",
	}
});

dragonblocks.registerGroup({
	name: "cracky",
	sounds: {
		dig: "sounds/dig_cracky.ogg",
	}
});

dragonblocks.registerGroup({
	name: "crumbly",
	sounds: {
		dig: "sounds/dig_crumbly.ogg",
	}
});

dragonblocks.registerGroup({
	name: "snappy",
	sounds: {
		dig: "sounds/dig_snappy.ogg",
	}
});

dragonblocks.registerGroup({
	name: "choppy",
	sounds: {
		dig: "sounds/dig_choppy.ogg",
	}
});

dragonblocks.registerGroup({
	name: "liquid",
	sounds: {
		dig: "",
		dug: "",
		place: "",
	}
});
