torch = {};
torch.directions = ["floor", "left", "right", "ceiling"];
torch.check = function(direction, x, y){
	switch(direction){
		case "floor":
			return ! dragonblocks.getNode(x, y + 1) || dragonblocks.getNode(x, y + 1).stable;
		case "left":
			return ! dragonblocks.getNode(x - 1, y) || dragonblocks.getNode(x - 1, y).stable;
		case "right":
			return ! dragonblocks.getNode(x + 1, y) || dragonblocks.getNode(x + 1, y).stable;
		case "ceiling":
			return ! dragonblocks.getNode(x, y - 1) || dragonblocks.getNode(x, y - 1).stable;
	}
}
dragonblocks.registerItem({
	name: "torch:torch",
	desc: "Torch",
	texture: "torch_torch_floor.png",
	onuse: (x, y) => {
		for(let direction of torch.directions)
			if(dragonblocks.player.place(x, y, dragonblocks.nodes["torch:torch_" + direction]))
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
		onactivate: (x, y) => {
			if(! torch.check(direction, x, y))
				dragonblocks.setNode(x, y, "air");
		},
		onplace: (x, y) => {
			if(! torch.check(direction, x, y))
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
