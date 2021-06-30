furnace.Inventory = class extends dragonblocks.InventoryContainer
{
	constructor()
	{
		super({
			inventory: new dragonblocks.Inventory(4, 2),
			top: 1,
			bottom: 1,
			left: 4,
			right: 2,
		});

		let self = this;

		this.input = new dragonblocks.ItemStack();
		this.input.addEventListener("update", _ => {
			self.update();
		});

		this.fuel = new dragonblocks.ItemStack();
		this.fuel.addEventListener("update", _ => {
			self.update();
		});

		this.burnProgressStack = new dragonblocks.ItemStack();
		this.burnProgressStack.deserialize("furnace:burn_progress_0");
		this.burnProgressStack.action = _ => {};
		this.burnProgressStack.addEventListener("redraw", event => {
			event.stack.display.style.backgroundColor = "";
			event.stack.display.style.border = "none";
		});

		this.fuelProgressStack = new dragonblocks.ItemStack();
		this.fuelProgressStack.deserialize("furnace:fuel_progress_0");
		this.fuelProgressStack.action = _ => {};
		this.fuelProgressStack.addEventListener("redraw", event => {
			event.stack.display.style.backgroundColor = "";
			event.stack.display.style.border = "none";
		});

		this.clear();
		this.clearFuel();

		this.update();
	}

	initGraphics()
	{
		super.initGraphics();

		this.input.draw(this.display, 2 * dragonblocks.settings.inventory.scale * 1.1, 0.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.fuel.draw(this.display, 2 * dragonblocks.settings.inventory.scale * 1.1, 2.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.burnProgressStack.draw(this.display, 3 * dragonblocks.settings.inventory.scale * 1.1, 1.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.fuelProgressStack.draw(this.display, 2 * dragonblocks.settings.inventory.scale * 1.1, 1.5 * dragonblocks.settings.inventory.scale * 1.1);
	}

	isEmpty()
	{
		return this.inventory.isEmpty() && ! this.fuel.item && ! this.input.item;
	}

	deserialize(str)
	{
		let data = JSON.parse(str);

		this.inventory.deserialize(data.inventory);
		this.input.deserialize(data.input);
		this.fuel.deserialize(data.fuel);
	}

	serialize()
	{
		return JSON.stringify({
			inventory: this.inventory.serialize(),
			input: this.input.serialize(),
			fuel: this.fuel.serialize()
		});
	}

	getRecipe()
	{
		for (let recipe of furnace.recipes)
			if (dragonblocks.itemMatch(recipe.input, this.input.item))
				return recipe;
	}

	getRecipeOutput()
	{
		return this.getRecipe() && this.getRecipe().output;
	}

	getRecipeTime()
	{
		return this.getRecipe() && this.getRecipe().time || 1;
	}

	clear()
	{
		this.burnProgress = 0;
		clearInterval(this.burnInterval);
		this.burning = false;
	}

	clearFuel()
	{
		this.fuelPower = this.fullFuelPower = 0;
		clearInterval(this.fuelInterval);
		this.fuelBurning = false;
	}

	update()
	{
		let self = this;

		if (! this.getRecipeOutput()) {
			this.clear();
		} else if (this.burnProgress > this.getRecipeTime()) {
			this.inventory.add(this.getRecipeOutput());
			this.clear();

			this.input.count--;
			this.input.update();
		} else if (! this.burning) {
			this.burnInterval = setInterval(_ => {
				self.burnProgress++;
				self.update();
			}, 1000);

			this.burning = true;
		}

		if (this.fuelBurning && this.fuelPower <= 0)
			this.clearFuel();

		if (! this.fuelBurning && this.burning) {
			if (this.fuel.toItem() && this.fuel.toItem().flammable) {
				this.fuelBurning = true;
				this.fullFuelPower = this.fuelPower = this.fuel.toItem().hardness;

				this.fuelInterval = setInterval(_ => {
					self.fuelPower--;
					self.update();
				}, 1000);

				this.fuel.count--;
				this.fuel.update();
			} else {
				this.clear();
			}
		}

		this.burnProgressStack.deserialize("furnace:burn_progress_" + parseInt(this.burnProgress / this.getRecipeTime() * 5));
		this.fuelProgressStack.deserialize("furnace:fuel_progress_" + (parseInt(this.fuelPower / this.fullFuelPower * 5) || 0));
	}
}
