tools = {};
dragonblocks.registerItem({
	name: "tools:stick",
	texture: "tools_stick.png",
	desc: "Stick",
});
tools.typelist = [
	{
		name: "pickaxe",
		interval: 600,
		group: "cracky",
		recipe: [
			["material", "material", "material"],
			["", "tools:stick", ""],
			["", "tools:stick", ""],
		]
	},
	{
		name: "axe",
		interval: 700, 
		group: "choppy",
		recipe: [
			["material", "material"],
			["material", "tools:stick"],
			["", "tools:stick"],
		]
	},
	{
		name: "shovel", 
		interval: 550, 
		group: "crumbly",
		recipe: [
			["material"],
			["tools:stick"],
			["tools:stick"],
		]
	}
];
tools.registerToolset = function(obj){
	if(! obj || ! obj.name || ! obj.level || ! obj.material)
		return;
	let globalname = "tools:" + obj.name;
	for(let tooltype of dblib.replaceRecursive(tools.typelist, "material", obj.material)){
		let name = globalname + "_" + tooltype.name;
		dragonblocks.registerTool({
			name: name,
			groups: [
				{
					name: "default",
					damage: 2
				},
				{
					name: tooltype.group,
					damage: obj.level * 2
				},
			],
			interval: tooltype.interval,
		});
		dragonblocks.registerItem({
			name: name,
			texture: "tools_" + obj.name + "_" + tooltype.name + ".png",
			desc: dblib.humanFormat(obj.name + "_" + tooltype.name),
		});
		dragonblocks.registerRecipe({
			result: name,
			recipe: tooltype.recipe,
		})
	}
}
