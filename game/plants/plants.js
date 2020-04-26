dragonblocks.registerRecipe({
	result: "tools:stick 4",
	recipe: [["plants_wood"]]
});
tools.registerToolset({
	name: "wood",
	modname: "plants",
	material: "plants_wood",
	level: 1.5
});
doors.registerTrapdoor({
	name: "wood",
	modname: "plants",
	groups: ["choppy"],
	hardness: 6,
	material: "plants_wood",
}); 
doors.registerDoor({
	name: "wood",
	modname: "plants",
	groups: ["choppy"],
	hardness: 6,
	material: "plants_wood",
});
plants.registerTree({
	name: "apple",
	tree: dragonblocks.getPixelManipulator([
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["", "tree", ""],
		["", "§tree", ""],
	]),
	growtimeMin: 25,
	growtimeMax: 30,
	saplingDropChance: 4,
	woodFromTree: 4,
});
plants.registerTree({
	name: "pine",
	tree: dragonblocks.getPixelManipulator([
		["", "", "leaves", "", ""],
		["", "", "leaves", "", ""],
		["", "leaves", "leaves", "leaves", ""],
		["", "leaves", "leaves", "leaves", ""],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["", "", "tree", "", ""],
		["", "", "§tree", "", ""],
	]),
	growtimeMin: 45,
	growtimeMax: 50,
	saplingDropChance: 6,
	leavesName: "Needles",
	woodFromTree: 4,
});
plants.registerTree({
	name: "acacia",
	tree: dragonblocks.getPixelManipulator([
		["", "", "leaves", "leaves", "leaves", "", ""],
		["leaves", "leaves", "leaves", "tree", "leaves", "leaves", "leaves"],
		["leaves", "tree", "leaves", "tree", "leaves", "tree", "leaves"],
		["", "", "tree", "tree", "tree", "", ""],
		["", "", "", "tree", "", "", ""],
		["", "", "", "§tree", "", "", ""],
	]),
	growtimeMin: 50,
	growtimeMax: 65,
	saplingDropChance: 10,
	woodFromTree: 4,
});
plants.registerTree({
	name: "jungle",
	tree: dragonblocks.getPixelManipulator([
		["", "leaves", "leaves", "leaves", ""],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves", "leaves", "leaves"],
		["", "leaves", "leaves", "leaves", ""],
		["", "", "tree", "", ""],
		["", "", "tree", "", ""],
		["", "", "tree", "", ""],
		["", "", "tree", "", ""],
		["", "", "tree", "", ""],
		["", "tree", "tree", "tree", ""],
		["", "tree", "§tree", "tree", ""],
		
	]),
	growtimeMin: 40,
	growtimeMax: 100,
	saplingDropChance: 5,
	woodFromTree: 4,
});
plants.registerTree({
	name: "aspen",
	tree: dragonblocks.getPixelManipulator([
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["", "tree", ""],
		["", "tree", ""],
		["", "§tree", ""],
		
	]),
	growtimeMin: 30,
	growtimeMax: 40,
	saplingDropChance: 6,
	woodFromTree: 4,
});
plants.registerSimple({
	name: "papyrus",
	growtimeMin: 15,
	growtimeMax: 25,
	maxHeight: 4,
	mobstable: false,
	dropAbove: true,
	growOn: "dirt",
});
plants.registerSimple({
	name: "cactus",
	growtimeMin: 50,
	growtimeMax: 60,
	maxHeight: 5,
	hardness: 6,
	groups: ["choppy"],
	growOn: "core:sand",
});
