/*
 * entity.js
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

dragonblocks.Entity = class
{
	constructor(def)
	{
		dblib.copy(this, def);

		dragonblocks.entities[this.name] = this;
		dragonblocks.registeredEntities.push(this);
	}

	spawn(x, y)
	{
		return new dragonblocks.SpawnedEntity(this, x, y);
	}
};

dragonblocks.entities = {};
dragonblocks.registeredEntities = [];

dragonblocks.registerEntity = def => {
	new dragonblocks.Entity(def);
};

dragonblocks.spawnEntity = (name, x, y) => {
	let def = dragonblocks.entities[name];

	if (def)
		return def.spawn(x, y);
};
