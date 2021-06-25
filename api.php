<?php
	require("login-config.php");
	error_reporting(E_ERROR | E_PARSE);

	function get_files($path)
	{
		$base = explode("\n", shell_exec("ls $path 2>/dev/null"));
		array_pop($base);
		echo json_encode($base);
	}

	function walk_directory($path, $func)
	{
		$data = array();

		$files = scandir($path);

		foreach ($files as $filename) {
			if ($filename[0] == ".")
				continue;

			$result = $func($filename, $path . "/" . $filename);

			$data[$filename] = $result;
		}

		echo json_encode($data);
	}

	function check_worldname($name)
	{
		return preg_match("/^[a-zA-Z0-9]+$/", $name);
	}

	function world_exists($name)
	{
		return check_worldname($name) && file_exists("worlds/" . $name);
	}

	function get_mods($path)
	{
		walk_directory($path, function($modname, $modpath) {
			$dependencies = file_get_contents($modpath . "/dependencies.txt");

			return array(
				"name" => $modname,
				"description" => file_get_contents($modpath . "/description.txt"),
				"dependencies" => $dependencies ? array_values(array_filter(explode("\n", $dependencies))) : array(),
				"path" => $modpath,
			);
		});
	}

	switch($_POST["call"]) {
		case "getGamemods":
			get_mods("game");
			break;

		case "getMods":
			get_mods("mods");
			break;

		case "getWorlds":
			walk_directory("worlds", function($worldname, $path) {
				return array(
					"name" => $worldname,
					"owned" => is_loggedin() && get_username() == file_get_contents($path . "/owner.txt"),
				);
			});
			break;

		case "getTextures":
			get_files("textures/* game/*/textures/* mods/*/textures/*");
			break;

		case "getSounds":
			get_files("sounds/* game/*/sounds/* mods/*/sounds/*");
			break;

		case "isLoggedin":
			echo json_encode(is_loggedin());
			break;

		case "getUsername":
			echo get_username();
			break;

		case "saveWorld":
			if (! is_loggedin())
				return;
			else if (! $_POST["name"])
				return;
			else if (! check_worldname($_POST["name"]))
				return;

			if (! world_exists($_POST["name"]))
				mkdir("worlds/" . $_POST["name"]);
			else if (file_get_contents("worlds/" . $_POST["name"] . "/owner.txt") != get_username())
				return;

			file_put_contents("worlds/" . $_POST["name"] . "/world.json", $_POST["world"]);
			file_put_contents("worlds/" . $_POST["name"] . "/owner.txt", get_username());
			break;

		case "commitID":
			echo shell_exec("git rev-parse --short HEAD");
			break;
	}
?>
