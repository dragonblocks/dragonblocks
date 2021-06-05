ores.registerOre = function(obj){
	if(! obj || ! obj.name || ! obj.hardness || ! obj.clustersize || isNaN(obj.deep) || isNaN(obj.factor))
		return;
	obj.modname = obj.modname || "ores";
	let name = obj.modname + ":" + obj.name;
	let desc = obj.desc || dblib.humanFormat(obj.name);
	let texture = obj.modname + "_" + obj.name;
	dragonblocks.registerItem({
		name: name,
		texture: texture + ".png",
		desc: obj.lumpname || desc,
		flammable: obj.flammable,
		hardness: obj.itemHardness
	});
	dragonblocks.registerNode({
		name: name + "_ore",
		stable: true,
		groups: ["cracky"],
		texture: texture + "_ore.png",
		desc: obj.orename || desc + " Ore",
		hardness: 11,
		drops: name,
	});
	dragonblocks.registerOre({
		name: name + "_ore",
		deep: obj.deep,
		clustersize: obj.clustersize,
		factor: obj.factor,
	});
	dragonblocks.registerNode({
		name: name + "_block",
		stable: true,
		groups: obj.groups || ["cracky"],
		texture: texture + "_block.png",
		desc: obj.blockname || desc + " Block",
		hardness: obj.hardness,
		flammable: obj.flammable,
	});
	if(obj.ingot){
		dragonblocks.registerItem({
			name: name + "_ingot",
			texture: texture + "_ingot.png",
			desc: obj.ingotname || desc + " Ingot",
		});
		furnace.registerRecipe({
			input: name,
			output: name + "_ingot",
			time: 5,
		});
		dragonblocks.registerRecipe({
			result: name + "_block",
			recipe:[
				[name + "_ingot", name + "_ingot", name + "_ingot"],
				[name + "_ingot", name + "_ingot", name + "_ingot"],
				[name + "_ingot", name + "_ingot", name + "_ingot"],
			]
		});
	}
	else{
		dragonblocks.registerRecipe({
			result: name + "_block",
			recipe:[
				[name, name, name],
				[name, name, name],
				[name, name, name],
			]
		});
	}
}
