furnace.recipes = [];
furnace.registerRecipe = function(obj){
	if(! obj || ! obj.input || ! obj.output || ! obj.time)
		return;
	furnace.recipes.push(obj);
}
