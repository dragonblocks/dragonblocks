<?php
	require("login-config.php");
	function get_directory($path){
		$base = explode("\n", shell_exec("ls $path"));
		array_pop($base);
		echo json_encode($base);
	}
	function check_worldname($name){
		return preg_match("/^[a-zA-Z0-9]+$/", $name);
	}
	function world_exists($name){
		return check_worldname($name) && file_exists("worlds/" . $name);
	}
	switch($_POST["call"]){
		case "getGamemods":
			get_directory("game");
			break;
		case "getMods":
			get_directory("mods");
			break;
		case "getWorlds":
			get_directory("worlds");
			break;
		case "getTextures":
			get_directory("textures/* game/*/textures/* mods/*/textures/*");
			break;
		case "getSounds":
			get_directory("sounds/* game/*/sounds/* mods/*/sounds/*");
			break;
		case "isLoggedin":
			echo json_encode(is_loggedin());
			break;
		case "getUsername":
			echo get_username();
			break;
		case "checkWorldname":
			echo json_encode(check_worldname($_POST["name"]) || false);
			break;
		case "saveWorld":
			if(! is_loggedin())
				break;
			if(! $_POST["name"])
				break;
			if(! check_worldname($_POST["name"]))
				break;
			if(! world_exists($_POST["name"]))
				mkdir("worlds/" . $_POST["name"]);
			else if(file_get_contents("worlds/" . $_POST["name"] . "/owner.txt") != get_username())
				return;
			file_put_contents("worlds/" . $_POST["name"] . "/world.json", $_POST["world"]);
			file_put_contents("worlds/" . $_POST["name"] . "/owner.txt", get_username());
			break;
	}
?>
