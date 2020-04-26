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
dragonblocks.PixelManipulator = class{
	constructor(arr){
		let pos = null;
		this.content = [];
		for(let y = 0; y < arr.length; y++){
			for(let x = 0; x < arr[y].length; x++){
				if(arr[y][x][0] == "§"){
					pos = {x: x, y: y};
					arr[y][x] = arr[y][x].slice(1, arr[y][x].length);
				}
				if(arr[y][x] == "")
					continue;
				this.content.push({
					x: x,
					y: y,
					node: arr[y][x]
				});
			}
		}
		if(! pos)
			pos = {x: 0, y: 0};
		for(let pixel of this.content){
			pixel.x = pixel.x - pos.x;
			pixel.y = pixel.y - pos.y;
		}
		this.functions = [];
		
	}
	apply(x, y){
		for(let pixel of this.content){
			if(! dragonblocks.getNode(pixel.x + x, pixel.y + y))
				continue;
			let doApply = true
			for(let func of this.functions)
				if(func(dragonblocks.getNode(pixel.x + x, pixel.y + y).toNode(), pixel.x + x, pixel.y + y, pixel.node) == false)
					doApply = false;
			if(doApply)
				dragonblocks.setNode(pixel.x + x, pixel.y + y, pixel.node);
		}
	}
	replace(toReplace, replaceWith){
		for(let pixel of this.content){
			if(pixel.node == toReplace)
				pixel.node = replaceWith;
		}
	}
	addFunction(func){
		this.functions.push(func);
	}
}
dragonblocks.getPixelManipulator = function(arr){
	return new dragonblocks.PixelManipulator(arr);
}
