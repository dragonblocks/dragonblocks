/*
 * player.js
 * 
 * Copyright 2020 Elias Fleckenstein <eliasfleckenstein@web.de>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */
dragonblocks.registerTool({
	name: "dragonblocks:hand",
	interval: 500,
	groups: [
		{
			name: "default",
			damage: 2,
		},
		{
			name: "cracky",
			damage: 0,
		}
	]
});
dragonblocks.registerTool({
	name: "dragonblocks:creative_hand",
	range: Infinity,
	groups: [
		{
			name: "default",
			damage: Infinity
		}
	]
});
dragonblocks.registerEntity({
	name: "dragonblocks:player",
	gravity: true,
	width: 1,
	height: 2,
	horizontalSpeed: dragonblocks.settings.player.speed,
	verticalSpeed: dragonblocks.settings.player.jumpspeed,
	meta: {
		skin: dragonblocks.settings.player.defaultSkin,
		creative: false,
	}
});
dragonblocks.Player = class extends dragonblocks.SpawnedEntity{
	constructor(){
		if(dragonblocks.worldIsLoaded){
			super(dragonblocks.world.spawnedEntities.filter(entity => { return entity.name == "dragonblocks:player" })[0]);
			dragonblocks.world.spawnedEntities = dragonblocks.world.spawnedEntities.filter(entity => { return entity.name != "dragonblocks:player" });
		}
		else
			super(dragonblocks.entities["dragonblocks:player"], dragonblocks.map.width / 2, 5);
		dragonblocks.player = this;
		let self = this;
		// Skin
		this.skin = this.meta.skin;
		// Inventory
		this.tmp.inventory = new dragonblocks.InventoryGroup();			// Create Inventory Group that can hold multible Inventories
		// Main Inventory
		this.tmp.mainInventory = new dragonblocks.Inventory(32, 8);		// The Standard Inventory
		for(let stack of this.tmp.mainInventory.list){
			stack.addUpdateListener(_ => {
				if(dragonblocks.player.gamemode == "creative" && stack.count > 1)		// Keep itemcount of every stack at one when in creative
					stack.count = 1;
			});
		}
		if(this.meta.mainInventory)
			this.tmp.mainInventory.parse(this.meta.mainInventory);			// Load saved Inventory
		this.tmp.mainInventory.addUpdateListener(_ => {
			self.meta.mainInventory = this.tmp.mainInventory.stringify();			// Save inventory after every change
		});
		this.tmp.mainInventory.addUpdateListener(_ => {
			if(self.tmp.hudbar)
				self.tmp.hudbar.update();
		});
		// Hudbar
		this.tmp.hudbar = new dragonblocks.Hudbar(this.tmp.mainInventory, 8);		// The hudbar has 8 slots
		// Creative Inventory
		let creativelist = [];
		dragonblocks.registeredItems.filter(item => {return ! item.hidden}).forEach(item => {creativelist.push(item.name)});
		this.tmp.creativeInventory = new dragonblocks.CreativeInventory(32, creativelist, 8);		// The creative Inventory contains every registered item that is not marked as hidden
		// Survival Inventory
		this.tmp.survivalInventory = new dragonblocks.InventoryContainer({
			inventory: new dragonblocks.Craftfield(3, 3),
			top: 0.5,
			bottom: 0.5,
			left: 1,
			right: 2,
		});
		if(this.meta.survivalInventory)
			this.tmp.survivalInventory.parse(this.meta.survivalInventory);
		this.tmp.survivalInventory.addUpdateListener(_ => {
			self.meta.survivalInventory = this.tmp.survivalInventory.stringify();
		});
		//Init Inventory
		this.resetInventoryElements();
		// Map Interaction
		this.tmp.tool = null;
		this.tmp.defaultTool = this.meta.creative ? dragonblocks.getTool("dragonblocks:creative_hand") : dragonblocks.getTool("dragonblocks:hand");
		this.initMapInteraction();
		// Map Scroll
		setInterval(_ => {
			if(dragonblocks.map.displayLeft + dragonblocks.map.displayWidth < dragonblocks.player.x + dragonblocks.player.width + 3)
				dragonblocks.map.displayLeft = parseInt(dragonblocks.player.x + dragonblocks.player.width + 3 - dragonblocks.map.displayWidth);
			else if(dragonblocks.map.displayLeft > dragonblocks.player.x - 2)
				dragonblocks.map.displayLeft = parseInt(dragonblocks.player.x - 2);
			if(dragonblocks.map.displayTop + dragonblocks.map.displayHeight < dragonblocks.player.y + dragonblocks.player.height + 3)
				dragonblocks.map.displayTop = parseInt(dragonblocks.player.y + dragonblocks.player.height + 3 - dragonblocks.map.displayHeight);
			else if(dragonblocks.map.displayTop > dragonblocks.player.y - 2)
				dragonblocks.map.displayTop = parseInt(dragonblocks.player.y - 2);
			dragonblocks.map.graphicsUpdate();
		});
		// Controls
		dragonblocks.keyHandler.down(" ", _ => { dragonblocks.player.jump() });
		dragonblocks.keyHandler.up(" ", _ => { dragonblocks.player.stopJump() });
		dragonblocks.keyHandler.down("ArrowLeft", _ => { dragonblocks.player.moveLeft() });
		dragonblocks.keyHandler.down("ArrowRight", _ => { dragonblocks.player.moveRight() });
		dragonblocks.keyHandler.up("ArrowLeft", _ => { dragonblocks.player.stop() });
		dragonblocks.keyHandler.up("ArrowRight", _ => { dragonblocks.player.stop() });
		dragonblocks.keyHandler.down("i", _ => { dragonblocks.player.toggleInventory(); });
		dragonblocks.keyHandler.down("n", _ => { dragonblocks.player.nextItem() });
		dragonblocks.keyHandler.down("b", _=>{ dragonblocks.player.previousItem() });
		dragonblocks.keyHandler.down("scroll", _ => { dragonblocks.player.nextItem() });
		dragonblocks.keyHandler.up("scroll", _=>{ dragonblocks.player.previousItem() });
		for(let i = 1; i < 9; i++)
			dragonblocks.keyHandler.down(i.toString(), _ => { dragonblocks.player.select(i - 1) });
		let mapDisplay = document.getElementById("dragonblocks.map");
		addEventListener("mouseup", event => {
			if(event.which == 1)
				dragonblocks.player.digStop();
		});
		addEventListener("keydown", event => {
			if(event.key == "Escape" && dragonblocks.player.inventoryIsOpen())
				dragonblocks.player.closeInventory();
		});
		// Map Interaction Controls
		for(let x = 0; x < dragonblocks.map.displayWidth; x++){
			for(let y = 0; y < dragonblocks.map.displayHeight; y++){
				let nodeDisplay = document.getElementById("dragonblocks.map.node[" + x + "][" + y + "]");
				nodeDisplay.addEventListener("mouseover", event => {
					if(dragonblocks.player.canReach(x + dragonblocks.map.displayLeft, y + dragonblocks.map.displayTop))
						event.srcElement.style.boxShadow = "0 0 0 1px black inset";
				});
				nodeDisplay.addEventListener("mouseleave", event => {
					event.srcElement.style.boxShadow = "none";
				});
				nodeDisplay.addEventListener("mousedown", event => {
					let [ix, iy] = [x + dragonblocks.map.displayLeft, y + dragonblocks.map.displayTop]
					switch(event.which){
						case 1:
							dragonblocks.player.digStart(ix, iy);
							break;
						case 3:
							dragonblocks.player.build(ix, iy);
							break;
					}
				});
			}
		}
	}
	set skin(value){
		this.meta.skin = value;
		this.texture = dragonblocks.skins[value].texture;
		this.updateTexture();
	}
	get skin(){
		return this.meta.skin;
	}
	set gamemode(mode){
		switch(mode.toString().toLowerCase()){
			case "0":
			case "survival":
				this.meta.creative = false;
				break;
			case "1":
			case "creative":
				this.meta.creative = true;
				break;
			default:
				return false;
		}
		this.resetInventoryElements();
		this.tmp.defaultTool = dragonblocks.getTool(this.meta.creative ? "dragonblocks:creative_hand" : "dragonblocks:hand");
		return true;
	}
	get gamemode(){
		return this.meta.creative ? "creative" : "survival";
	}
	get tool(){
		return dragonblocks.getTool(this.getWieldedItem().item) || this.tmp.defaultTool;
	}
	inventoryIsOpen(){
		return this.tmp.inventory.opened;
	}
	openInventory(){
		this.tmp.inventory.open();
		dragonblocks.keyHandler.lockAll();
		dragonblocks.keyHandler.unlock("i");
		dragonblocks.gui.showLayer();
	}
	closeInventory(){
		this.tmp.inventory.close();
		dragonblocks.keyHandler.unlockAll();
		dragonblocks.gui.hideLayer();
	}
	toggleInventory(){
		this.inventoryIsOpen() ? this.closeInventory() : this.openInventory();
	}
	give(itemstring){
		return this.tmp.mainInventory.add(itemstring);
	}
	clearInventory(){
		this.tmp.mainInventory.clear();
	}
	setInventoryElements(elems){
		this.tmp.inventory.elements = elems;
	}
	resetInventoryElements(){
		let elems = [this.tmp.mainInventory];
		elems.unshift(this.gamemode == "creative" ? this.tmp.creativeInventory : this.tmp.survivalInventory);
		this.setInventoryElements(elems);
	}
	previousItem(){
		this.tmp.hudbar.previousItem();
	}
	nextItem(){
		this.tmp.hudbar.nextItem();
	}
	select(i){
		this.tmp.hudbar.select(i);
	}
	getWieldedItem(){
		return this.tmp.hudbar.getSelectedItem();
	}
	set onNextInventoryClose(func){
		this.tmp.inventory.onNextClose = func;
	}
}
Object.assign(dragonblocks.Player.prototype, dragonblocks.MapIntercation);	//Mixin
