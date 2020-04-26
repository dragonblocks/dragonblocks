/*
 * recipe.js
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
dragonblocks.Recipe = class{
	constructor(obj){
		if(! obj || ! obj.result || ! obj.recipe instanceof Array || ! obj.recipe[0] instanceof Array)
			return;
		this.recipe = obj.recipe;
		this.result = obj.result;
		this.height = this.recipe.length;
		this.width = this.recipe[0].length;
		dragonblocks.recipes.push(this);
	}
	match(craftfield){
		if(craftfield.width < this.width || craftfield.height < this.height)
			return false;
		for(let ydiff = 0; ydiff <= craftfield.height - this.height; ydiff++){
			for(let xdiff = 0; xdiff <= craftfield.width - this.width; xdiff++){
				let found = true;
				for(let y = 0; y < craftfield.height; y++){
					for(let x = 0; x < craftfield.width; x++){
						if(! this.recipe[y - ydiff] || ! this.recipe[y - ydiff][x - xdiff]){
							if(craftfield.list[y * craftfield.width + x].item)
								found = false;
						}
						else if(! dragonblocks.itemMatch(craftfield.list[y * craftfield.width + x].item, this.recipe[y - ydiff][x - xdiff]))
							found = false;
					}
				}
				if(found)
					return true;
			}
		}
		return false;
	}
}
dragonblocks.recipes = [];
dragonblocks.registerRecipe = function(obj){
	new dragonblocks.Recipe(obj);
}
