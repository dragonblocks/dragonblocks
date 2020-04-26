/*
 * key_handler.js
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
dragonblocks.KeyHandler = class{
	constructor(){
		this.locked = {};
		this.upHandlers = {};
		this.downHandlers = {};
		addEventListener("keydown", event => {dragonblocks.keyHandler.handler(event)});
		addEventListener("keyup", event => {dragonblocks.keyHandler.handler(event)});
		addEventListener("wheel", event => {dragonblocks.keyHandler.handler(event)});
	}
	lock(key){
		this.locked[key] = true;
	}
	lockAll(){
		for(let key in this.upHandlers)
			this.lock(key);
		for(let key in this.downHandlers)
			this.lock(key);
	}
	unlock(key){
		dragonblocks.keyHandler.locked[key] = false;
	}
	unlockAll(){
		for(let key in this.locked)
			this.unlock(key);
	}
	down(key, func){
		this.downHandlers[key] = func;
		this.lock(key);
	}
	up(key, func){
		this.upHandlers[key] = func;
		this.lock(key);
	}
	handler(event){
		switch(event.type){
			case "keydown":
			case "keypress":
				if(this.locked[event.key])
					return;
				if(this.downHandlers[event.key]){
					event.preventDefault();
					(this.downHandlers[event.key])();
				}
				break;
			case "keyup":
				if(this.locked[event.key])
					return;
				if(this.upHandlers[event.key]){
					event.preventDefault();
					(this.upHandlers[event.key])();
				}
				break;
			case "wheel":
				if(this.locked["scroll"])
					return;
				if(event.deltaY > 0 && this.downHandlers["scroll"]){
						event.preventDefault();
						(this.downHandlers["scroll"])();
				}
				else if(this.upHandlers["scroll"]){
						event.preventDefault();
						(this.upHandlers["scroll"])();
				}
				break;
		}
	}
}
dragonblocks.keyHandler = new dragonblocks.KeyHandler();
dragonblocks.registerOnStarted(_ => {
	dragonblocks.keyHandler.unlockAll();
});
