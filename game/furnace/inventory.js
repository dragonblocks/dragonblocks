furnace.Inventory = class extends dragonblocks.InventoryContainer{
	constructor(){
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
		this.burnProgressDisplay = new dragonblocks.ItemStack();
		this.burnProgressDisplay.deserialize("furnace:burn_progress_0");
		this.burnProgressDisplay.action = _ => {};
		this.burnProgressDisplay.addEventListener("redraw", _ => {
			dragonblocks.Inventory.getStackDisplay(self.burnProgressDisplay.id).style.backgroundColor = "";
			dragonblocks.Inventory.getStackDisplay(self.burnProgressDisplay.id).style.border = "none";
		});
		this.fuelProgressDisplay = new dragonblocks.ItemStack();
		this.fuelProgressDisplay.deserialize("furnace:fuel_progress_0");
		this.fuelProgressDisplay.action = _ => {};
		this.fuelProgressDisplay.addEventListener("redraw", _ => {
			dragonblocks.Inventory.getStackDisplay(self.fuelProgressDisplay.id).style.backgroundColor = "";
			dragonblocks.Inventory.getStackDisplay(self.fuelProgressDisplay.id).style.border = "none";
		});
		this.clear();
		this.clearFuel();
		this.update();
	}
	draw(parent, x, y){
		if(! super.draw(parent, x, y))
			return false;
		this.input.draw(this.getDisplay(), 2 * dragonblocks.settings.inventory.scale * 1.1, 0.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.burnProgressDisplay.draw(this.getDisplay(), 3 * dragonblocks.settings.inventory.scale * 1.1, 1.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.fuelProgressDisplay.draw(this.getDisplay(), 2 * dragonblocks.settings.inventory.scale * 1.1, 1.5 * dragonblocks.settings.inventory.scale * 1.1);
		this.fuel.draw(this.getDisplay(), 2 * dragonblocks.settings.inventory.scale * 1.1, 2.5 * dragonblocks.settings.inventory.scale * 1.1);
		return true;
	}
	isEmpty(){
		return this.inventory.isEmpty() && ! this.fuel.item && ! this.input.item;
	}
	deserialize(str){
		let obj = JSON.parse(str);
		this.inventory.deserialize(obj.inventory);
		this.input.deserialize(obj.input);
		this.fuel.deserialize(obj.fuel);
	}
	serialize(){
		return JSON.stringify({
			inventory: this.inventory.serialize(),
			input: this.input.serialize(),
			fuel: this.fuel.serializes()
		});
	}
	getRecipe(){
		for(let recipe of furnace.recipes)
			if(dragonblocks.itemMatch(recipe.input, this.input.item))
				return recipe;
	}
	getRecipeOutput(){
		return this.getRecipe() && this.getRecipe().output;
	}
	getRecipeTime(){
		return this.getRecipe() && this.getRecipe().time || 1;
	}
	clear(){
		this.burnProgress = 0;
		clearInterval(this.burnInterval);
		this.burning = false;
	}
	clearFuel(){
		this.fuelPower = this.fullFuelPower = 0;
		clearInterval(this.fuelInterval);
		this.fuelBurning = false;
	}
	update(){
		super.update();
		let self = this;
		if(! this.getRecipeOutput())
			this.clear();
		else if(this.burnProgress > this.getRecipeTime()){
			this.inventory.add(this.getRecipeOutput())
			this.clear();
			this.input.count--;
			this.input.update();
		}
		else if(! this.burning){
			this.burnInterval = setInterval(_ => {
				self.burnProgress++;
				self.update();
			}, 1000);
			this.burning = true;
		}
		if(this.fuelBurning && this.fuelPower <= 0)
			this.clearFuel();
		if(! this.fuelBurning && this.burning){
			if(this.fuel.toItem() && this.fuel.toItem().flammable){
				this.fuelBurning = true;
				this.fullFuelPower = this.fuelPower = this.fuel.toItem().hardness;
				this.fuelInterval = setInterval(_ => {
					self.fuelPower--;
					self.update();
				}, 1000);
				this.fuel.count--;
				this.fuel.update();
			}
			else
				this.clear();
		}
		this.burnProgressDisplay.deserialize("furnace:burn_progress_" + parseInt(this.burnProgress / this.getRecipeTime() * 5));
		this.fuelProgressDisplay.deserialize("furnace:fuel_progress_" + (parseInt(this.fuelPower / this.fullFuelPower * 5) || 0));
	}
}
