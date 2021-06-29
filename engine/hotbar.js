/*
 * hotbar.js
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

dragonblocks.Hotbar = class
{
	constructor(inventory, slots)
	{
		this.inventory = inventory;
		this.slots = slots;

		this.selectedSlot = 0;

		this.display = document.body.insertBefore(document.createElement("div"), dragonblocks.mapDisplay.element.nextSibling);
		this.display.style.position = "fixed";
		this.display.style.bottom = "5px";
		this.display.style.height = "60px";
		this.display.style.width = "445px";

		dblib.center(this.display);

		this.slotDisplays = [];

		for (let i = 0; i < this.slots; i++) {
			let slotDisplay = this.display.appendChild(document.createElement("div"));
			slotDisplay.style.position = "absolute";
			slotDisplay.style.top = "3px";
			slotDisplay.style.left = i * 53 + "px";
			slotDisplay.style.width = "50px";
			slotDisplay.style.height = "50px";
			slotDisplay.style.boxShadow = "0 0 0 3px #C5C5C5";

			let slotCountDisplay = slotDisplay.appendChild(document.createElement("span"));
			slotCountDisplay.style.position = "absolute";
			slotCountDisplay.style.right = "5px";
			slotCountDisplay.style.bottom = "5px";
			slotCountDisplay.style.color = "white";

			this.slotDisplays[i] = {slotDisplay, slotCountDisplay};
		}

		this.selectorDisplay = this.display.appendChild(document.createElement("div"));
		this.selectorDisplay.style.position = "absolute";
		this.selectorDisplay.style.top = "3px";
		this.selectorDisplay.style.width = "50px";
		this.selectorDisplay.style.height = "50px";
		this.selectorDisplay.style.boxShadow = "0 0 0 5px #999999";

		this.itemnameDisplay = this.display.appendChild(document.createElement("span"));
		this.itemnameDisplay.style.position = "absolute";
		this.itemnameDisplay.style.bottom = "60px";
		this.itemnameDisplay.style.color = "white";
		this.itemnameDisplay.style.fontSize = "20px";

		this.update();
	}

	nextItem()
	{
		if (++this.selectedSlot == this.slots)
			this.selectedSlot = 0;

		this.update();
	}

	previousItem()
	{
		if (--this.selectedSlot == -1)
			this.selectedSlot = this.slots - 1;

		this.update();
	}

	select(i)
	{
		this.selectedSlot = i;
		this.update();
	}

	update()
	{
		for (let i = 0; i < this.slots; i++) {
			let itemstack = this.inventory.getSlot(i);
			let {slotDisplay, slotCountDisplay} = this.slotDisplays[i];

			slotDisplay.style.background = itemstack.item && dragonblocks.getTexture(itemstack.toItem().texture);
			if (! slotDisplay.style.backgroundColor || slotDisplay.style.backgroundColor == "initial")
				slotDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
			slotDisplay.style.backgroundSize = "cover";

			slotCountDisplay.innerHTML = (itemstack.count <= 1) ? "" : itemstack.count;

			if (i == this.selectedSlot) {
				this.selectorDisplay.style.left = slotDisplay.style.left;

				this.itemnameDisplay.innerHTML = itemstack.item ? itemstack.toItem().desc : "";
				dblib.center(this.itemnameDisplay);
			}
		}
	}

	getSelectedItem()
	{
		return this.inventory.getSlot(this.selectedSlot);
	}
};
