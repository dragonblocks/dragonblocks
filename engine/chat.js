/*
 * chat.js
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

dragonblocks.Chat = class
{
	constructor()
	{
		this.input = [""];
		this.history = -1;
		this.lines = dragonblocks.settings.chat.lines;

		this.initGraphics();
		this.clear();

		dragonblocks.keyHandler.down("t", _ => {
			dragonblocks.chat.open();
		});

		dragonblocks.keyHandler.down("/", event => {
			dragonblocks.chat.open();
			this.inputDisplay.value = "/";
		});
	}

	initGraphics()
	{
		this.display = document.body.appendChild(document.createElement("div"));
		this.display.style.position = "fixed";
		this.display.style.top = "0px";
		this.display.style.left = "0px";
		this.display.style.backgroundColor = "black";
		this.display.style.opacity = "0.7";
		this.display.style.height = 23 * this.lines + "px";
		this.display.style.fontSize = "20px";
		this.display.style.color = "white";
		this.display.style.width = "100%";
		this.display.style.fontFamily = "monospace";
		this.display.style.overflowY = "scroll";
		this.display.style.scrollbarWidth = "none";
		this.display.style.visibility = "hidden";

		this.inputDisplay = document.body.appendChild(document.createElement("input"));
		this.inputDisplay.style.position = "fixed";
		this.inputDisplay.style.top = 23 * this.lines + "px";
		this.inputDisplay.style.left = "0px";
		this.inputDisplay.style.backgroundColor = "black";
		this.inputDisplay.style.border = "none";
		this.inputDisplay.style.outline = "none";
		this.inputDisplay.style.opacity = "0.7";
		this.inputDisplay.style.fontSize = "20px";
		this.inputDisplay.style.color = "white";
		this.inputDisplay.style.height = "23px";
		this.inputDisplay.style.width = "100%";
		this.inputDisplay.style.caretWidth = "30px";
		this.inputDisplay.style.caretHeight = "20px";
		this.inputDisplay.style.fontFamily = "monospace";
		this.inputDisplay.style.visibility = "hidden";

		let self = this;

		this.inputDisplay.addEventListener("keydown", event => {
			switch (event.key) {
				case "Enter":
					let message = self.inputDisplay.value;
					event.srcElement.value = "";

					if (message == "")
						return;

					self.input[self.input.length - 1] = message;
					self.send(message);
					self.input.push("");

					self.history = -1;
					break;

				case "Escape":
					self.close();
					break;

				case "ArrowUp":
					self.inputDisplay.value = self.historyUp();
					break;

				case "ArrowDown":
					self.inputDisplay.value = self.historyDown();
					break;
			}
		});

		this.inputDisplay.addEventListener("input", event => {
			self.input[self.input.length - 1] = self.inputDisplay;
		});
	}

	open()
	{
		dragonblocks.keyHandler.lockAll();

		this.display.style.visibility = "visible";
		this.inputDisplay.style.visibility = "visible";
		this.inputDisplay.focus();
	}

	close()
	{
		setTimeout(_ => {
			dragonblocks.keyHandler.unlockAll();
		});

		this.display.style.visibility = "hidden";
		this.inputDisplay.style.visibility = "hidden";
		this.inputDisplay.blur();
	}

	write(text)
	{
		text = text || "";

		if (text.startsWith("!HTML"))
			text = text.replace("!HTML", "");
		else
			text = dblib.htmlEntities(text);

		text += "<br>";

		this.display.innerHTML += text;
		this.display.lastChild.scrollIntoView();
	}

	send(input)
	{
		for (let func of dragonblocks.onChatMessageCallbacks)
			if (func(input) == false)
				return false;

		this.write(input);
	}

	historyUp()
	{
		this.history--;

		if (this.input[this.input.length + this.history] == undefined)
			this.history++;

		return this.input[this.input.length + this.history];
	}

	historyDown()
	{
		this.history++;

		if (this.input[this.input.length + this.history] == undefined)
			this.history--;

		return this.input[this.input.length + this.history];
	}

	clear()
	{
		this.display.innerHTML = "<br>".repeat(this.lines);
	}
};

dragonblocks.chat = new dragonblocks.Chat();

dragonblocks.chatMessage = msg => {
	dragonblocks.chat.write(msg);
};

dragonblocks.onChatMessageCallbacks = [];

dragonblocks.registerOnChatMessage = func => {
	dragonblocks.onChatMessageCallbacks.push(func);
};
