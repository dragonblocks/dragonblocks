chat = {};
dragonblocks.registerOnChatMessage(msg => {
	if(dragonblocks.loggedin)
		chat.send(msg);
	else
		dragonblocks.chatMessage("<singleplayer> " + msg);
	return false;
});
chat.send = function(msg, sync){
	return $.post({
		async: ! sync,
		url: dragonblocks.getModpath("chat") + "/send.php",
		data: {msg: msg},
	});
}
chat.tick = function(){
	let request = $.get({
		async: true,
		ifModified: true,
		url: dragonblocks.getModpath("chat") + "/message.html",
		success: data => {
			if(data)
				dragonblocks.chatMessage("!HTML" + data);
			setTimeout(chat.tick, 100);
		},
	});
}
if(dragonblocks.loggedin){
	chat.send(".join") && chat.tick();
	dragonblocks.registerOnQuit(_ => {
		chat.send(".leave", true);
	});
}
