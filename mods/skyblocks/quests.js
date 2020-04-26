skyblocks.quests = $.getJSON(dragonblocks.getModpath("skyblocks") + "/quests.json").responseJSON;
dragonblocks.registerOnStarted(_ => {
	let meta = dragonblocks.player.meta;
	if(! meta.skyblocksQuests)
		meta.skyblocksQuests = {};
	for(let quest of skyblocks.quests)
		meta.skyblocksQuests[quest.name] = meta.skyblocksQuests[quest.name] || 0;
	skyblocks.update();
});
skyblocks.update = function(){
	let meta = dragonblocks.player.meta;
	for(let quest of skyblocks.quests)
		if(meta.skyblocksQuests[quest.name] == quest.count){
			dragonblocks.player.give(quest.reward);
			meta.skyblocksQuests[quest.name]++;
			dragonblocks.playSound("skyblocks_finish_quest.ogg");
			chat.send(".me completed the quest '" + quest.name + "' [skyblocks]");
		}
	skyblocks.gui.getDisplay().dispatchEvent(new Event("update"));
}
skyblocks.event = function(action, param){
	for(let quest of skyblocks.quests){
		if(quest.action == action && dragonblocks.itemMatch(quest.param, param))
			dragonblocks.player.meta.skyblocksQuests[quest.name]++;
	}
	skyblocks.update();
}
dragonblocks.registerOnPlaceNode(node => {
	skyblocks.event("place", node);
});
dragonblocks.registerOnDigNode((x, y) => {
	skyblocks.event("dig", dragonblocks.getNode(x, y).toNode());
});
dragonblocks.registerOnUseItem(item => {
	skyblocks.event("use", item);
}); 
