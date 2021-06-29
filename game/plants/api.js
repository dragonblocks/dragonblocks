dragonblocks.registerGroup({
	name: "plants_wood",
});
dragonblocks.registerGroup({
	name: "plants_tree",
});
plants.registerTree = function(obj){
	if(! (obj.name && obj.tree && obj.growtimeMin && obj.growtimeMax && obj.saplingDropChance))
		return;
	obj.desc = obj.desc || dblib.humanFormat(obj.name);
	obj.leavesName = obj.leavesName || "Leaves";
	obj.treeName = obj.treeName || "Tree";
	obj.woodName = obj.woodName || "Wood";
	obj.saplingName = obj.saplingName || "Sapling";
	obj.woodFromTree = obj.woodFromTree || 1;
	let name = "plants:" + obj.name;
	let texture = "plants_" + obj.name;
	obj.tree.replace("leaves", name + "_leaves");
	obj.tree.replace("tree", name + "_tree");
	obj.tree.addFunction((node, map, x, y) => {
		if(node.stable && node.name != name + "_sapling")
			return false;
	});
	dragonblocks.registerNode({
		name: name + "_sapling",
		stable: true,
		mobstable: false,
		texture: texture + "_sapling.png",
		groups: ["snappy"],
		hardness: 2,
		onset: (map, x, y) => {
			dragonblocks.setTimer("growTimer", dblib.random(obj.growtimeMin, obj.growtimeMax), _ => {
				obj.tree.apply(map, x, y);
			}, map.getNode(x, y).meta);
		},
		onremove: (map, x, y) => {
			dragonblocks.clearTimer("growTimer", map.getNode(x, y).meta);
		},
		onplace: (map, x, y) => {
			if(map.getNode(x, y + 1) && ! map.getNode(x, y + 1).toNode().inGroup("dirt"))
				return false;
		},
		desc: obj.desc + " " + obj.saplingName,
		stacksize: obj.stacksize,
		flammable: true,
	});
	dragonblocks.registerNode({
		name: name + "_tree",
		stable: true,
		mobstable: false,
		zIndex: -1,
		texture: texture + "_tree.png",
		groups: ["choppy", "plants_tree"],
		hardness: 7,
		desc: obj.desc + " " + obj.treeName,
		stacksize: obj.stacksize,
		flammable: true,
		onplace: (map, x, y) => {
			setTimeout(_ => {
				map.getNode(x, y).mobstable = true;
			});
		}
	});
	dragonblocks.registerNode({
		name: name + "_wood",
		stable: true,
		texture: texture + "_wood.png",
		groups: ["choppy", "plants_wood"],
		hardness: 6,
		desc: obj.desc + " " + obj.woodName,
		stacksize: obj.stacksize,
		flammable: true,
	});
	dragonblocks.registerNode({
		name: name + "_leaves",
		stable: true,
		mobstable: false,
		zIndex: -1,
		texture: texture + "_leaves.png",
		groups: ["snappy"],
		hardness: 3,
		drops: _ => {
			if(dblib.random(0, obj.saplingDropChance) == 0)
				return name + "_sapling";
			return name + "_leaves";
		},
		desc: obj.desc + " " + obj.leavesName,
		stacksize: obj.stacksize,
		flammable: true,
	});
	dragonblocks.registerRecipe({
		result: name + "_wood " + obj.woodFromTree,
		recipe: [
			[name + "_tree"]
		]
	});
}
plants.registerSimple = function(obj){
	if(! obj || ! obj.name || ! obj.growtimeMin || ! obj.growtimeMax || ! obj.maxHeight || ! obj.growOn)
		return;
	obj.desc = obj.desc || dblib.humanFormat(obj.name);
	obj.hardness = obj.hardness || 2,
	obj.groups = obj.groups || ["snappy"];
	let name = "plants:" + obj.name;
	dragonblocks.registerNode({
		name: name,
		texture: "plants_" + obj.name + ".png",
		stable: true,
		mobstable: obj.mobstable,
		groups: obj.groups,
		hardness: obj.hardness,
		desc: obj.desc || dblib.humanFormat(obj.name),
		onset: (map, x, y) => {
			let meta = map.getNode(x, y).meta;
			meta.growTime = dblib.random(obj.growtimeMin, obj.growtimeMax);
			meta.growInterval = setInterval(_ => {
				if(! map.getNode(x, y - 1) || map.getNode(x, y - 1).stable)
					return meta.growTime = dblib.random(obj.growtimeMin, obj.growtimeMax);
				let iy = y + 1;
				while(true){
					if(! map.getNode(x, iy))
						return meta.growTime = dblib.random(obj.growtimeMin, obj.growtimeMax);
					else if(iy == y + obj.maxHeight)
						return meta.growTime = dblib.random(obj.growtimeMin, obj.growtimeMax);
					else if(! dragonblocks.itemMatch(obj.growOn, map.getNode(x, iy)))
						break;
					else if(map.getNode(x, iy).name == name)
						iy++;
					else
						return meta.growTime = dblib.random(obj.growtimeMin, obj.growtimeMax);
				}
				meta.growTime--;
				if(meta.growTime <= 0)
					map.setNode(x, y - 1, name);
			}, 1000);
		},
		onremove: (map, x, y) => {
			  clearInterval(map.getNode(x, y).meta.growInterval);
		},
		ondig: (map, x, y) => {
			if(obj.dropAbove && map.getNode(x, y - 1) && map.getNode(x, y - 1).name == name)
				dragonblocks.player.digEnd(x, y - 1);
		},
		stacksize: obj.stacksize,
		flammable: true,
	});
}
plants.registerFlower = function(){}
plants.registerGrass = function(){}
