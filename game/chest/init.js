dragonblocks.registerNode({
	name: "chest:chest",
	texture: "chest_chest.png",
	groups: ["choppy"],
	hardness: 6,
	desc: "Chest",
	stable: true,
	onset: (map, x, y) => {
		let meta = map.getNode(x, y).meta;
		meta.inventory = new dragonblocks.Inventory(32, 8);
		if(meta.inventoryString)
			meta.inventory.deserialize(meta.inventoryString);
	},
	onclick: (map, x, y) => {
		let meta = map.getNode(x, y).meta;
		dragonblocks.player.setInventoryElements([meta.inventory, dragonblocks.player.tmp.mainInventory]);
		dragonblocks.player.openInventory();
		dragonblocks.nodes["chest:chest"].playSound("open");
		dragonblocks.player.onNextInventoryClose = _ => {
			dragonblocks.player.resetInventoryElements();
			dragonblocks.nodes["chest:chest"].playSound("close");
			meta.inventoryString = meta.inventory.serialize();
		};
	},
	ondig: (map, x, y) => {
		return map.getNode(x, y).meta.inventory.isEmpty();
	},
	sounds: {
		open: "chest_open.ogg",
		close: "chest_close.ogg",
	}
});
dragonblocks.registerRecipe({
	result: "chest:chest",
	recipe: [
		["plants_wood", "plants_wood", "plants_wood"],
		["plants_wood", "", "plants_wood"],
		["plants_wood", "plants_wood", "plants_wood"],
	]
});
