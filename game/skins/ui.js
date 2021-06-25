dragonblocks.registerChatcommand({
	name: "skin",
	param: "[<skin>]",
	desc: "Set your skin or show the skin list",
	func: arg => {
		if (! arg) {
			for (let skin in dragonblocks.registeredSkins) {
				let def = dragonblocks.registeredSkins[skin];
				dragonblocks.chatMessage(def.name + (def.desc ? ": " + def.desc : ""));
			}
		} else {
			if (dragonblocks.registeredSkins[arg]) {
				dragonblocks.player.setSkin(arg);
				dragonblocks.chatMessage("Skin set to " + arg + ".");
			} else {
				dragonblocks.chatMessage("Unknown skin.");
			}
		}
	}
});
