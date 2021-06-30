/*
 * creative_inventory.js
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

dragonblocks.CreativeInventory = class extends dragonblocks.Inventory
{
	constructor(slots, list, columns)
	{
		super(slots, columns);

		this.fullList = list || this.list;

		this.page = 0;
		this.pages = Math.ceil(this.fullList.length / this.list.length);

		let self = this;

		for (let i = 0; i < this.slots; i++) {
			let stack = this.list[i];

			stack.addEventListener("update", event => {
				if (event.stack.refilling)
					return;

				stack.refilling = true;
				stack.deserialize(self.fullList[self.slots * self.page + i] || "");
				stack.refilling = false;
			});
		}
	}

	calculateHeight()
	{
		return super.calculateHeight() + dragonblocks.settings.inventory.scale;
	}

	update()
	{
		if (this.page == -1)
			this.page++;

		if (this.page == this.pages)
			this.page--;

		this.pageDisplay.textContent = "Page " + (this.page + 1) + " of " + this.pages;

		for (let slot of this.list)
			slot.update();
	}

	initGraphics()
	{
		super.initGraphics();

		let pageContainer = this.display.appendChild(document.createElement("div"));
		pageContainer.style.height = dragonblocks.settings.inventory.scale + "px";
		pageContainer.style.width = this.calculateWidth() + "px";
		pageContainer.style.left = "0px";
		pageContainer.style.top = super.calculateHeight() + "px";
		pageContainer.style.position = "absolute";

		this.pageDisplay = pageContainer.appendChild(document.createElement("span"));
		this.pageDisplay.style.color = "#343434";
		this.pageDisplay.style.position = "absolute";
		this.pageDisplay.style.left = dragonblocks.settings.inventory.scale * 1.1 + "px";
		this.pageDisplay.style.width = "100%";
		this.pageDisplay.style.fontSize = dragonblocks.settings.inventory.scale / (5 / 3) + "px";
		this.pageDisplay.style.height = dragonblocks.settings.inventory.scale / (5 / 3) + "px";

		dblib.centerVertical(this.pageDisplay);

		let self = this;

		for (let dir of ["left", "right"]) {
			let arrow = pageContainer.appendChild(document.createElement("div"));
			arrow.style.position = "absolute";
			arrow.style.width = dragonblocks.settings.inventory.scale + "px";
			arrow.style.height = dragonblocks.settings.inventory.scale + "px";
			arrow.style[dir] = "0px";
			arrow.style.background = dragonblocks.getTexture("arrow.png");
			arrow.style.cursor = "pointer";

			if (dir == "right")
				arrow.style.transform = "rotate(180deg)";

			arrow.addEventListener("click", _ => {
				if (dir == "right")
					self.page++;
				else
					self.page--;

				self.update();
			});

			dblib.centerVertical(arrow);
		}
	}
};
