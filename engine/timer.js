/*
 * timer.js
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
dragonblocks.ticksPerSecond = dragonblocks.settings.timer.tps;
dragonblocks.setTimer = function(name, seconds, onfinish, meta){
	seconds = meta[name] || seconds;
	meta[name] = seconds;
	meta[name + "Interval"] = setInterval(_ => {
		meta[name] -= 1 / dragonblocks.settings.timer.tps;
		if(meta[name] <= 0){
			dragonblocks.clearTimer(name, meta);
			onfinish();
		}
	}, 1000 / dragonblocks.ticksPerSecond);
}
dragonblocks.finishTimer = function(name, meta){
	 meta[name] = 0;
}
dragonblocks.clearTimer = function(name, meta){
	clearInterval(meta[name + "Interval"]);
	delete meta[name];
	delete meta[name + "Interval"];
}
