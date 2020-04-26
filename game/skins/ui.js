dragonblocks.registerChatcommand({
	name: "skin",
	param: "[<skin>]",
	desc: "Set your skin or show the skin list",
	func: arg => {
		if(! arg){
			for(let skin of dragonblocks.registeredSkins)
				dragonblocks.chatMessage(skin.name + (skin.desc ? ": " + skin.desc : ""));
		}
		else{
			if(dragonblocks.skins[arg]){
				dragonblocks.player.setSkin(arg);
				dragonblocks.chatMessage("Skin set to " + arg + ".");
			}
			else
				dragonblocks.chatMessage("Unknown skin.");
		}
	}
}); 
