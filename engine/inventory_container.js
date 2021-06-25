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
		if (this.display) {
			let display = this.getDisplay();
			if (display.parentElement == parent) {
				display.style.left = x + "px";
				display.style.top = y + "px";
				return false;
			} else {
				this.remove();
			}
		}

		let display = parent.appendChild(document.createElement("div"));
		display.id = "dragonblocks.inventoryContainer[" + this.inventory.id + "]";
		display.style.width = this.calculateWidth() + "px";
		display.style.height = this.calculateHeight() + "px";
		display.style.left = x + "px";
		display.style.top = y + "px";

		this.inventory.draw(display, dragonblocks.settings.inventory.scale * 1.1 * this.left, dragonblocks.settings.inventory.scale * 1.1 * this.top);

		this.display = true;
		return true;
	}

	serialize()
	{
		return this.inventory.serialize();
	}

	deserialize(str)
	{
		this.inventory.deserialize(str);
	}

	remove()
	{
		this.getDisplay().remove();
	}

	show()
	{
		this.getDisplay().style.visibility = "inherit";
		this.update();
	}

	hide()
	{
		this.getDisplay().style.visibility = "hidden";
	}

	calculateWidth()
	{
		return this.inventory.calculateWidth() + dragonblocks.settings.inventory.scale * 1.1 * (this.left + this.right);
	}

	calculateHeight()
	{
		return this.inventory.calculateHeight() + dragonblocks.settings.inventory.scale * 1.1 * (this.top + this.bottom);
	}

	getDisplay()
	{
		return document.getElementById("dragonblocks.inventoryContainer[" + this.inventory.id + "]");
	}

	update()
	{
		this.inventory.update();
	}
};
