doors = {};
doors.registerDoor = function(obj){
	if(! obj || ! obj.name)
		return;
	obj.desc = obj.desc || dblib.humanFormat(obj.name) + " Door";
	obj.hardness = obj.hardness || 1;
	obj.groups = obj.groups || [];
	let name = "doors:" + "door_" + obj.name;
	let texture = "doors_" + "door_" + obj.name;
	let sound = "doors_" + "door_" + obj.name;
	dragonblocks.registerItem({
		name: name,
		groups: obj.groups,
		desc: obj.desc,
		texture: texture + ".png",
		onuse: (map, x, y) => {
			if(! map.getNode(x, y) || map.getNode(x, y).stable || ! map.getNode(x, y - 1) || map.getNode(x, y - 1).stable)
				return false;
			map.setNode(x, y - 1, name + "_front_upper");
			map.setNode(x, y, name + "_front_downer");
			dragonblocks.items[name].playSound("place");
			return true;
		},
		stacksize: obj.stacksize,
	});
	dragonblocks.registerNode({
		name: name + "_front_upper",
		groups: obj.groups,
		stable: true,
		mobstable: false,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + "_front_upper.png",
		ondig: (map, x, y) => {
			if(map.getNode(x, y + 1) && map.getNode(x, y + 1).name == name + "_front_downer")
				map.setNode(x, y + 1, "air");
		},
		onclick: (map, x, y) => {
			if(map.getNode(x, y + 1) && map.getNode(x, y + 1).name == name + "_front_downer")
				map.setNode(x, y + 1, name + "_side_downer");
			map.setNode(x, y, name + "_side_upper");
			dragonblocks.playSound(sound + "_close.ogg");
		},
		drops: name,
		hidden: true
	});
	dragonblocks.registerNode({
		name: name + "_front_downer",
		groups: obj.groups,
		stable: true,
		mobstable: false,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + "_front_downer.png",
		ondig: (map, x, y) => {
			if(map.getNode(x, y - 1) && map.getNode(x, y - 1).name == name + "_front_upper")
				map.setNode(x, y - 1, "air");
		},
		onclick: (map, x, y) => {
			if(map.getNode(x, y - 1) && map.getNode(x, y - 1).name == name + "_front_upper")
				map.setNode(x, y - 1, name + "_side_upper");
			map.setNode(x, y, name + "_side_downer");
			dragonblocks.playSound(sound + "_close.ogg");
		},
		drops: name,
		hidden: true
	});
	dragonblocks.registerNode({
		name: name + "_side_upper",
		groups: obj.groups,
		stable: true,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + "_side.png",
		ondig: (map, x, y) => {
			if(map.getNode(x, y + 1) && map.getNode(x, y + 1).name == name + "_side_downer")
				map.setNode(x, y + 1, "air");
		},
		onclick: (map, x, y) => {
			if(map.getNode(x, y + 1) && map.getNode(x, y + 1).name == name + "_side_downer")
				map.setNode(x, y + 1, name + "_front_downer");
			map.setNode(x, y, name + "_front_upper");
			dragonblocks.playSound(sound + "_open.ogg");
		},
		drops: name,
		hidden: true
	});
	dragonblocks.registerNode({
		name: name + "_side_downer",
		groups: obj.groups,
		stable: true,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + "_side.png",
		ondig: (map, x, y) => {
			if(map.getNode(x, y - 1) && map.getNode(x, y - 1).name == name + "_side_upper")
				map.setNode(x, y - 1, "air");
		},
		onclick: (map, x, y) => {
			if(map.getNode(x, y - 1) && map.getNode(x, y - 1).name == name + "_side_upper")
				map.setNode(x, y - 1, name + "_front_upper");
			map.setNode(x, y, name + "_front_downer");
			dragonblocks.playSound(sound + "_open.ogg");
		},
		drops: name,
		hidden: true
	});
	if(obj.material)
		dragonblocks.registerRecipe({
			result: name,
			recipe: [
				[obj.material, obj.material],
				[obj.material, obj.material],
				[obj.material, obj.material],
			],
		});
}
doors.registerTrapdoor = function(obj){
	if(! obj || ! obj.name)
		return;
	obj.mod = obj.mod || "doors";
	obj.desc = obj.desc || dblib.humanFormat(obj.name) + " Trapdoor";
	obj.hardness = obj.hardness || 1;
	obj.groups = obj.groups || [];
	let name = obj.mod + ":" + "trapdoor_" + obj.name;
	let texture = obj.mod + "_" + "trapdoor_" + obj.name;
	let sound = obj.mod + "_" + "trapdoor_" + obj.name;
	dragonblocks.registerNode({
		name: name,
		groups: obj.groups,
		stable: true,
		mobstable: false,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + ".png",
		onclick: (map, x, y) => {
			map.setNode(x, y, name + "_closed");
			dragonblocks.playSound(sound + "_close.ogg");
		},
		stacksize: obj.stacksize,
	});
	dragonblocks.registerNode({
		name: name + "_closed",
		groups: obj.groups,
		stable: true,
		hardness: obj.hardness,
		desc: obj.desc,
		texture: texture + "_closed.png",
		onclick: (map, x, y) => {
			map.setNode(x, y, name);
			dragonblocks.playSound(sound + "_open.ogg");
		},
		drops: name,
		hidden: true
	});
	if(obj.material)
		dragonblocks.registerRecipe({
			result: name + " 2",
			recipe: [
				[obj.material, obj.material, obj.material],
				[obj.material, obj.material, obj.material],
			],
		});
}
