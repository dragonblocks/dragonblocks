/*
 * mapgen.js
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

dragonblocks.mapgen = {};

dragonblocks.mapgen.addStructure = (name, msg, pos) => {
	let strs = dragonblocks.world.structures;
	strs[name] = strs[name] || [];
	strs[name].push({msg: msg, pos: pos});
};

dragonblocks.mapgen.biomes = [];
dragonblocks.registerBiome = obj => {
	dragonblocks.mapgen.biomes.push(obj);
};

dragonblocks.mapgen.materials = [];
dragonblocks.registerMaterial = obj => {
	dragonblocks.mapgen.materials.push(obj);
};

dragonblocks.mapgen.ores = [];
dragonblocks.registerOre = obj => {
	dragonblocks.mapgen.ores.push(obj);
};

dragonblocks.mapgen.selected = "empty";
dragonblocks.mapgen.list = {};

dragonblocks.generateMap = _ => {
	dragonblocks.mapgen.list[dragonblocks.mapgen.selected]();
};

dragonblocks.mapgen.list["v3"] = _ => {
	// Localize variables

	let int = parseInt;

	let snode = dragonblocks.setNode;
	let gnode = dragonblocks.getNode;

	let pm = dragonblocks.PixelManipulator;

	let rand = dblib.random;

	let height = dragonblocks.map.height;
	let width = dragonblocks.map.width;

	// Biomes

	let biomeList = dragonblocks.mapgen.biomes;
	let biomes = [];
	let biomeBorders = [];

	{
		for (let d = 0; d < width;) {
			let max = 0;

			for (let biome of biomeList)
				max += biome.probability;

			let r = rand(0, max);

			for (let i in biomeList) {
				r -= biomeList[i].probability;

				if (r <= 0) {
					biomeBorders.push(d);

					let border = Math.min(d + rand(biomeList[i].size[0], biomeList[i].size[1]), width);

					dragonblocks.mapgen.addStructure(biomeList[i].name, "(" + d + " - " + border + ", *)", {x: int((d + border)/2), y: 5});

					for(; d < border; d++)
						biomes.push(i);

					break;
				}
			}
		}
	}

	// Terrain shape

	let ground = [];

	{
		let levels = [
			{
				name: "mountain_up",
				probability: 3,
				rise: [-3, -2, -2, -2, -1, -1, -1],
				size: 15,
				minsize: 15,
				high: 10,
				next: "mountain_down",
			},
			{
				name: "mountain_down",
				probability: 0,
				rise: [3, 2, 2, 2, 1, 1, 1],
				size: 15,
				minsize: 15,
				low: 50,
			},
			{
				name: "hill_up",
				probability: 4,
				rise: [0, 0, 0, 0, 0, -1],
				size: 20,
				minsize: 0,
				high: 20,
			},
			{
				name: "hill_down",
				probability: 4,
				rise: [0, 0, 0, 0, 0, 1],
				size: 20,
				minsize: 0,
				low: 50,
			},
			{
				name: "ocean_border_start",
				probability: 3,
				rise: [1, 1, 1, 0],
				size: 0,
				minsize: 100,
				low: 60,
				next: "ocean",
			},
			{
				name: "ocean",
				probability: 0,
				rise: [0, 0, 0, 0, 0, 0, 0, 1, -1],
				size: 5,
				minsize: 20,
				high: 50,
				next: "ocean_border_end",
			},
			{
				name: "ocean_border_end",
				probability: 0,
				rise: [-1, -1, -1, 0],
				size: 10,
				minsize: 10,
			},
			{
				name: "flat",
				probability: 8,
				rise: [0],
				size: 10,
				minsize: 0,
				low: 50,
				high: 30,
			}
		];

		let maxprob = 0;

		for (let lvl of levels) {
			levels[lvl.name] = lvl;
			maxprob += lvl.probability;
		}

		let level = levels.flat;
		let leftsize = level.minsize;
		let groundLast = 40 * height / 100;
		let structAdded = false;

		for (let x = 0; x < width; x++){
			if (level.high && level.high * height / 100 > groundLast || level.low && level.low * height / 100 < groundLast || leftsize <= 0 && rand(0, level.size) == 0) {
				if (! structAdded) {
					let start = x - level.minsize + leftsize;
					let end = x;

					let gx = int((start + end) / 2);
					let gy = ground[gx] - 3;

					dragonblocks.mapgen.addStructure(level.name, "(" + start + " - " + end + ", *)", {x: gx, y: gy});

					structAdded = true;
				}

				if (level.next) {
					level = levels[level.next];
				} else {
					let r = rand(0, maxprob);

					for (let lvl of levels) {
						r -= lvl.probability;

						if (r <= 0) {
							level = lvl;
							break;
						}
					}
				}

				leftsize = level.minsize;
				x--;
				continue;
			}

			structAdded = false;
			leftsize--;
			groundLast += level.rise[rand(0, level.rise.length - 1)];

			ground[x] = groundLast;
		}
	}

	// Ores

	{
		let setOre = (x, y, ore) => {
			if (! ground[x] || y < ground[x] || (y / height  * 100 - 50) < ore.deep)
				return false;

			snode(x, y, ore.name);

			return true;
		};

		for (let x = 0; x < width; x++) {
			let y, g;

			y = g = ground[x];

			let biome = biomeList[biomes[x]];

			for (; y < g + 1; y++)
				snode(x, y, biome.surface);

			for (; y < g + 5; y++)
				snode(x, y, biome.ground);

			for (; y < height; y++) {
				snode(x, y, biome.underground);

				for (let ore of dragonblocks.mapgen.ores) {
					if (dblib.random(0, ore.factor) == 0) {
						if (setOre(x, y, ore))
							dragonblocks.mapgen.addStructure(ore.name, "(" + x + ", " + y + ")", {x: x, y: y});

						for (let i = 0; i < ore.clustersize; i++)
							setOre(x + dblib.random(-2, 2), y + dblib.random(-2, 2), ore);
					}
				}
			}
		}
	}

	// Water

	let water = [];

	{
		let top, bottom, start;

		top = int(height / 2);

		for (let x = 0; x < width; x++) {
			let biome = biomeList[biomes[x]];
			if (ground[x] > top) {
				start = start || x;
				water[x] = true;

				snode(x, top, biome.watertop);

				let y = top + 1;

				for(; y < ground[x]; y++)
					snode(x, y, biome.water);

				for(; y < ground[x] + 5; y++)
					snode(x, y, biome.floor);
			} else if (start) {
				let end = x - 1;
				dragonblocks.mapgen.addStructure("water", "(" + start + " - " + end + ", " + top + ")", {x: int((start + end) / 2), y: top});
				start = 0;
			}
		}

		if (start) {
			let end = width;
			dragonblocks.mapgen.addStructure("water", "(" + start + " - " + end + ", " + top + ")", {x: int((start + end) / 2), y: top});
		}
	}

	// Trees

	{
		let nextTree = 0;

		for (let x = 0; x < width; x++) {
			if (x >= nextTree && ! water[x]) {
				let g = ground[x];
				let biome = biomeList[biomes[x]];

				for (let tree of biome.trees) {
					if (Math.random() <= tree.chance) {
						snode(x, g - 1, tree.sapling);
						gnode(x, g - 1) && dragonblocks.finishTimer("growTimer", gnode(x, g - 1).meta);
						nextTree = x + tree.width;
						break;
					}
				}
			}
		}
	}

	// Ressource Blobs (e.g. Gravel, Dirt)

	{
		let belowGround = (node, x, y) => {
			return y > ground[x]
		};

		function structure(x, y, mat) {
			new pm([["§" + mat, mat], [mat, mat]])
				.addFunction(belowGround)
				.apply(x, y);

			let sides = [
				new pm([[mat, mat], ["§", ""]]),
				new pm([["§", "", mat], ["", "", mat]]),
				new pm([["§", ""], ["", ""], [mat, mat]]),
				new pm([[mat, "§"], [mat, ""]]),
			];

			for (let side of sides)
				side.addFunction(belowGround);

			let moresides = [
				new pm([[mat, mat], ["", ""], ["§", ""]]),
				new pm([["§", "", "", mat], ["", "", "", mat]]),
				new pm([["§", ""], ["", ""], ["", ""], [mat, mat]]),
				new pm([[mat, "", "§"], [mat, "", ""]]),
			];

			for (let moreside of moresides)
				moreside.addFunction(belowGround);

			let corners = [
				new pm([[mat, ""], ["", "§"]]),
				new pm([["", "", mat], ["§", "", ""]]),
				new pm([["§", "", ""], ["", "", ""], ["", "", mat]]),
				new pm([["§", "", ""], ["", "", ""], ["", "", mat]]),
			];

			for (let corner of corners)
				corner.addFunction(belowGround);

			for (let i in sides) {
				if (Math.random() * 1.2 < 1){
					sides[i].apply(x, y);

					for (let j = i; j <= int(i) + 1; j++){
						let corner = corners[j] || corners[0];

						if (Math.random() * 1.5 < 1)
							corner.apply(x, y);
					}

					if (Math.random() * 2 < 1)
						moresides[i].apply(x, y);
				}
			}
		}

		for (let material of dragonblocks.mapgen.materials)
			for (let i = 0; i < width / material.factor; i++)
				structure(rand(0, width), rand(0, height), material.name);
	}

	// Caves

	{
		let cave = (x, y, r) => {
			r *= 2;

			let cavepm = new pm([
				["",    "air",  "air", "air",    ""],
				["air", "air",  "air", "air", "air"],
				["air", "air", "§air", "air", "air"],
				["air", "air",  "air", "air", "air"],
				["",    "air",  "air", "air",    ""],
			]);

			cavepm.addFunction((node, x, y) => {
				if (y < ground[x])
					return false;

				if (dblib.random(0, r) == 0)
					cave(x, y, r);
			});

			cavepm.apply(x, y);
		};

		let newCave = (x, y) => {
			let r = dblib.random(0, 10) + 1;

			if (y < ground[x] + 10)
				return false;

			cave(x, y, r);

			dragonblocks.mapgen.addStructure("cave", "(" + x + ", " + y + ")", {x: x, y: y});
		};

		let r = dblib.random(width / 5, width / 15);

		for (let i = 0; i < r; i++)
			newCave(rand(0, width), rand(0, height));
	}
};

dragonblocks.mapgen.list["flat"] = _ => {
	for (let x = 0; x < dragonblocks.map.width; x++) {
		let y = 0;

		for(; y < dragonblocks.map.height - 5; y++)
			dragonblocks.setNode(x, y, "air");

		for(; y < dragonblocks.map.height - 4; y++)
			dragonblocks.setNode(x, y, "dirt:grass");

		for(; y < dragonblocks.map.height - 3; y++)
			dragonblocks.setNode(x, y, "dirt:dirt");

		for(; y < dragonblocks.map.height; y++)
			dragonblocks.setNode(x, y, "core:stone");
	}
};

dragonblocks.mapgen.list["empty"] = _ => {};

