fire = {};
fire.playingBurnSounds = 0;
fire.playBurnSound = function(){
	if(fire.playingBurnSounds > 2)
		return;
	fire.playingBurnSounds++;
	let audio = new Audio(dragonblocks.getSound("fire_burn.ogg"));
	audio.onended = _ => {
		fire.playingBurnSounds--;
	};
	audio.play();
}
fire.catchfire = function(map, x, y){
	let mapNode = map.getNode(x, y);
	if(mapNode && mapNode.toNode().flammable){
		if(mapNode.toNode().onfire && mapNode.toNode().onfire(x, y) == false)
			return;
		dragonblocks.player.place(map, x, y - 1, "fire:fire");
	}
}
dragonblocks.registerGroup({
	name: "flammable",
});
dragonblocks.registerNode({
	name: "fire:fire",
	stable: false,
	texture: "fire_fire.png",
	groups: [],
	hardness: 1,
	desc: "Fire",
	drops: "",
	sounds: {
		dug: "fire_dug.ogg",
		place: "",
	},
	onset: (map, x, y) => {
		let meta = map.getNode(x, y).meta;
		meta.fireInterval = setInterval(_ => {
			if(dblib.random(0, 6) == 0);
				fire.playBurnSound();
			for(let ix = x - 1; ix <= x + 1; ix++){
				for(let iy = y - 1; iy <= y + 2; iy++){
					if(dblib.random(0, 3) == 0)
						fire.catchfire(map, ix, iy);
				}
			}
			if (! map.getNode(x, y + 1) || ! map.getNode(x, y + 1).toNode().inGroup("flammable")) {
				if (dblib.random(0, 20) == 0)
					map.setNode(x, y, "air");
			} else if (dblib.random(0, map.getNode(x, y + 1).toNode().hardness * 2) == 0) {
				dragonblocks.player.dig(map, x, y + 1);
			}
		}, 1000);
	},
	onremove: (map, x, y) => {
		clearInterval(map.getNode(x, y).meta.fireInterval);
	}
});
