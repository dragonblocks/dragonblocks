/*
 * inventory.js
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

dragonblocks.Inventory = class extends EventTarget
{
	constructor(slots, columns)
	{
		super();
		this.id = dragonblocks.getToken();

		this.slots = slots;
		this.columns = columns;
		this.list = [];

		let self = this;

		for (let i = 0; i < this.slots; i++){
			let stack = this.list[i] = new dragonblocks.ItemStack();
			stack.addEventListener("update", event => {
				self.dispatchEvent(new dragonblocks.Inventory.Event("updateStack", event.stack));
			});
		}

		this.display = false;
	}

	serialize()
	{
		let str = "";

		for (let stack of this.list)
			str += stack.serialize() + ",";

		return str;
	}

	deserialize(str)
	{
		let strList = str.split(",");

		for (let i in this.list)
			this.list[i].deserialize(strList[i]);
	}

	add(itemstring)
	{
		let itemstack = new dragonblocks.ItemStack(itemstring);

		for (let stack of this.list)
			stack.item == itemstack.item && stack.add(itemstack);

		for (let stack of this.list)
			stack.add(itemstack);

		return itemstack;
	}

	isEmpty()
	{
		for (let stack of this.list)
			if (stack.item)
				return false;

		return true;
	}

	clear()
	{
		for(let stack of this.list)
			stack.clear();
	}

	calculateWidth(columns)
	{
		return dragonblocks.settings.inventory.scale * 1.1 * this.columns + (dragonblocks.settings.inventory.scale * 0.1);
	}

	calculateHeight()
	{
		return dragonblocks.settings.inventory.scale * 1.1 * Math.ceil(this.slots / this.columns) + dragonblocks.settings.inventory.scale * 0.1
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

		this.display = true;

		let display = parent.appendChild(document.createElement("div"));
		display.id = "dragonblocks.inventory[" + this.id + "]";
		display.style.position = "absolute";
		display.style.left = x + "px";
		display.style.top = y + "px";
		display.style.width =  this.calculateWidth() + "px";
		display.style.height = this.calculateHeight() + "px";

		let scale = dragonblocks.settings.inventory.scale * 1.1;
		let offset = dragonblocks.settings.inventory.scale * 0.1;

		for (let i in this.list) {
			let x = i % this.columns;
			let y = (i - x) / this.columns;
			this.list[i].draw(display, offset + x * scale, offset + y * scale);
		}

		return true;
	}

	remove()
	{
		this.getDisplay().remove();
		this.display = false;
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

	update()
	{
		for (let stack of this.list)
			stack.update();
	}

	getSlot(i)
	{
		return this.list[i];
	}

	getDisplay()
	{
		return document.getElementById("dragonblocks.inventory[" + this.id + "]");
	}
};

dragonblocks.Inventory.Event = class extends Event
{
	constructor(type, stack)
	{
		super(type);
		this.stack = stack;
	}
};
