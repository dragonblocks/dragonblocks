/*
 * craftfield.js
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
dragonblocks.Craftfield = class extends dragonblocks.Inventory{
	constructor(width, height){
		super(width * height, width);
		this.width = width;
		this.height = height;
		let self = this;
		this.resultfield = new dragonblocks.Itemstack();
		this.resultfield.action = out => {
			out.add(self.resultfield) && self.reduce();
		}
		this.addUpdateListener(_ => {
			self.update();
		});
	}
	calculateWidth(){
		return super.calculateWidth() + dragonblocks.settings.inventory.scale * 1.1 * 2;
	}
	draw(parent, x, y){
		if (!super.draw(parent, x, y))
			return false;
		dragonblocks.Inventory.drawStack(this.getDisplay(), dragonblocks.settings.inventory.scale * 0.1 + (this.width + 1) * dragonblocks.settings.inventory.scale * 1.1, dragonblocks.settings.inventory.scale * 0.1 + (this.height / 2 - 0.5) * dragonblocks.settings.inventory.scale * 1.1, this.resultfield)
	}
	reduce(){
		for(let stack of this.list){
			let vstack = dragonblocks.createItemstack();
			vstack.addOne(stack);
		}
		this.update();
	}
	update(){
		this.resultfield.parse("");
		for(let recipe of dragonblocks.recipes){
			if(recipe.match(this))
				return this.resultfield.parse(recipe.result);
		}
	}
}
