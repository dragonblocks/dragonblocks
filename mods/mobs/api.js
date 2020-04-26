mobs.registerSpawner = function(name){
	let entity = dragonblocks.entities[name];
	dragonblocks.registerItem({
		name: name,
		desc: entity.desc || entity.name,
		texture: entity.texture,
		onuse: (x, y) => {
			dragonblocks.spawnEntity(name, x + (1 - entity.width) / 2, y + (1 - entity.height) / 2);
			return true;
		},
	});
}
