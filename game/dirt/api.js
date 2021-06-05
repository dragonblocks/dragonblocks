dragonblocks.registerGroup({
	name: "dirt",
});
dirt.registerDirt = function(obj){
	if(! obj || ! obj.name)
		return;
	let desc = obj.desc || "Dirt with " + dblib.humanFormat(obj.name);
	let name = "dirt:" + obj.name;
	let texture = "dirt_" + obj.name + ".png";
	dragonblocks.registerNode({
		name: name,
		stable: true,
		texture: texture,
		groups: ["crumbly", "dirt"],
		hardness: 3,
		desc: desc,
		drops: "dirt:dirt",
		onset: (x, y) => {
			dragonblocks.getNode(x, y).meta.dirtInterval = setInterval(_ => {
				for(let ix = x - 1; ix <= x + 1; ix++)
					for(let iy = y - 1; iy <= y + 1; iy++)
						if(dblib.random(0, 60) == 0 && dragonblocks.getNode(ix, iy) && dragonblocks.getNode(ix, iy).name == "dirt:dirt" && dragonblocks.getNode(ix, iy - 1) && ! dragonblocks.getNode(ix, iy - 1).stable)
							dragonblocks.setNode(ix, iy, name);
				if(dblib.random(0, 45) == 0 && dragonblocks.getNode(x, y - 1) && dragonblocks.getNode(x, y - 1).stable)
					dragonblocks.setNode(x, y, "dirt:dirt");
			}, 1000);
		},
		onremove: (x, y) => {
			clearInterval(dragonblocks.getNode(x, y).meta.dirtInterval);
		}
	});
}
