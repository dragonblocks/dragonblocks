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
fire.catchfire = function(x, y){
	let mapNode = dragonblocks.getNode(x, y);
	if(mapNode && mapNode.toNode().flammable){
		if(mapNode.toNode().onfire && mapNode.toNode().onfire(x, y) == false)
			return;
		dragonblocks.player.place(x, y - 1, "fire:fire");
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
	onset : (x, y) => {
		let meta = dragonblocks.getNode(x, y).meta;
		meta.fireInterval = setInterval(_ => {
			if(dblib.random(0, 6) == 0);
				fire.playBurnSound();
			for(let ix = x - 1; ix <= x + 1; ix++){
				for(let iy = y - 1; iy <= y + 2; iy++){
					if(dblib.random(0, 3) == 0)
						fire.catchfire(ix, iy);
				}
			}
			if(! dragonblocks.getNode(x, y + 1) || ! dragonblocks.getNode(x, y + 1).toNode().inGroup("flammable")){
				if(dblib.random(0, 20) == 0)
					dragonblocks.setNode(x, y, "air");
			}
			else if(dblib.random(0, dragonblocks.getNode(x, y + 1).toNode().hardness * 2) == 0)
				dragonblocks.player.dig(x, y + 1);
		}, 1000);
	},
	onremove : (x, y) => {
		clearInterval(dragonblocks.getNode(x, y).meta.fireInterval);
	}
});
