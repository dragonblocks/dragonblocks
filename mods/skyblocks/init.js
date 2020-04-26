skyblocks = {};
for(let script of ["quests.js", "mapgen.js", "recipes.js", "misc.js", "gui.js"])
	$.getScript(dragonblocks.getModpath("skyblocks") + "/" + script);
