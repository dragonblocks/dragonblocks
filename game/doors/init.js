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
		onuse: (x, y) => {
			if(! dragonblocks.getNode(x, y) || dragonblocks.getNode(x, y).stable || ! dragonblocks.getNode(x, y - 1) || dragonblocks.getNode(x, y - 1).stable)
				return false;
			dragonblocks.setNode(x, y - 1, name + "_front_upper");
			dragonblocks.setNode(x, y, name + "_front_downer");
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
		ondig: (x, y) => {
			if(dragonblocks.getNode(x, y + 1) && dragonblocks.getNode(x, y + 1).name == name + "_front_downer")
				dragonblocks.setNode(x, y + 1, "air");
		},
		onclick: (x, y) => {
			if(dragonblocks.getNode(x, y + 1) && dragonblocks.getNode(x, y + 1).name == name + "_front_downer")
				dragonblocks.setNode(x, y + 1, name + "_side_downer");
			dragonblocks.setNode(x, y, name + "_side_upper");
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
		ondig: (x, y) => {
			if(dragonblocks.getNode(x, y - 1) && dragonblocks.getNode(x, y - 1).name == name + "_front_upper")
				dragonblocks.setNode(x, y - 1, "air");
		},
		onclick: (x, y) => {
			if(dragonblocks.getNode(x, y - 1) && dragonblocks.getNode(x, y - 1).name == name + "_front_upper")
				dragonblocks.setNode(x, y - 1, name + "_side_upper");
			dragonblocks.setNode(x, y, name + "_side_downer");
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
		ondig: (x, y) => {
			if(dragonblocks.getNode(x, y + 1) && dragonblocks.getNode(x, y + 1).name == name + "_side_downer")
				dragonblocks.setNode(x, y + 1, "air");
		},
		onclick: (x, y) => {
			if(dragonblocks.getNode(x, y + 1) && dragonblocks.getNode(x, y + 1).name == name + "_side_downer")
				dragonblocks.setNode(x, y + 1, name + "_front_downer");
			dragonblocks.setNode(x, y, name + "_front_upper");
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
		ondig: (x, y) => {
			if(dragonblocks.getNode(x, y - 1) && dragonblocks.getNode(x, y - 1).name == name + "_side_upper")
				dragonblocks.setNode(x, y - 1, "air");
		},
		onclick: (x, y) => {
			if(dragonblocks.getNode(x, y - 1) && dragonblocks.getNode(x, y - 1).name == name + "_side_upper")
				dragonblocks.setNode(x, y - 1, name + "_front_upper");
			dragonblocks.setNode(x, y, name + "_front_downer");
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
		onclick: (x, y) => {
			dragonblocks.setNode(x, y, name + "_closed");
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
		onclick: (x, y) => {
			dragonblocks.setNode(x, y, name);
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
