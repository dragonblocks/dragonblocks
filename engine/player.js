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

dragonblocks.Player = class extends dragonblocks.SpawnedEntity
{
	constructor(data, map)
	{
		if (data)
			super(data, map);
		else
			super(dragonblocks.entities["dragonblocks:player"], map, map.width / 2, 5);

		let self = this;

		// Skin
		this.skin = this.meta.skin;

		// Inventory
		this.tmp.inventory = new dragonblocks.InventoryGroup();									// Create inventory group that can hold multiple inventories

		// Main Inventory
		this.tmp.mainInventory = new dragonblocks.Inventory(32, 8);								// The main Inventory

		if (this.meta.mainInventory)
			this.tmp.mainInventory.deserialize(this.meta.mainInventory);						// Load saved Inventory

		this.tmp.mainInventory.addEventListener("updateStack", event => {
			self.meta.mainInventory = this.tmp.mainInventory.serialize();						// Save inventory after every change

			if (self.gamemode == "creative" && event.stack.count > 1)							// Keep count of every stack at one when in creative
				event.stack.count = 1;
		});

		this.tmp.mainInventory.addEventListener("updateStack", _ => {
			if (self.tmp.hotbar)
				self.tmp.hotbar.update();
		});

		// Hotbar
		this.tmp.hotbar = new dragonblocks.Hotbar(this.tmp.mainInventory, 8);					// The hotbar has 8 slots

		// Creative Inventory
		let creativelist = [];

		dragonblocks.registeredItems.filter(item => {
			return ! item.hidden;
		}).forEach(item => {
			creativelist.push(item.name);
		});

		this.tmp.creativeInventory = new dragonblocks.CreativeInventory(32, creativelist, 8);	// The creative Inventory contains every registered item that is not marked as hidden

		// Survival Inventory
		this.tmp.survivalInventory = new dragonblocks.InventoryContainer({
			inventory: new dragonblocks.Craftfield(3, 3),
			top: 0.5,
			bottom: 0.5,
			left: 1,
			right: 2,
		});

		if (this.meta.survivalInventory)
			this.tmp.survivalInventory.deserialize(this.meta.survivalInventory);

		this.tmp.survivalInventory.addEventListener("updateStack", _ => {
			self.meta.survivalInventory = this.tmp.survivalInventory.serialize();
		});

		// Init Inventory
		this.resetInventoryElements();

		// Map Interaction
		this.tmp.tool = null;
		this.tmp.defaultTool = dragonblocks.tools[this.meta.creative ? "dragonblocks:creative_hand" : "dragonblocks:hand"];
		this.initMapInteraction();

		// Controls
		dragonblocks.keyHandler.down(" ", _ => {
			self.jump();
		});

		dragonblocks.keyHandler.up(" ", _ => {
			self.stopJump();
		});

		dragonblocks.keyHandler.down("w", _ => {
			self.jump();
		});

		dragonblocks.keyHandler.up("w", _ => {
			self.stopJump();
		});

		dragonblocks.keyHandler.down("ArrowLeft", _ => {
			self.moveLeft();
		});

		dragonblocks.keyHandler.down("ArrowRight", _ => {
			self.moveRight();
		});

		dragonblocks.keyHandler.down("a", _ => {
			self.moveLeft();
		});

		dragonblocks.keyHandler.down("d", _ => {
			self.moveRight();
		});

		dragonblocks.keyHandler.up("ArrowLeft", _ => {
			self.stop();
		});

		dragonblocks.keyHandler.up("ArrowRight", _ => {
			self.stop();
		});

		dragonblocks.keyHandler.up("a", _ => {
			self.stop();
		});

		dragonblocks.keyHandler.up("d", _ => {
			self.stop();
		});

		dragonblocks.keyHandler.down("i", _ => {
			self.toggleInventory();
		});

		dragonblocks.keyHandler.down("n", _ => {
			self.nextItem();
		});

		dragonblocks.keyHandler.down("b", _=> {
			self.previousItem();
		});

		dragonblocks.keyHandler.down("scroll", _ => {
			self.nextItem();
		});

		dragonblocks.keyHandler.up("scroll", _=>{
			self.previousItem();
		});

		for (let i = 1; i < 9; i++) {
			dragonblocks.keyHandler.down(i.toString(), _ => {
				self.select(i - 1);
			});
		}

		addEventListener("mouseup", event => {
			if (event.which == 1)
				self.digStop();
		});

		addEventListener("keydown", event => {
			if (event.key == "Escape" && self.inventoryIsOpen())
				self.closeInventory();
		});

		// Map Interaction Controls
		for (let x = 0; x < dragonblocks.mapDisplay.width; x++) {
			for (let y = 0; y < dragonblocks.mapDisplay.height; y++) {
				let nodeDisplay = dragonblocks.mapDisplay.getNode(x, y);

				nodeDisplay.addEventListener("mouseover", event => {
					if (self.canReach(x + dragonblocks.mapDisplay.left, y + dragonblocks.mapDisplay.top))
						event.srcElement.style.boxShadow = "0 0 0 1px black inset";
				});

				nodeDisplay.addEventListener("mouseleave", event => {
					event.srcElement.style.boxShadow = "none";
				});

				nodeDisplay.addEventListener("mousedown", event => {
					let [ix, iy] = [x + dragonblocks.mapDisplay.left, y + dragonblocks.mapDisplay.top];

					switch(event.which) {
						case 1:
							self.digStart(ix, iy);
							break;

						case 3:
							self.build(ix, iy);
							break;
					};
				});
			}
		}
	}

	serialize()
	{
		return dblib.removeTmp([this])[0];
	}

	setMap(map, x, y)
	{
		super.setMap(map, x, y);
		this.updateMapInteractionMap();
		dragonblocks.mapDisplay.setMap(map);
	}

	set skin(value)
	{
		this.meta.skin = value;
		this.texture = dragonblocks.registeredSkins[value].texture;
		this.updateTexture();
	}

	get skin()
	{
		return this.meta.skin;
	}

	set gamemode(mode)
	{
		this.setGamemode(mode);
	}

	get gamemode()
	{
		return this.meta.creative ? "creative" : "survival";
	}

	get tool()
	{
		return dragonblocks.tools[this.getWieldedItem().item] || this.tmp.defaultTool;
	}

	setGamemode(mode)
	{
		switch (mode.toString().toLowerCase()) {
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
		this.tmp.defaultTool = dragonblocks.tools[this.meta.creative ? "dragonblocks:creative_hand" : "dragonblocks:hand"];

		return true;
	}

	inventoryIsOpen()
	{
		return this.tmp.inventory.opened;
	}

	openInventory()
	{
		this.tmp.inventory.open();
		dragonblocks.keyHandler.lockAll();
		dragonblocks.keyHandler.unlock("i");
		dragonblocks.gui.showLayer();
	}

	closeInventory()
	{
		this.tmp.inventory.close();
		dragonblocks.keyHandler.unlockAll();
		dragonblocks.gui.hideLayer();
	}

	toggleInventory()
	{
		this.inventoryIsOpen() ? this.closeInventory() : this.openInventory();
	}

	give(itemstring)
	{
		return this.tmp.mainInventory.add(itemstring);
	}

	clearInventory()
	{
		this.tmp.mainInventory.clear();
	}

	setInventoryElements(elems)
	{
		this.tmp.inventory.setElements(elems);
	}

	resetInventoryElements()
	{
		this.setInventoryElements([this.gamemode == "creative" ? this.tmp.creativeInventory : this.tmp.survivalInventory, this.tmp.mainInventory]);
	}

	previousItem()
	{
		this.tmp.hotbar.previousItem();
	}

	nextItem()
	{
		this.tmp.hotbar.nextItem();
	}

	select(i)
	{
		this.tmp.hotbar.select(i);
	}

	getWieldedItem()
	{
		return this.tmp.hotbar.getSelectedItem();
	}

	set onNextInventoryClose(func)
	{
		this.tmp.inventory.onNextClose = func;
	}
};

Object.assign(dragonblocks.Player.prototype, dragonblocks.MapInteraction);	// Mixin
