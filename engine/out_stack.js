/*
 * out_stack.js
 *
 * Copyright 2021 Elias Fleckenstein <eliasfleckenstein@web.de>
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

dragonblocks.addInventoryMenuDisplay = elem => {
	return document.body.insertBefore(elem, dragonblocks.outStack.getDisplay());
};

setTimeout(_ => {
	let out = dragonblocks.outStack = new dragonblocks.ItemStack();

	out.draw(document.body, 0, 0);
	out.getDisplay().style.position = "fixed";

	out.addEventListener("redraw", _ => {
		let display = out.getDisplay();
		display.style.backgroundColor = "";
		display.style.border = "none";
	});

	addEventListener("mousemove", event => {
		let display = out.getDisplay();
		display.style.left = event.clientX + 5 + "px";
		display.style.top = event.clientY + 5 + "px";
	});

	out.update();
});
