/*
 * spawned_entity.js
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

dragonblocks.SpawnedEntity = class
{
	constructor(def, map, x, y)
	{
		dblib.copy(this, def);
		this.tmp = {map};

		if (def instanceof dragonblocks.Entity) {
			this.id = dragonblocks.getToken();
			this.jumping = this.movingRight = this.movingLeft = this.movingUp = this.movingDown = false;
			this.x = x;
			this.y = y;
			this.ax = 0;
			this.ay = 0;
			this.physicsResetX();
			this.physicsResetY();
			this.meta = this.meta || {};
			this.toEntity().oninit && this.toEntity().oninit(this);
		}

		this.restorePhysics();
		this.addGraphics();

		let self = this;

		this.tickInterval = setInterval(_ => {
			self.tick();
		}, 100);

		this.physicInterval = setInterval(_=>{
			self.physicsTick();
		});

		let entityDef = this.toEntity();
		entityDef.onspawn && entityDef.onspawn(this);

		addEventListener("focus", _ => {
			self.restorePhysics();
		});

		addEventListener("blur", _ => {
			self.restorePhysics();
		});

		map.entities.push(this);
	}

	toEntity()
	{
		return dragonblocks.entities[this.name];
	}

	despawn()
	{
		let entityDef = this.toEntity();
		entityDef.ondespawn && entityDef.ondespawn(this);

		let id = this.id;
		this.map.entities = this.map.entities.filter(entity => {
			return entity.id != id;
		});

		clearInterval(this.physicInterval);
		clearInterval(this.tickInterval);

		let display = document.getElementById("dragonblocks.entity[" + this.id + "]");
		display && display.remove();
	}

	restorePhysics()
	{
		this.tx0 = new Date().getTime() / 1000;
		this.ty0 = new Date().getTime() / 1000;
		this.x0 = this.x;
		this.y0 = this.y;
	}

	collisionX()
	{
		if (this.x < 0)
			return false;

		if (this.x + this.width > this.map.width)
			return false;

		return this.collision();
	}

	collisionY()
	{
		if (this.y < 0)
			return false;

		if (this.y + this.height > this.map.height)
			return false;

		return this.collision();
	}

	collision()
	{
		for (let ix = Math.floor(this.x); ix <= Math.ceil(this.x + this.width - 0.01) - 1; ix++)
			for (let iy = Math.floor(this.y); iy <= Math.ceil(this.y + this.height - 0.01) - 1; iy++)
				if (this.map.getNode(ix, iy).mobstable)
					return false;
		return true;
	}

	physicsResetX()
	{
		this.tx0 = new Date().getTime() / 1000;
		this.vx = 0;
		this.x0 = this.x;
		this.x = Math.round(this.x * 10) / 10;
	}

	physicsResetY()
	{
		this.ty0 = new Date().getTime() / 1000;
		this.vy = 0;
		this.y0 = this.y;
		this.y = Math.round(this.y * 10) / 10;
	}

	physicsTick()
	{
		let t = new Date().getTime() / 1000;

		let oldX = this.x;
		let dtx = t - this.tx0;

		if (this.ax)
			this.x = this.ax * dtx * dtx + this.vx * dtx + this.x0;
		else if (this.vx)
			this.x = this.vx * dtx + this.x0;

		if (! this.collisionX()) {
			this.x = oldX;
			this.physicsResetX();
			this.toEntity().oncollide && this.toEntity().oncollide(this);
		}

		let oldY = this.y;
		let dty = t - this.ty0;

		if (this.ay)
			this.y = this.ay * dty * dty + this.vy * dty + this.y0;
		else if (this.vy)
			this.y = this.vy * dty + this.y0;

		if (! this.collisionY()) {
			this.y = oldY;
			this.physicsResetY();
			this.toEntity().oncollide && this.toEntity().oncollide(this);
		}

		this.y = Math.round(this.y * 50) / 50;

		this.updateGraphics();
	}

	touch(map, x, y)
	{
		if (map != this.map)
			return false;
		for (let ix = Math.floor(this.x); ix <= Math.ceil(this.x + this.width - 0.01) - 1; ix++)
			for (let iy = Math.floor(this.y); iy <= Math.ceil(this.y + this.height - 0.01) - 1; iy++)
				if (iy == y && ix == x)
					return true;
	}

	addGraphics(obj)
	{
		let display = document.getElementById("dragonblocks.map").appendChild(document.createElement("div"));
		display.id = "dragonblocks.entity[" + this.id + "]";
		display.style.position = "absolute";
		display.style.width = this.width * dragonblocks.settings.map.scale + "px";
		display.style.height = this.height * dragonblocks.settings.map.scale + "px";
		display.style.zIndex = "0";

		display.addEventListener("mouseover", event => {
			event.srcElement.style.boxShadow = "0 0 0 1px black inset";
		});

		display.addEventListener("mouseleave", event => {
			event.srcElement.style.boxShadow = "none";
		});

		let self = this;

		display.addEventListener("mousedown", event => {
			let entityDef = self.toEntity();

			switch (event.which) {
				case 1:
					entityDef.onpunch && entityDef.onpunch(self);
					break;

				case 3:
					entityDef.onclick && entityDef.onclick(self);
					break;
			}
		});

		this.updateTexture();
		this.updateGraphics();
	}

	async updateGraphics()
	{
		let display = document.getElementById("dragonblocks.entity[" + this.id + "]");

		if (! display)
			return;

		display.style.left = (this.x - this.map.displayLeft) * dragonblocks.settings.map.scale + "px";
		display.style.top = (this.y - this.map.displayTop) * dragonblocks.settings.map.scale + "px";
	}

	updateTexture()
	{
		let display = document.getElementById("dragonblocks.entity[" + this.id + "]");
		display.style.background = dragonblocks.getTexture(this.texture);
		display.style.backgroundSize = "cover";
	}

	teleport(x, y)
	{
		this.physicsResetX();
		this.physicsResetY();
		this.x = x;
		this.y = y;
	}

	moveLeft()
	{
		if (this.vx == -this.horizontalSpeed)
			return;

		if (this.movingRight)
			this.movingRight = false;

		this.movingLeft = true;
		this.physicsResetX();
		this.vx = -this.horizontalSpeed;
	}

	moveRight()
	{
		if (this.vx == this.horizontalSpeed)
			return;

		if (this.movingLeft)
			this.movingLeft = false;

		this.movingRight = true;
		this.physicsResetX();
		this.vx = this.horizontalSpeed;
	}

	stop()
	{
		this.movingLeft = false;
		this.movingRight = false;
		this.physicsResetX();
	}

	moveDown()
	{
		if (this.vy == this.verticalSpeed)
			return;

		if (this.movingDown)
			this.movingDown = false;

		this.movingDown = true;
		this.physicsResetY();
		this.vy = this.verticalSpeed;
	}

	moveUp()
	{
		if (this.vy == -this.verticalSpeed)
			return;

		if (this.movingUp)
			this.movingUp = false;

		this.movingUp = true;
		this.physicsResetY();
		this.vy = -this.verticalSpeed;
	}

	stopFly()
	{
		this.movingUp = false;
		this.movingDown = false;
		this.physicsResetY();
	}

	canJump()
	{
		for (let x = Math.floor(this.x); x <= Math.ceil(this.x + this.width - 0.01) - 1; x++) {
			let entityY = this.y + this.height;
			let y = Math.ceil(entityY);

			if (y - entityY <= 0.01) {
				let node = this.map.getNode(x, y);

				if (! node || node.mobstable)
					return true;
			}
		}
	}

	jump()
	{
		if (! this.canJump())
			return;

		this.jumping = true;
		this.vy = -this.verticalSpeed;
	}

	stopJump()
	{
		this.jumping = false;
	}

	jumpOnce()
	{
		this.vy = -this.verticalSpeed;
	}

	set gravity(value)
	{
		this._gravity = value;

		if (this._gravity)
			this.ay = dragonblocks.settings.physics.gravity;
		else
			this.ay = 0;
	}

	get gravity()
	{
		return this._gravity;
	}

	tick()
	{
		if (this.movingLeft)
			this.moveLeft();
		if (this.movingRight)
			this.moveRight();
		if (this.movingUp)
			this.moveUp();
		if (this.movingDown)
			this.moveDown();

		if (this.jumping)
			this.jump();

		if (this.gravity)
			this.gravity = true;
	}

	get map()
	{
		return this.tmp.map;
	}
};
