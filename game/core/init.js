dragonblocks.registerNode({
	name: "core:stone",
	stable: true,
	texture: "core_stone.png",
	groups: ["cracky"],
	hardness: 10,
	desc: "Stone",
	drops: "core:cobble"
});
dragonblocks.registerNode({
	name: "core:stonebrick",
	stable: true,
	texture: "core_stonebrick.png",
	groups: ["cracky"],
	hardness: 10,
	desc: "Stonebrick",
});
dragonblocks.registerRecipe({
	result: "core:stonebrick",
	recipe: [
		["core:stone", "core:stone"],
		["core:stone", "core:stone"],
	]
});
dragonblocks.registerNode({
	name: "core:cobble",
	stable: true,
	texture: "core_cobble.png",
	groups: ["cracky"],
	hardness: 9,
	desc: "Cobblestone",
});
dragonblocks.registerRecipe({
	result: "furnace:furnace",
	recipe: [
		["core:cobble", "core:cobble", "core:cobble"],
		["core:cobble", "", "core:cobble"],
		["core:cobble", "core:cobble", "core:cobble"],
	]
});
tools.registerToolset({
	name: "stone",
	material: "core:cobble",
	level: 2
});
furnace.registerRecipe({
	input: "core:cobble",
	output: "core:stone",
	time: 3
});
dragonblocks.registerNode({
	name: "core:water",
	stable: false,
	texture: "core_water.png",
	groups: ["liquid"],
	desc: "Water",
	lavacooling: true,
	liquid: true,
});
dragonblocks.registerNode({
	name: "core:lava",
	stable: false,
	texture: "core_lava.png",
	groups: ["liquid"],
	desc: "Lava",
	onset: (x, y) => {
		dragonblocks.getNode(x, y).meta.lavaInterval = setInterval(_ => {
			for(let ix = x - 1; ix <= x + 1; ix++)
				for(let iy = y - 1; iy <= y + 1; iy++)
					if(dragonblocks.getNode(ix, iy) && dragonblocks.getNode(ix, iy).toNode().lavacooling)
						dragonblocks.setNode(x, y, "core:obsidian");
		}, 2000);
	},
	onremove: (x, y) => {
		clearInterval(dragonblocks.getNode(x, y).meta.lavaInterval);
	},
	liquid: true,
});
dragonblocks.registerNode({
	name: "core:obsidian",
	stable: true,
	texture: "core_obsidian.png",
	groups: ["cracky"],
	hardness: 25,
	desc: "Obsidian",
});
dragonblocks.registerNode({
	name: "core:sand",
	stable: true,
	texture: "core_sand.png",
	groups: ["crumbly"],
	hardness: 7,
	desc: "Sand",
	physics: true,
});
dragonblocks.registerMaterial({
	name: "core:sand",
	factor: 8,
});
dragonblocks.registerNode({
	name: "core:desert_sand",
	stable: true,
	texture: "core_desert_sand.png",
	groups: ["crumbly"],
	hardness: 7,
	desc: "Desert Sand",
	physics: true,
});
dragonblocks.registerGroup({
	name: "glass",
	sounds: {
		dug: "dug_glass.ogg",
		dig: "dig_glass.ogg"
	}
});
doors.registerDoor({
	name: "glass",
	groups: ["glass"],
	hardness: 4,
	material: "default:glass",
});
dragonblocks.registerNode({
	name: "core:glass",
	stable: true,
	texture: "core_glass.png",
	groups: ["glass"],
	hardness: 4,
	desc: "Glass",
});
furnace.registerRecipe({
	input: "core:sand",
	output: "core:glass",
	time: 3
});
furnace.registerRecipe({
	input: "core:desert_sand",
	output: "core:glass",
	time: 3
});
dragonblocks.registerNode({
	name: "core:snow",
	stable: true,
	texture: "core_snow.png",
	groups: ["crumbly"],
	hardness: 7,
	desc: "Snow",
	lavacooling: true
});
dragonblocks.registerNode({
	name: "core:ice",
	stable: true,
	texture: "core_ice.png",
	groups: ["glass"],
	hardness: 6,
	desc: "Ice",
	lavacooling: true,
});
dragonblocks.registerNode({
	name: "core:gravel",
	stable: true,
	texture: "core_gravel.png",
	groups: ["crumbly"],
	hardness: 7,
	desc: "Gravel",
	physics: true,
});
dragonblocks.registerMaterial({
	name: "core:gravel",
	factor: 6,
});
