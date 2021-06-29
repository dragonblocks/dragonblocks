/*
 * item_stack.js
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

dragonblocks.ItemStack = class extends EventTarget
{
	constructor(itemstring)
	{
		super();

		this.count = 0;
		this.item = null;
		this.id = dragonblocks.getToken();

		if (itemstring)
			this.deserialize(itemstring);
	}

	serialize()
	{
		if (! this.item)
			return "";
		return this.item + " " + this.count;
	}

	deserialize(itemstring)
	{
		this.item = itemstring ? itemstring.split(" ")[0] : null;
		this.count = itemstring ? parseInt(itemstring.split(" ")[1]) || 1 : 1;

		this.update();
	}

	getStacksize()
	{
		return (this.toItem() && this.toItem().stacksize) || dragonblocks.settings.item.defaultStacksize;
	}

	trigger(eventType)
	{
		this.dispatchEvent(new dragonblocks.ItemStack.Event(eventType, this));
	}

	update()
	{
		if (this.count <= 0)
			this.item = null;

		if (! this.item)
			this.count = 0;

		this.trigger("update");
	}

	toItem()
	{
		return dragonblocks.items[this.item];
	}

	swap(itemstack)
	{
		[this.count, itemstack.count] = [itemstack.count, this.count];
		[this.item, itemstack.item] = [itemstack.item, this.item];

		itemstack.update();
		this.update();
	}

	clear()
	{
		this.item = null;
		this.update();
	}

	addItems(itemstack, count)
	{
		this.update();
		itemstack.update();

		if (! itemstack.item)
			return false;

		if (! this.item)
			this.item = itemstack.item;
		else if (this.item != itemstack.item)
			return false;

		if (this.count == this.getStacksize())
			return false;

		itemstack.count -= count;
		this.count += count;

		let less = -itemstack.count;
		if (less > 0) {
			itemstack.count += less;
			this.count -= less;
		}

		let more = this.count - this.getStacksize();
		if (more > 0) {
			this.count -= more;
			itemstack.count += more;
		}

		this.update();
		itemstack.update();

		return true;
	}

	add(itemstack)
	{
		return this.addItems(itemstack, itemstack.count);
	}

	addOne(itemstack)
	{
		return this.addItems(itemstack, 1);
	}

	addHalf(itemstack)
	{
		return this.addItems(itemstack, Math.ceil(itemstack.count / 2));
	}

	getDisplay()
	{
		return document.getElementById("dragonblocks.itemstack[" + this.id + "]");
	}

	draw(parent, x, y)
	{
		let display = parent.appendChild(document.createElement("div"));
		display.id = "dragonblocks.itemstack[" + this.id + "]";
		display.stackid = this.id;
		display.style.borderStyle = "solid";
		display.style.borderWidth = "1px";
		display.style.borderColor = "#2D2D2D";
		display.style.width = dragonblocks.settings.inventory.scale + "px";
		display.style.height = dragonblocks.settings.inventory.scale + "px";
		display.style.backgroundColor = "#343434";
		display.style.position = "absolute";
		display.style.left = x + "px";
		display.style.top = y + "px";

		let countDisplay = display.appendChild(document.createElement("span"));
		countDisplay.id = "dragonblocks.itemstack[" + this.id + "].count";
		countDisplay.stackid = this.id;
		countDisplay.style.position = "absolute";
		countDisplay.style.right = "5px";
		countDisplay.style.bottom = "5px";
		countDisplay.style.color = "white";
		countDisplay.style.cursor = "default";

		let self = this;

		display.addEventListener("mousedown", event => {
			let out = dragonblocks.outStack;

			if (self.action)
				return self.action(out, event.which);

			switch (event.which) {
				case 1:
					if (out.item)
						self.add(out) || self.swap(out);
					else
						out.add(self);
					break;

				case 3:
					if (out.item)
						self.addOne(out) || self.swap(out);
					else
						out.addHalf(self);
			}
		});

		display.addEventListener("mouseover", event => {
			self.focused = true;
			self.redraw();
		});

		display.addEventListener("mouseleave", event => {
			self.focused = false;
			self.redraw();
		});

		this.addEventListener("update", _ => {
			self.redraw();
		});

		this.update();
	}

	redraw()
	{
		let display = this.getDisplay();

		if (! display)
			return;

		let countDisplay = document.getElementById("dragonblocks.itemstack[" + this.id + "].count");

		if (this.item) {
			let item = this.toItem();

			display.title = item.desc;
			display.style.background = dragonblocks.getTexture(item.texture);

			if (this.count > 1)
				countDisplay.innerHTML = this.count;
			else
				countDisplay.innerHTML = "";
		} else {
			display.title = "";
			display.style.background = "none";

			countDisplay.innerHTML = "";
		}

		display.style.backgroundColor = this.focused ? "#7E7E7E" : "#343434";

		this.trigger("redraw");
	}
};

dragonblocks.ItemStack.Event = class extends Event
{
	constructor(type, stack)
	{
		super(type);
		this.stack = stack;
	}
};

dragonblocks.isValidItemstring = itemstring => {
	let item = itemstring && itemstring.split(" ")[0];

	if (item && ! dragonblocks.items[item])
		return false;

	return true;
};
