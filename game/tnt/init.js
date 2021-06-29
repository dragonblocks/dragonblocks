tnt = {};
tnt.explosion = new dragonblocks.Schematic([
	["", "air", "air", "air", ""],
	["air", "air", "air", "air", "air"],
	["air", "air", "§air", "air", "air"],
	["air", "air", "air", "air", "air"],
	["", "air", "air", "air", ""],
]);
tnt.explosion.addFunction((node, map, x, y) => {
	if(node.onblast && node.onblast(map, x, y) == false)
		return false;
	return dblib.random(0, 100) < 90;
});
tnt.ignite = function(map, x, y, time){
	dragonblocks.setTimer("tntTimer", time, _ => {
		tnt.explode(map, x, y);
	}, map.getNode(x, y).meta);
}
tnt.explode = function(map, x, y){
	map.setNode(x, y, "air");
	dragonblocks.playSound("tnt_explode.ogg");
	tnt.explosion.apply(map, x, y);
}
dragonblocks.registerNode({
	name: "tnt:tnt",
	groups: ["snappy"],
	hardness: 3,
	stable: true,
	desc: "TNT",
	texture: "tnt_tnt.png",
	onfire: (x, y) => {
		dragonblocks.playSound("tnt_ignite.ogg");
		map.setNode(x, y, "tnt:active_tnt");
	},
	onblast: (map, x, y) => {
		tnt.ignite(map, x, y, 0.1);
	},
	onclick: (map, x, y) => {
		if(dragonblocks.player.getWieldedItem().item == "torch:torch"){
			dragonblocks.playSound("tnt_ignite.ogg");
			map.setNode(x, y, "tnt:active_tnt");
		}
	},
	flammable: true
});
dragonblocks.registerNode({
	name: "tnt:active_tnt",
	groups: [],
	hardness: 1,
	stable: true,
	desc: "TNT (active)",
	texture: "tnt_active_tnt.png",
	onset: (map, x, y) => {
		tnt.ignite(map, x, y, 4);
	},
	ondig: _ => {
		return false;
	},
	onblast: _ => {
		return false;
	},
	hidden: true
});
dragonblocks.registerNode({
	name: "tnt:gunpowder",
	groups: ["snappy"],
	hardness: 1,
	stable: true,
	mobstable: false,
	desc: "Gunpowder",
	texture: "tnt_gunpowder.png",
	onclick: (map, x, y) => {
		if(dragonblocks.player.getWieldedItem().item == "torch:torch_floor")
			map.setNode(x, y, "tnt:active_gunpowder");
	},
	hidden: true,
});
dragonblocks.registerNode({
	name: "tnt:active_gunpowder",
	groups: ["snappy"],
	hardness: 1,
	stable: true,
	mobstable: false,
	desc: "Gunpowder (active)",
	texture: "tnt_active_gunpowder.png",
	drops: "tnt:gunpowder",
	onset: (map, x, y) => {
		let meta = map.getNode(x, y).meta;
		meta.gunpowderTime = 1;
		meta.gunpowderInterval = setInterval(_ => {
			meta.gunpowderTime -= 0.1;
			if(meta.gunpowderTime <= 0){
				map.setNode(x, y, "air");
				for(let [ix, iy] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]){
					if(map.getNode(ix, iy).name == "tnt:gunpowder")
						map.setNode(ix, iy, "tnt:active_gunpowder");
					else if(map.getNode(ix, iy).name == "tnt:tnt")
						tnt.ignite(map, ix, iy, tnt.time);
				}
				clearInterval(meta.gunpowderInterval);
			}
		}, 100);
	},
	onremove: (map, x, y) => {
		clearInterval(map.getNode(x, y).meta.gunpowderInterval);
	},
	hidden: true
});
