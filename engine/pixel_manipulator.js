/*
 * pixel_manipulator.js
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

dragonblocks.PixelManipulator = class
{
	constructor(arr)
	{
		this.data = [];
		this.functions = [];

		let pos;

		for (let y = 0; y < arr.length; y++) {
			for (let x = 0; x < arr[y].length; x++) {
				let node = arr[y][x];

				if (node[0] == "§") {
					pos = {x: x, y: y};
					node = node.slice(1, node.length);
				}

				if (node == "")
					continue;

				this.data.push({
					x: x,
					y: y,
					node: node,
				});
			}
		}

		if (! pos)
			pos = {x: 0, y: 0};

		for (let pixel of this.data) {
			pixel.x = pixel.x - pos.x;
			pixel.y = pixel.y - pos.y;
		}
	}

	apply(x, y)
	{
		for (let pixel of this.data) {
			let mx, my;
			mx = pixel.x + x;
			my = pixel.y + y;

			let node = dragonblocks.getNode(mx, my);
			if (! node)
				continue;

			let nodeDef = node.toNode();

			let doApply = true;

			for (let func of this.functions) {
				if (func(nodeDef, mx, my, pixel.node) == false) {
					doApply = false;
					break;
				}
			}

			if (doApply)
				dragonblocks.setNode(mx, my, pixel.node);
		}

		return this;
	}

	replace(toReplace, replaceWith)
	{
		for (let pixel of this.data)
			if (pixel.node == toReplace)
				pixel.node = replaceWith;

		return this;
	}

	addFunction(func)
	{
		this.functions.push(func);
		return this;
	}
};
