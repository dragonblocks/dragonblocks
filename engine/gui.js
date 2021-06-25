/*
 * gui.js
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

dragonblocks.gui = {};

{
	let layer = document.body.appendChild(document.createElement("div"));
	layer.style.opacity = 0.7;
	layer.style.position = "fixed";
	layer.style.width = "100%";
	layer.style.height = "100%";
	layer.style.top = "0px";
	layer.style.left = "0px";
	layer.style.backgroundColor = "black";
	layer.style.visibility = "hidden";

	let layerShown = false;

	dragonblocks.gui.toggleLayer = _ => {
		layerShown ? dragonblocks.gui.hideLayer() : dragonblocks.gui.showLayer();
	};

	dragonblocks.gui.showLayer = dragonblocks.gui.openLayer = _ => {
		layerShown = true;
		layer.style.visibility = "visible";
	};

	dragonblocks.gui.hideLayer = dragonblocks.gui.closeLayer = _ => {
		layerShown = false;
		layer.style.visibility = "hidden";
	};
}

dragonblocks.gui.Box = class extends EventTarget
{
	constructor(def)
	{
		super();
		this.moveable = false;
		this.closeable = true;
		this.big = true;
		this.layer = true;
		this.scroll = true;
		this.keylock = false;

		if (def)
			dblib.copy(this, def);

		this.id = "dragonblocks.gui.box[" + dragonblocks.getToken() + "]";

		this.x = 0;
		this.y = 0;

		this.dragging = false;

		let display = document.body.appendChild(document.createElement("div"));
		display.id = this.id;
		display.style.width = this.big ? "700px" : "500px";
		display.style.height = this.big ? "500px" : "300px";
		display.style.position = "fixed";
		display.style.backgroundColor = "#7E7E7E";
		display.style.visibility = "hidden";
		dblib.center(display);
		dblib.centerVertical(display);

		if (this.scroll)
			display.style.overflowY = "scroll";

		this.moveable && this.addMoveField();
		this.closeable && this.addCloseField();
	}

	addMoveField()
	{
		let moveField = this.create("div");
		moveField.id = this.id + ".moveField";
		moveField.style.position = "absolute";
		moveField.style.left = "0px";
		moveField.style.top = "0px";
		moveField.style.width = this.big ? "50px": "30px";
		moveField.style.height = this.big ? "50px": "30px";
		moveField.style.background = dragonblocks.getTexture("move.png");
		moveField.style.backgroundSize = "cover"
		moveField.style.cursor = "move";

		let self = this;
		let display = this.getDisplay();

		display.addEventListener("mousedown", event => {
			if (event.srcElement.id != moveField.id)
				return;

			self.x = event.clientX;
			self.y = event.clientY;

			self.dragging = true;
		});

		display.addEventListener("mousemove", event => {
			if (! self.dragging)
				return;

			let display = self.getDisplay();

			let x = self.x - event.clientX;
			let y = self.y - event.clientY;

			self.x = event.clientX;
			self.y = event.clientY;

			display.style.left = display.offsetLeft - x + "px";
			display.style.top = display.offsetTop - y + "px";
		});

		addEventListener("mouseup", event => {
			self.dragging = false;
		});
	}

	addCloseField()
	{
		let closeField = this.create("div");
		closeField.id = this.id + ".closeField";
		closeField.style.position = "absolute";
		closeField.style.right = "0px";
		closeField.style.top = "0px";
		closeField.style.width = this.big ? "50px": "30px";
		closeField.style.height = this.big ? "50px": "30px";
		closeField.style.background = dragonblocks.getTexture("close.png");
		closeField.style.backgroundSize = "cover";
		closeField.style.cursor = "pointer";

		let self = this;
		closeField.addEventListener("mousedown", _ => {
			self.close();
 		});
	}

	getDisplay()
	{
		return document.getElementById(this.id);
	}

	setContent(html)
	{
		this.getDisplay().innerHTML = html;
	}

	open()
	{
		this.getDisplay().style.visibility = "visible";

		this.layer && dragonblocks.gui.openLayer();
		this.keylock && dragonblocks.keyHandler.lockAll();

		this.dispatchEvent(new dragonblocks.gui.Box.Event("open"));
	}

	close()
	{
		this.getDisplay().style.visibility = "hidden";

		this.layer && dragonblocks.gui.closeLayer();
		this.keylock && dragonblocks.keyHandler.unlockAll();

		this.dispatchEvent(new dragonblocks.gui.Box.Event("close"));
	}

	add(elem)
	{
		return this.getDisplay().appendChild(elem);
	}

	create(tag)
	{
		return this.add(document.createElement(tag));
	}
};

dragonblocks.gui.Box.Event = class extends Event
{
	constructor(type, box)
	{
		super(type);
		this.box = box;
	}
};
