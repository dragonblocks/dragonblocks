/*
 * inventory_group.js
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

dragonblocks.InventoryGroup = class
{
	constructor()
	{
		this.elements = [];
		this.opened = false;

		this.display = dragonblocks.addInventoryMenuDisplay(document.createElement("div"));
		this.display.style.position = "fixed";
		this.display.style.backgroundColor = "#535353";
		this.display.style.visibility = "hidden";
	}

	close()
	{
		this.opened = false;

		this.display.style.visibility = "hidden";
		dragonblocks.outStack.display.style.visibility = "hidden";

		this.onNextClose = this.onNextClose && this.onNextClose();
	}

	open()
	{
		this.opened = true;

		this.display.style.visibility = "inherit";
		dragonblocks.outStack.display.style.visibility = "visible";

		this.update();
	}

	toggle()
	{
		this.opened ? this.close() : this.open();
	}

	update()
	{
		let height = 0;
		let width = 0;

		for (let element of this.elements) {
			element.draw(this.display, 0, height);
			height += element.calculateHeight();
			width = Math.max(width, element.calculateWidth());
		}

		this.display.style.width = width + "px";
		this.display.style.height = height + "px";

		dblib.center(this.display);
		dblib.centerVertical(this.display);
	}

	setElements(elements)
	{
		for (let element of this.elements)
			element.remove();

		this.elements = elements;

		this.update();
	}
};
