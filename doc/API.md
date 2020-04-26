TODO: This Documentation is unfull and partly deprecated!
# API Documentation
##	Methods
		dragonblocks.addFinalStep(function() : void) : void
			Execute the function after all mods are loaded, the player is spawned and the map is generated.
		dragonblocks.chatMessage(message : String) : void
			Write something into the chatconsole. (alias for dragonblocks.chat.write)
		dragonblocks.checkWorldExistance(worldname : String) : Boolean
			Check if a world exists or not
		dragonblocks.checkWorldOwnership(worldname : String) : Boolean
			Check if a world is owned by the user
		dragonblocks.checkWorldSpelling(worldname : String) : Boolean
			Check if a worldname is OK (e.g. does not contain special chacters)
		dragonblocks.clearTimer(name : String, meta : Object) : void
			Clear a timer set using  dragonblocks.setTimer
		dragonblocks.createItemstack(itemstring : String) : dragonblocks.Itemstack
			Create an Itemstack object and immediately parse the provided itemstring.
		dragonblocks.error(errorstring : String) : void
			Throw an error. (errorstring is added to dragonblocks.backlog)
		dragonblocks.finalize() : void
			Execute the final steps added using dragonblocks.addFinalStep. Not to be used!
		dragonblocks.finishTimer(name : String, meta : Object) : void
			Immediately finish a timer set using dragonblocks.setTimer
		dragonblocks.generateMap() : void
			Run the Mapgen selected in the mainmenu. Not to be used.
		dragonblocks.getEmptyWorld() : Object
			Returns an Empty World save object. Not to be used.
		dragonblocks.getModpath(modname : String) : String
			Returns the path of an Mod or Gamemod. Use this instead of e.g. "mods/" + modname + "/" + ...
		dragonblocks.getNode(x, y) : dragonblocks.MapNode
			Returns the MapNode at x, y.
		dragonblocks.getPixelManipulator(manip : Array) : dragonblocks.PixelManipulator
			Returns an Pixel Manipulator. Same as new dragonblocks.PixelManipulator(manip)
		dragonblocks.getSavestring() : String
			Return the save string for the world
		dragonblocks.getSound(filename : String) : String
			Return the path for an sound file. These files can be placed in the folders mods/*/sounds, game/*/sounds and sounds. If not found, it will just return the filename.
		dragonblocks.getTexture(filename : String) : String
			Same as dragonblocks.getSound, exept for Textures and, if the file is found, it will surrond it with url() so you can do elem.style.background = dragonblocks.getTexture(...)
		dragonblocks.getToken() : String
			Returns a unique string starting with #
		dragonblocks.getVersion() : String
			Returns the version string (something like "Dragonblocks 3.0")
		dragonblocks.isValidItemstring(itemstring : String)
			Check if an Itemstring is OK
		dragonblocks.gui.toggleLayer() : void
			Toggle the Layer. 
		dragonblocks.gui.openLayer() : void
		dragonblocks.gui.showLayer() : void
			Open the Layer
		dragonblocks.gui.closeLayer() : void
		dragonblocks.gui.hideLayer() : void
			Hide the Layer
		dragonblocks.gui.createBox(properties : Object) : Element
			Creates a dragonblocks.gui.Box(properties) and returns an object to access it.
			Valid properties are closeable : boolean, id : String, scroll : boolean, moveable : boolean, size : String ("big" or "small"), layer : boolean, keylock : boolean
		
##	Objects
		dragonblocks.availableMods : Array
			A list of all mods
		dragonblocks.backlog : String
			Contains everything logged using dragonblocks.log
		dragonblocks.chat : dragonblocks.Chat
			The dragonblocks chatconsole.
		dragonblocks.chatcommands : Object
			Contains all registered chatcommands
		dragonblocks.entities : Object
			Contains all registered entities
		dragonblocks.gamemods : Array
			Contains the gamemods
		dragonblocks.groups : Object
			Contains all registered groups
		dragonblocks.items : Object
			Contains all registered items
		dragonblocks.itemstacks : Object
			Contains all created Itemstacks
		dragonblocks.keyHandler: dragonblocks.KeyHandler
			The Keyhandler
	Classes
	 
