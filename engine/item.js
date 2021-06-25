/*
 * item.js
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

dragonblocks.Item = class
{
	constructor(def)
	{
		def || dragonblocks.error("Cannot register item: Missing argument");

		dblib.copy(this, def);

		this.name || dragonblocks.error("Cannot register item: Missing name");
		this.texture ||	dragonblocks.error("Cannot register item: Missing texture");
		dragonblocks.items[this.name] && dragonblocks.error("Cannot register item '" + this.name + "': Item already exists");

		if (this.desc != "" && this.description != "")
			this.desc = this.description || this.desc || this.name;

		this.stacksize = this.stacksize || dragonblocks.settings.item.defaultStacksize;

		this.groups = this.groups || [];
		this.groups.push("default");

		dragonblocks.items[this.name] = this;
		dragonblocks.registeredItems.push(this);
	}

	inGroup(name)
	{
		return this.groups.includes(name);
	}

	playSound(s)
	{
		let sound = this.sounds && this.sounds[s];

		if (sound == "")
			return;

		if (sound) {
			dragonblocks.playSound(sound);
		} else {
			for (let groupname of this.groups){
				let group = dragonblocks.groups[groupname];
				let sound = group && group.sounds && group.sounds[s];

				if (sound == "")
					return;

				if (sound) {
					dragonblocks.playSound(sound);
					return;
				}
			}
		}
	}
};

dragonblocks.registeredItems = [];
dragonblocks.items = {};

dragonblocks.registerItem = def => {
	new dragonblocks.Item(def);
};

dragonblocks.onUseItemCallbacks = [];
dragonblocks.registerOnUseItem = func => {
	dragonblocks.onUseItemCallbacks.push(func);
};

dragonblocks.itemMatch = (item1, item2) => {
	item1 = dragonblocks.items[item1] || dragonblocks.groups[item1] || item1;
	item2 = dragonblocks.items[item2] || dragonblocks.groups[item2] || item2;
	return item1 == item2 || item1 && item2 && (item1.name == item2.name || item1.inGroup && item1.inGroup(item2.name) || item2.inGroup && item2.inGroup(item1.name));
};
