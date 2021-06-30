furnace.recipes = [];

furnace.registerRecipe = def => {
	if (! def || ! def.input || ! def.output || ! def.time)
		return;

	furnace.recipes.push(def);
};
