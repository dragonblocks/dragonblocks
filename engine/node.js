/*
 * node.js
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

dragonblocks.Node = class extends dragonblocks.Item
{
	constructor(def){
		super(def);

		if (this.drops == "")
			this.drops = " ";

		if (this.drop == "")
			this.drop = " ";

		this.drops = this.drops || this.drop || this.name;

		if (this.mobstable == undefined)
			this.mobstable = this.stable;

		if (this.liquid) {
			this.hardness = 1;

			this.ondig = this.ondig || (_ => {
				return false;
			});

			this.onblast = this.onblast || (_ => {
				return false;
			});

			let oldOnset = this.onset;
			let self = this;

			this.onset = (x, y) => {
				let meta = dragonblocks.getNode(x, y).meta;

				meta.liquidInterval = setInterval(_ => {
					for(let [ix, iy] of [[x + 1, y], [x - 1, y], [x, y + 1]]){
						let node = dragonblocks.getNode(ix, iy);

						if (! node || node.stable || node.toNode().liquid)
							continue;

						dragonblocks.setNode(ix, iy, self.name);
					}
				}, self.liquidTickSpeed || 2000);

				if (oldOnset)
					oldOnset(x, y);

				return meta;
			};

			let oldOnremove = this.onremove;

			this.onremove = (x, y) => {
				clearInterval(dragonblocks.getNode(x, y).meta.liquidInterval);

				if (oldOnremove)
					oldOnremove(x, y);
			};
		}
	}
};

dragonblocks.nodes = {};
dragonblocks.registeredNodes = [];
dragonblocks.registerNode = def => {
	let nodeDef = new dragonblocks.Node(def);
	dragonblocks.nodes[nodeDef.name] = nodeDef;
	dragonblocks.registeredNodes.push(nodeDef);
};

dragonblocks.onSetNodeCallbacks = [];
dragonblocks.registerOnSetNode = func => {
	dragonblocks.onSetNodeCallbacks.push(func);
};

dragonblocks.onRemoveNodeCallbacks = [];
dragonblocks.registerOnRemoveNode = func => {
	dragonblocks.onRemoveNodeCallbacks.push(func);
};

dragonblocks.onPlaceNodeCallbacks = [];
dragonblocks.registerOnPlaceNode = func => {
	dragonblocks.onPlaceNodeCallbacks.push(func);
};

dragonblocks.onDigNodeCallbacks = [];
dragonblocks.registerOnDigNode = func => {
	dragonblocks.onDigNodeCallbacks.push(func);
};

dragonblocks.onClickNodeCallbacks = [];
dragonblocks.registerOnClickNode = func => {
	dragonblocks.onClickNodeCallbacks.push(func);
};

dragonblocks.onActivateNodeCallbacks = [];
dragonblocks.registerOnActivateNode = func => {
	dragonblocks.onActivateNodeCallbacks.push(func);
};

dragonblocks.onPunchNodeCallbacks = [];
dragonblocks.registerOnPunchNode = func => {
	dragonblocks.onPunchNodeCallbacks.push(func);
};
