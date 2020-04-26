<!DOCTYPE php>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="icon" href="textures/icon.png">
		<link rel="stylesheet" href="style.css">
		<?php
			$libs = scandir("lib");
			for($i = 0; $i < count($libs); $i++){
				if($libs[$i][0] == ".")
					continue;
				echo "<script src='lib/$libs[$i]'></script>";
			}
		?>
	<script defer src="engine/init.js"></script>
	</head>
	<body>
		<center id="elidragon">
			<img src="textures/elidragon.png" width="90%">
			<h3 id="elidragon.status">init.js</h3>
			<div style="border-style: solid; width: 90%; height: 50px; position:relative;" >
				<div style="height: calc(100% - 10px); width: calc(100% - 10px); left: 5px; top: 5px; position:absolute">
					<div style="background-color: yellow; height: 100%; left: 0px; top: 0px; position:absolute" id="elidragon.loadbar"></div>
				</div>
			</div>
		</center>
	</body>
</html>
