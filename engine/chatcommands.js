/*
 * chatcommands.js
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
dragonblocks.chatcommands = {};
dragonblocks.registerChatcommand = function(obj){
	if(! obj || ! obj.name)
		return;
	obj.desc = obj.desc || obj.description || "No description";
	obj.param = obj.param || obj.parameters || "";
	dragonblocks.chatcommands[obj.name] = obj;
}
dragonblocks.registerOnChatMessage(msg => {
	if( ! msg.startsWith("/"))
		return true;
	msg += " ";
	let command = msg.slice(msg.search("/") + 1, msg.search(" "));
	let arg = msg.slice(msg.search(" ") + 1);
	arg = arg.slice(0, arg.length - 1);
	if(dragonblocks.chatcommands[command])
		dragonblocks.chatcommands[command].func(arg);
	else
		dragonblocks.chatMessage("Invalid Command: " + command);
	return false;
});
