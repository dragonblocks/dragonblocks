#	Pixel Manipulators
##	Constructing
		Pixel Manipulators are arrays that look like this:
		
		pixelmanipulator = [
			["air", "air", "air", "air", "air"],
			["air", "air", "dirt", "air", "air"],
			["air", "dirt", "§air", "dirt", "air]",
			["air", "air", "dirt", "air", "air"],
			["air", "air", "air", "air", "air"]
		];
##	The paragraph sign
		You may have noticed that the center block has a "§"
		in front of the itemstring. This is not a typo and it is
		required to have exactly ONE of these in the manipulator.
		It marks the block you have to pass to
		```dragonblocks.PixelManipulator.apply(x, y)```.
		If you apply the Pixel Manipulator, the coordinates of the
		marked node will equal the coordinates you passed to the
		method.
##	Using Pixel Manipulators
###		dragonblocks.getPixelManipulator(arr : Array)
			Once you got your Pixel Manipulator in form of an array,
			pass it to this function. It will return a Pixel
			Manipulator object.
###		dragonblocks.PixelManipulator.replace(toReplace : String, replaceWith : String)
			If you want to make your code fancier, you can use this function. You
			can replace strings you entered into the Manipulator array with other
			strings. It's not necessary to use this method.
###		dragonblocks.PixelManipulator.apply(x : int, y : int)
			This method enables you to actually place a structure
			using Pixel Manipulators.
