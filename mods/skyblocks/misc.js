dragonblocks.tools["dragonblocks:hand"].groups.push({
	name: "choppy",
	damage: 0,
});
dragonblocks.registerOnSetNode((x, y) => {
	dragonblocks.finishTimer("growTimer", dragonblocks.getNode(x, y).meta)
});
 
