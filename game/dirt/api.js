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
		onset: (map, x, y) => {
			map.getNode(x, y).meta.dirtInterval = setInterval(_ => {
				for(let ix = x - 1; ix <= x + 1; ix++)
					for(let iy = y - 1; iy <= y + 1; iy++)
						if(dblib.random(0, 60) == 0 && map.getNode(ix, iy) && map.getNode(ix, iy).name == "dirt:dirt" && map.getNode(ix, iy - 1) && ! map.getNode(ix, iy - 1).stable)
							map.setNode(ix, iy, name);
				if(dblib.random(0, 45) == 0 && map.getNode(x, y - 1) && map.getNode(x, y - 1).stable)
					map.setNode(x, y, "dirt:dirt");
			}, 1000);
		},
		onremove: (map, x, y) => {
			clearInterval(map.getNode(x, y).meta.dirtInterval);
		}
	});
}
