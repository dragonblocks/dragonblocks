var wool = {};
wool.colors = ["black", "blue", "brown", "cyan", "dark_green", "dark_grey", "green", "grey", "magenta", "orange", "pink", "red", "violet", "white", "yellow"];
for(let color of wool.colors){
	dragonblocks.registerNode({
		name: "wool:" + color,
		stable: true,
		texture: "wool_" + color + ".png",
		groups: ["snappy", "flammable"],
		hardness: 4,
		desc: dblib.humanFormat(color) + " Wool",
		flammable: true,
	});
}
