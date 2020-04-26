dragonblocks.registerNode({
	name: "minecraft:cobblestone",
	stable: true,
	texture: "minecraft_cobblestone.png",
	groups: ["cracky"],
	hardness: 9,
	desc: "Cobblestone",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:pumpkin",
	stable: true,
	texture: "minecraft_pumpkin.png",
	groups: ["snappy"],
	hardness: 4,
	desc: "Pumpkin",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:sponge",
	stable: true,
	texture: "minecraft_sponge.png",
	groups: ["snappy"],
	hardness: 2,
	desc: "Sponge",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:wet_sponge",
	stable: true,
	texture: "minecraft_wet_sponge.png",
	groups: ["snappy"],
	hardness: 2,
	desc: "Wet Sponge",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:bedrock",
	stable: true,
	texture: "minecraft_bedrock.png",
	groups: ["cracky"],
	hardness: Infinity,
	desc: "Bedrock",
	onblast: _ => {
		return false;
	},
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:bricks",
	stable: true,
	texture: "minecraft_bricks.png",
	groups: ["cracky"],
	hardness: 9,
	desc: "Bricks",
	physics:true,
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:soul_sand",
	stable: true,
	texture: "minecraft_soul_sand.png",
	groups: ["crumbly"],
	hardness: 3,
	desc: "Soul Sand",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:sand",
	stable: true,
	texture: "minecraft_sand.png",
	groups: ["crumbly"],
	hardness: 3,
	desc: "Sand",
	physics:true,
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:red_sand",
	stable: true,
	texture: "minecraft_red_sand.png",
	groups: ["crumbly"],
	hardness: 3,
	desc: "Red Sand",
	physics:true,
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:sandstone",
	stable: true,
	texture: "minecraft_sandstone.png",
	groups: ["cracky"],
	hardness: 8,
	desc: "Sandstone",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:red_sandstone",
	stable: true,
	texture: "minecraft_red_sandstone.png",
	groups: ["cracky"],
	hardness: 8,
	desc: "Red Sandstone",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:chisel_sandstone",
	stable: true,
	texture: "minecraft_chisel_sandstone.png",
	groups: ["cracky"],
	hardness: 8,
	desc: "Chisel Sandstone",
	stacksize: 64,
});
dragonblocks.registerNode({
	name: "minecraft:red_chisel_sandstone",
	stable: true,
	texture: "minecraft_red_chisel_sandstone.png",
	groups: ["cracky"],
	hardness: 8,
	desc: "Red Chisel Sandstone",
	stacksize: 64,
});
plants.registerTree({
	name: "oak",
	tree: dragonblocks.getPixelManipulator([
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["leaves", "leaves", "leaves"],
		["", "tree", ""],
		["", "§tree", ""],
	]),
	growtimeMin: 25,
	growtimeMax: 30,
	saplingDropChance: 3,
	treeName: "Log",
	woodName: "Planks",
	woodFromTree: 4,
	stacksize: 64,
})
