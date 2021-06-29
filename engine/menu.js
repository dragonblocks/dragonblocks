/*
 * menu.js
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

dragonblocks.Menu = class
{
	constructor()
	{
		this.display = document.body.appendChild(document.createElement("div"));
		this.display.style.position = "fixed";
		this.display.style.backgroundColor = "#7E7E7E";
		this.display.style.width = "500px";
		this.display.style.height = "10px";
		this.display.style.visibility = "hidden";

		dblib.center(this.display);
		dblib.centerVertical(this.display);

		let head = document.createElement("div");

		let headline = head.appendChild(document.createElement("h2"));
		headline.innerHTML = "Options";
		headline.align = "center";

		this.addElement(head);
	}

	toggle()
	{
		this.opened ? this.close() : this.open();
	}

	close()
	{
		this.opened = false;

		dragonblocks.gui.closeLayer();
		dragonblocks.keyHandler.unlockAll();

		this.display.style.visibility = "hidden";
	}

	open()
	{
		this.opened = true;

		dragonblocks.gui.showLayer();
		dragonblocks.keyHandler.lockAll();
		dragonblocks.keyHandler.unlock("Escape");

		this.display.style.visibility = "visible";
	}

	addElement(elem)
	{
		elem = this.display.appendChild(elem);

		elem.style.position = "absolute";
		elem.style.top = this.display.offsetHeight + "px";
		elem.style.width = "80%";
		dblib.center(elem);

		this.display.style.height = this.display.offsetHeight + 10 + elem.offsetHeight + "px";
		dblib.centerVertical(this.display);

		return elem;
	}

	addButton(html, func)
	{
		let elem = document.createElement("button");
		elem.innerHTML = html;
		elem.style.fontSize = "20px";
		elem.style.borderRadius = "0%";

		let self = this;

		elem.addEventListener("click", event => {
			self.close();
			func && func(event);
		});

		this.addElement(elem);
	}
};

dragonblocks.menu = new dragonblocks.Menu();
dragonblocks.menu.addButton("Continue Playing");

dragonblocks.registerOnStarted(_ => {
	dragonblocks.menu.addButton(dragonblocks.loggedin ? "Save and Quit to Title" : "Quit to Title", dragonblocks.quit);
});

dragonblocks.keyHandler.down("F5", _ => {});

dragonblocks.keyHandler.down("Escape", _ => {
	dragonblocks.menu.toggle();
});
