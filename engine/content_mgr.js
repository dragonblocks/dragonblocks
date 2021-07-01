/*
 * content_mgr.js
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

dragonblocks.ContentMgr = class
{
	constructor(baseClass)
	{
		this.baseClass = baseClass;
		this.clear();
	}

	register(name, defClass, override)
	{
		if (! name)
			throw new Error("Missing name");

		if (! name.search(":"))
			throw new Error("Non-namespaced name");

		if (! defClass)
			throw new Error("Missing definition class");

		if (! (defClass.prototype instanceof this.baseClass))
			throw new Error("Definition class does not extend base class");

		let oldDef = this.getDef(name);

		if (oldDef && ! override)
			throw new Error("Already registered");

		if (! oldDef && override)
			throw new Error("Not registered");

		this.defs[name] = defClass;
	}

	override(name, def)
	{
		this.register(name, def, true);
	}

	getDef(name)
	{
		return this.defs[name];
	}

	create(name, ...args)
	{
		let defClass = this.getDef(name);

		if (! defClass)
			throw new Error("Not defined");

		return new defClass(...args);
	}

	clear()
	{
		this.defs = {};
	}
};
