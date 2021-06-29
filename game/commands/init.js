commands = {};
commands.help = function(name){
	let cmd = dragonblocks.chatcommands[name];
	if(! cmd)
		dragonblocks.chatMessage("The command " + name + " does not exist.");
	else
		dragonblocks.chatMessage("!HTML<b>" + dblib.htmlEntities("/" + cmd.name) + "</b> <i>" + dblib.htmlEntities(cmd.param) + "</i> : " + dblib.htmlEntities(cmd.desc));
}
dragonblocks.registerChatcommand({
	name: "help",
	desc: "Get help for one/all chatcommand(s)",
	param: "all | <command>",
	func: arg => {
		switch(arg){
			case "":
				dragonblocks.chatMessage("No command specified. Use /help all for a list of commands.");
				break;
			case "all":
				for(let cmd in dragonblocks.chatcommands)
					commands.help(cmd);
				break;
			default:
				commands.help(arg);
				break;
		}
	}
});
dragonblocks.registerChatcommand({
	name: "exit",
	desc: "Close the Chat",
	func: _ => {
		dragonblocks.chat.close();
	}
});
dragonblocks.registerChatcommand({
	name: "teleport",
	desc: "Teleport the Player somewhere",
	param: "<x> <y>",
	func: arg => {
		let x = parseInt(arg.split(" ")[0]);
		let y = parseInt(arg.split(" ")[1]);
		if(dragonblocks.player.map.withinBounds(x, y)){
			dragonblocks.player.teleport(x, y, true);
			dragonblocks.chatMessage("Teleported to " + x + ", " + y);
		}
		else
			dragonblocks.chatMessage("Can not teleport out of Map bounds.");
	}
});
dragonblocks.registerChatcommand({
	name: "setnode",
	desc: "Set a Node somewhere",
	param: "<x> <y> <node>",
	func: arg => {
		let x = parseInt(arg.split(" ")[0]);
		let y = parseInt(arg.split(" ")[1]);
		let node = arg.split(" ")[2];
		if(dragonblocks.player.map.withinBounds(x, y)){
			if(dragonblocks.nodes[node]){
				dragonblocks.player.map.setNode(x, y, node);
				dragonblocks.chatMessage("Set " + node + " to " + x + ", " + y);
			}
			else
				dragonblocks.chatMessage("Unknown Node.");
		}
		else
			dragonblocks.chatMessage("Can not set node out of Map bounds.");
	}
});
dragonblocks.registerChatcommand({
	name: "giveme",
	desc: "Add stuff to your inventory",
	param: "<itemstring>",
	func: arg => {
		if(! dragonblocks.isValidItemstring(arg)){
			dragonblocks.chatMessage(arg + " is not a valid Itemstring.");
			return;
		}
		dragonblocks.player.give(arg);
		dragonblocks.chatMessage(arg + " added to Inventory");
	}
});
dragonblocks.registerChatcommand({
	name: "clearinv",
	desc: "Clear your inventory",
	func: _ => {
		dragonblocks.player.clearInventory();
		dragonblocks.chatMessage("Iventory Cleared");
	}
});
dragonblocks.registerChatcommand({
	name: "clear",
	desc: "Clear the Chat",
	func: _ => {
		dragonblocks.chat.clear();
	}
});
dragonblocks.registerChatcommand({
	name: "gamemode",
	desc: "Set your gamemode",
	param: "survival | 0 | creative | 1",
	func: arg => {
		if(! arg)
			dragonblocks.chatMessage("Current Gamemode is " + dragonblocks.player.gamemode + ".");
		else if(dragonblocks.player.setGamemode(arg))
			dragonblocks.chatMessage("Set Gamemode to " + arg + ".");
		else
			dragonblocks.chatMessage("Gamemode could not been set to " + arg + ".");
	}
});
dragonblocks.registerChatcommand({
	name: "locate",
	desc: "Write all occurencies of a structure to chat. When no argument given, output supported structures by the used mapgen.",
	param: "[<structure>]",
	func: arg => {
		if(! arg){
			dragonblocks.chatMessage("Generated structures: ");
			let msg = ""
			for(let name in dragonblocks.world.structures)
				msg += name + ", ";
			dragonblocks.chatMessage(msg);
		}
		else if(dragonblocks.world.structures[arg]){
			dragonblocks.chatMessage("The structure '" + arg + "' can be found at the following positions:");
			for(let structure of dragonblocks.world.structures[arg])
				dragonblocks.chatMessage("!HTML <span style='color:#3FDFFE; cursor:pointer' title='Click to teleport' onclick='dragonblocks.player.teleport(" + structure.pos.x + ", " + structure.pos.y + ")'>&emsp;&emsp;" + structure.msg + "</span>")
		}
		else{
			dragonblocks.chatMessage("The structure '" + arg + "' is not supported by the used mapgen or was not generated.");
		}
	}
});
