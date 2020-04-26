dragonblocks.registerEntity({
	name: "mobs:ball",
	desc: "Ball",
	texture: "mobs_ball.png",
	width: 0.75,
	height: 0.75,
	verticalSpeed: 10,
	gravity: true,
	onpunch: self => {
		self.despawn();
	},
	onclick: self => {
		self.jumpOnce();
	},
});
mobs.registerSpawner("mobs:ball");
dragonblocks.registerEntity({
	name: "mobs:bubble",
	desc: "Bubble",
	texture: "mobs_bubble.png",
	width: 0.5,
	height: 0.5,
	verticalSpeed: 1,
	gravity: false,
	onpunch: self => {
		self.despawn();
	},
	oncollide: self => {
		self.despawn();
	},
	oninit: self => {
		self.horizontalSpeed = dblib.random(0, 10) / 10;
		self.moveUp();
		dblib.random(0, 1) == 0 ? self.moveRight() : self.moveLeft();
	},
	onspawn: self => {
		dragonblocks.setTimer("burstTimer", dblib.random(10, 40) / 10, _ => {self.despawn()}, self.meta);
	}
});
mobs.registerSpawner("mobs:bubble");
dragonblocks.registerEntity({
	name: "mobs:snowball",
	desc: "Snowball",
	texture: "mobs_snowball.png",
	width: 1,
	height: 1,
	horizontalSpeed: 1,
	verticalSpeed: 1,
	gravity: true,
	oncollide: self => {
		self.despawn();
	},
	oninit: self => {
		self.horizontalSpeed = (self.x - dragonblocks.player.x) * 5;
		self.verticalSpeed = (self.y - dragonblocks.player.y) * 5;
		self.x = dragonblocks.player.x;
		self.y = dragonblocks.player.y;
		self.moveDown();
		self.moveRight();
	},
});
mobs.registerSpawner("mobs:snowball");
dragonblocks.registerRecipe({
	result: "mobs:snowball 4",
	recipe: [["core:snow"]],
});
