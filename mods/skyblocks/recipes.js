dragonblocks.registerRecipe({
	result: "plants:apple_sapling",
	recipe:[
		["plants:apple_leaves", "plants:apple_leaves", "plants:apple_leaves"],
		["plants:apple_leaves", "plants:apple_leaves", "plants:apple_leaves"],
		["", "tools:stick", ""]
	]
});
furnace.registerRecipe({
	input: "dirt:dirt",
	output: "core:cobble 2",
	time: 5,
});
dragonblocks.registerRecipe({
	result: "core:gravel 2",
	recipe: [["core:cobble"]]
});
dragonblocks.registerRecipe({
	result: "dirt:dirt 2",
	recipe: [["core:gravel"]],
});
 
