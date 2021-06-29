/*
 * hudbar.js
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

dragonblocks.Hudbar = class
{
	constructor(inventory, slots)
	{
		this.id = dragonblocks.getToken();

		this.inventory = inventory;
		this.slots = slots;

		this.selectedSlot = 0;

		let display = document.body.insertBefore(document.createElement("div"), dragonblocks.mapDisplay.element.nextSibling);
		display.id = "dragonblocks.hudbar[" + this.id + "]";
		display.style.position = "fixed";
		display.style.bottom = "5px";
		display.style.height = "60px";
		display.style.width = "445px";

		dblib.center(display);

		for (let i = 0; i < this.slots; i++) {
			let slotDisplay = display.appendChild(document.createElement("div"));
			slotDisplay.id = "dragonblocks.hudbar[" + this.id + "].slot[" + i + "]";
			slotDisplay.style.position = "absolute";
			slotDisplay.style.top = "3px";
			slotDisplay.style.left = i * 53 + "px";
			slotDisplay.style.width = "50px";
			slotDisplay.style.height = "50px";
			slotDisplay.style.backgroundColor = "black";
			slotDisplay.style.boxShadow = "0 0 0 3px #C5C5C5";

			let slotCountDisplay = slotDisplay.appendChild(document.createElement("span"));
			slotCountDisplay.id = slotDisplay.id + ".count";
			slotCountDisplay.style.position = "absolute";
			slotCountDisplay.style.right = "5px";
			slotCountDisplay.style.bottom = "5px";
			slotCountDisplay.style.color = "white";
		}

		let selectorDisplay = display.appendChild(document.createElement("div"));
		selectorDisplay.id = "dragonblocks.hudbar[" + this.id + "].selector";
		selectorDisplay.style.position = "absolute";
		selectorDisplay.style.top = "3px";
		selectorDisplay.style.width = "50px";
		selectorDisplay.style.height = "50px";
		selectorDisplay.style.boxShadow = "0 0 0 5px #999999";

		let itemnameDisplay = display.appendChild(document.createElement("span"));
		itemnameDisplay.id = "dragonblocks.hudbar[" + this.id + "].itemname";
		itemnameDisplay.style.position = "absolute";
		itemnameDisplay.style.bottom = "60px";
		itemnameDisplay.style.color = "white";
		itemnameDisplay.style.fontSize = "20px";

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
		let display = document.getElementById("dragonblocks.hudbar[" + this.id + "]");

		if (! display)
			return;

		for (let i = 0; i < this.slots; i++) {
			let itemstack = this.inventory.getSlot(i);

			let slotDisplay = document.getElementById("dragonblocks.hudbar[" + this.id + "].slot[" + i + "]");
			slotDisplay.style.background = itemstack.item ? dragonblocks.getTexture(itemstack.toItem().texture) : "black";
			slotDisplay.style.backgroundSize = "cover";
			slotDisplay.style.opacity = itemstack.item ? 1 : 0.3;

			document.getElementById(slotDisplay.id + ".count").innerHTML = (itemstack.count <= 1) ? "" : itemstack.count;

			if (i == this.selectedSlot) {
				document.getElementById("dragonblocks.hudbar[" + this.id + "].selector").style.left = slotDisplay.style.left;

				let itemname_elem = document.getElementById("dragonblocks.hudbar[" + this.id + "].itemname");
				itemname_elem.innerHTML = itemstack.item ? itemstack.toItem().desc : "";
				dblib.center(itemname_elem);
			}
		}
	}

	getSelectedItem()
	{
		return this.inventory.getSlot(this.selectedSlot);
	}
};
