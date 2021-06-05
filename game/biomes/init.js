dragonblocks.registerBiome({
	name: "grasslands",
	probability: 12,
	size: [20, 30],
	trees: [],
	surface: "dirt:grass",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "core:sand",
});
dragonblocks.registerBiome({
	name: "snowlands",
	probability: 7,
	size: [20, 30],
	trees: [],
	surface: "dirt:snow",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:ice",
	water: "core:water",
	floor: "core:stone",
});
dragonblocks.registerBiome({
	name: "antarctica",
	probability: 5,
	size: [20, 30],
	trees: [],
	surface: "core:snow",
	ground: "core:snow",
	underground: "core:stone",
	watertop: "core:ice",
	water: "core:ice",
	floor: "core:stone",
});
dragonblocks.registerBiome({
	name: "forest",
	probability: 10,
	size: [25, 40],
	trees: [
		{
			sapling: "plants:apple_sapling",
			chance: 1/5,
			width: 3,
		},
		{
			sapling: "plants:aspen_sapling",
			chance: 1/5 ,
			width: 3,
		},
	],
	surface: "dirt:grass",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "core:sand",
});
dragonblocks.registerBiome({
	name: "jungle",
	probability: 7,
	size: [40, 50],
	trees: [
		{
			sapling: "plants:jungle_sapling",
			chance: 2/3,
			width: 5,
		},
	],
	surface: "dirt:rainforest_litter",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "dirt:dirt",
});
dragonblocks.registerBiome({
	name: "savanna",
	probability: 7,
	size: [25, 30],
	trees: [
		{
			sapling: "plants:acacia_sapling",
			chance: 1/10,
			width: 7,
		},
	],
	surface: "dirt:dry_grass",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "dirt:dirt",
});
dragonblocks.registerBiome({
	name: "desert",
	probability: 2,
	size: [40, 50],
	trees: [],
	surface: "core:desert_sand",
	ground: "core:desert_sand",
	underground: "core:stone",
	watertop: "core:sand",
	water: "core:sand",
	floor: "core:desert_sand",
});
dragonblocks.registerBiome({
	name: "tundra",
	probability: 7,
	size: [25, 40],
	trees: [
		{
			sapling: "plants:pine_sapling",
			chance: 2/3,
			width: 5,
		}
	],
	surface: "dirt:grass",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "core:sand",
});
dragonblocks.registerBiome({
	name: "taiga",
	probability: 5,
	size: [25, 40],
	trees: [
		{
			sapling: "plants:pine_sapling",
			chance: 1/4,
			width: 5,
		}
	],
	surface: "dirt:snow",
	ground: "dirt:dirt",
	underground: "core:stone",
	watertop: "core:water",
	water: "core:water",
	floor: "core:stone",
});

