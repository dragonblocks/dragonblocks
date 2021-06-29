torch = {};
torch.directions = ["floor", "left", "right", "ceiling"];
torch.check = function(direction, map, x, y){
	switch(direction){
		case "floor":
			return ! map.getNode(x, y + 1) || map.getNode(x, y + 1).stable;
		case "left":
			return ! map.getNode(x - 1, y) || map.getNode(x - 1, y).stable;
		case "right":
			return ! map.getNode(x + 1, y) || map.getNode(x + 1, y).stable;
		case "ceiling":
			return ! map.getNode(x, y - 1) || map.getNode(x, y - 1).stable;
	}
}
dragonblocks.registerItem({
	name: "torch:torch",
	desc: "Torch",
	texture: "torch_torch_floor.png",
	onuse: (map, x, y) => {
		for(let direction of torch.directions)
			if(dragonblocks.player.place(map, x, y, dragonblocks.nodes["torch:torch_" + direction]))
				return true;
	}
});
for(let direction of torch.directions){
	dragonblocks.registerNode({
		name: "torch:torch_" + direction,
		desc: "Torch",
		drops: "torch:torch",
		stable: true,
		mobstable: false,
		hardness: 1,
		texture: "torch_torch_" + direction + ".png",
		groups:["snappy"],
		hidden: true,
		onactivate: (map, x, y) => {
			if(! torch.check(direction, map, x, y))
				map.setNode(x, y, "air");
		},
		onplace: (map, x, y) => {
			if(! torch.check(direction, map, x, y))
				return false;
		}
	});
}
dragonblocks.registerRecipe({
	result: "torch:torch 4",
	recipe: [
		["ores:coal"],
		["tools:stick"],
	]
});
