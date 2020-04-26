dragonblocks.registerNode({
	name: "skyblocks:skyblock",
	groups: ["glass"],
	desc: "Skyblock",
	texture: "skyblocks_skyblock.png",
	hardness: 4,
	stable: true,
	ondig: _ => {
		return false;
	},
	onclick: _ => {
		skyblocks.gui.open();
	},
});
dragonblocks.mapgen.list["skyblocks"]  = function(){
	dragonblocks.getPixelManipulator([
		["dirt:grass", "dirt:grass", "§skyblocks:skyblock", "dirt:grass", "dirt:grass"],
		["", "dirt:dirt", "dirt:dirt", "dirt:dirt", ""],
		["", "", "dirt:dirt", "", ""],
		
	]).apply(parseInt(dragonblocks.map.width / 2), parseInt(dragonblocks.map.height / 2));
}
dragonblocks.mapgen.selected = "skyblocks"; 
