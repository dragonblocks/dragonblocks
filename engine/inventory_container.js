/*
 * inventory_container.js
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

dragonblocks.InventoryContainer = class extends EventTarget
{
	constructor(def)
	{
		super();
		dblib.copySimple(this, def);
	}

	draw(parent, x, y)
	{
		if (! this.display)
			this.initGraphics();

		if (this.display.parentElement != parent)
			this.display = parent.appendChild(this.display);

		this.display.style.left = x + "px";
		this.display.style.top = y + "px";

		this.inventory.draw(this.display, dragonblocks.settings.inventory.scale * 1.1 * this.left, dragonblocks.settings.inventory.scale * 1.1 * this.top);
	}

	remove()
	{
		this.display.remove();
	}

	calculateWidth()
	{
		return this.inventory.calculateWidth() + dragonblocks.settings.inventory.scale * 1.1 * (this.left + this.right);
	}

	calculateHeight()
	{
		return this.inventory.calculateHeight() + dragonblocks.settings.inventory.scale * 1.1 * (this.top + this.bottom);
	}

	initGraphics()
	{
		this.display = document.createElement("div");
		this.display.style.width = this.calculateWidth() + "px";
		this.display.style.height = this.calculateHeight() + "px";
	}
};
