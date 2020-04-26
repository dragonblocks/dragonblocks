music = {};
music.settings = $.getJSON(dragonblocks.getModpath("music") + "/settings.json").responseJSON;
{
	let display = document.createElement("audio");
	display.src = dragonblocks.getSound("music.ogg");
	display.volume = music.settings.volume;
	display.loop = true;
	display.controls = true;
	display.style.borderStyle = "outset";
	display.style.backgroundColor = "#F1F3F4";
	setTimeout(_ => {
		if(music.settings.autoplay)
			display.play();
	}, music.settings.delay * 1000);
	dragonblocks.menu.addElement(display);
}
dragonblocks.registerChatcommand({
	name: "music",
	param: "play | pause | volume [<volume>]",
	desc: "Play/Pause Music or set Volume (0-1)",
	func: arg => {
		let audio = document.getElementById("music");
		switch(arg.split(" ")[0]){
			case "play":
				audio.play();
				dragonblocks.chatMessage("Music is now Playing.");
				break;
			case "pause":
				audio.pause();
				dragonblocks.chatMessage("Music Paused.");
				break;
			case "volume":
				let volume = parseFloat(arg.split(" ")[1]);
				if(volume == NaN || volume > 1 || volume < 0)
					dragonblocks.chatMessage("Invalid Volume.");
				else{
					audio.volume =  volume;
					dragonblocks.chatMessage("Volume set to " + volume);
				}
				break;
			default:
				dragonblocks.chatMessage("Invalid Usage.");
				break;
		}
	}
});
