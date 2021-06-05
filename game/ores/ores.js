dragonblocks.registerGroup({
	name: "metal",
	sounds: {
		dug: "dug_metal.ogg",
		dig: "dig_metal.ogg",
		place: "place_metal.ogg"
	}
});
ores.registerOre({
	name: "coal",
	itemHardness: 3, 
	hardness: 7,
	flammable: true,
	clustersize: 9,
	deep: -25,
	factor: 400,
});
ores.registerOre({
	name: "iron",
	hardness: 12,
	blockname: "Steel Block",
	ingotname: "Steel Ingot",
	ingot: true,
	groups: ["metal"],
	clustersize: 7,
	deep: -5,
	factor: 600,
}); 
tools.registerToolset({
	name: "steel",
	material: "ores:iron_ingot",
	level: 3
});
doors.registerTrapdoor({
	name: "steel",
	groups: ["metal"],
	hardness: 16,
	material: "ores:iron_ingot",
}); 
doors.registerDoor({
	name: "steel",
	groups: ["metal"],
	hardness: 16,
	material: "ores:iron_ingot",
}); 
ores.registerOre({
	name: "copper",
	hardness: 13,
	ingot: true,
	groups: ["metal"],
	clustersize: 5,
	deep: 10,
	factor: 700,
}); 
ores.registerOre({
	name: "tin",
	hardness: 13,
	ingot: true,
	groups: ["metal"],
	clustersize: 5,
	deep: 10,
	factor: 800,
}); 
ores.registerOre({
	name: "gold",
	hardness: 15,
	ingot: true,
	groups: ["metal"],
	clustersize: 5,
	deep: 15,
	factor: 1000,
}); 
ores.registerOre({
	name: "mese",
	hardness: 20,
	clustersize: 6,
	factor: 1500,
	deep: 25,
});
tools.registerToolset({
	name: "mese",
	material: "ores:mese",
	level: 4
});
dragonblocks.registerOre({
	name: "ores:mese_block",
	clustersize: 3,
	factor: 10000,
	deep: 45,
});
ores.registerOre({
	name: "diamond",
	hardness: 30,
	clustersize: 6,
	factor: 3000,
	deep: 30,
}); 
tools.registerToolset({
	name: "diamond",
	material: "ores:diamond",
	level: 6
});
